var LSystem = (function() {

    var ANTICLOCK = '+';
    var CLOCKWISE = '-';
    var PUSH = '[';
    var POP = ']';
    var DRAW = 'F';
    var RAD = Math.PI / 180;

    function Pen(x, y, d, c) {
        this.x = x;
        this.y = y;
        this.angle = d;
        this.color = c || 'rgb(0,0,0)';
    }

    function LSystem(conf) {
        var tree = conf.seed;
        var angle = conf.angle;
        var rules = conf.rules;

        var canvas = conf.canvas;
        var context = conf.canvas.getContext('2d');

        var width = canvas.width;
        var height = canvas.height;

        var boundingBox = {
            minX: 0,
            minY: 0,
            maxX: width,
            maxY: height
        };

        var pen;
        var constants = conf.constants || [DRAW];


        var padding = 20;

        // Private

        var process = function(dist, draw) {

            var penStack = [];

            for (var i = 0; i < tree.length; i++) {
                switch (tree.charAt(i)) {
                    case ANTICLOCK:
                        pen.angle += angle;
                        break;
                    case CLOCKWISE:
                        pen.angle -= angle;
                        break;
                    case PUSH:
                        penStack.push(new Pen(pen.x, pen.y, pen.angle, pen.color));
                        break;
                    case POP:
                        pen = penStack.pop();
                        break;
                    default:
                        drawForward(dist, draw);
                        break;
                }
            }
        };

        var drawForward = function(dist, draw) {

            var lastX = pen.x;
            var lastY = pen.y;
            var angle = pen.angle * RAD;

            pen.x += dist * Math.cos(angle);
            pen.y += dist * Math.sin(angle);

            if (pen.x < boundingBox.minX) {
                boundingBox.minX = pen.x;
            } else if (pen.x > boundingBox.maxX) {
                boundingBox.maxX = pen.x;
            }

            if (pen.y < boundingBox.minY) {
                boundingBox.minY = pen.y;
            } else if (pen.y > boundingBox.maxY) {
                boundingBox.maxY = pen.y;
            }

            if (draw) {
                context.beginPath();
                context.moveTo(lastX, lastY);
                context.lineTo(pen.x, pen.y);
                context.strokeStyle = pen.color;
                context.closePath();
                context.stroke();
            }
        };

        var calculateDistance = function(oldDistance) {
            var newDistX = ((width - padding * 2) / (boundingBox.maxX - boundingBox.minX)) * oldDistance;
            var newDistY = ((height - padding * 2) / (boundingBox.maxY - boundingBox.minY)) * oldDistance;

            return newDistX < newDistY ? newDistX : newDistY;
        };

        var calculateOffset = function(newDist, oldDist) {
            boundingBox.minX *= (newDist / oldDist);
            boundingBox.maxX *= (newDist / oldDist);
            boundingBox.minY *= (newDist / oldDist);
            boundingBox.maxY *= (newDist / oldDist);

            return {
                x: (width / 2) - (((boundingBox.maxX - boundingBox.minX) / 2) + boundingBox.minX),
                y: (height / 2) - (((boundingBox.maxY - boundingBox.minY) / 2) + boundingBox.minY)
            };
        };

        // Public

        this.getTree = function() {
            return tree;
        };

        this.addConstants = function(c) {
            constants = constants.concat(c);
        };

        this.iterate = function(iterations) {

            var node;
            var it = iterations || 1;

            for (var i = 0; i < it; i++) {
                var newTree = '';
                for (var j = 0; j < tree.length; j++) {
                    node = tree.charAt(j);
                    newTree += rules[node] || node;
                }
                tree = newTree;
            }

            return tree;
        };

        this.render = function() {
            // Cleanup unused commands in tree
            var reg = new RegExp('[^' + constants.join('') + '\\+\\-\\[\\]]', 'g')
            tree = tree.replace(reg, '');

            // First Pass
            var defaultDist = Math.max(width, height);
            pen = new Pen(0, 0, 0, conf.color);
            process(defaultDist, false);

            // Second Pass
            var newDist = calculateDistance(defaultDist);
            var offset = calculateOffset(newDist, defaultDist);
            pen = new Pen(offset.x, offset.y, 0, conf.color);
            process(newDist, true);
        };

        return this;
    }

    var createLSystem = function(conf) {
        return new LSystem(conf);
    };

    return {
        createLSystem: createLSystem
    }

})();