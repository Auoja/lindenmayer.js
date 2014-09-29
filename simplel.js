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

        var pen = new Pen(0, 0, 0, conf.color);
        var constants = conf.constants || [DRAW];


        var padding = 20;

        // Private

        var process = function(dist, draw) {

            var penStates = [];

            for (var i = 0; i < tree.length; i++) {
                switch (tree.charAt(i)) {
                    case ANTICLOCK:
                        pen.angle += angle;
                        break;
                    case CLOCKWISE:
                        pen.angle -= angle;
                        break;
                    case PUSH:
                        penStates.push(new Pen(pen.x, pen.y, pen.angle, pen.color));
                        break;
                    case POP:
                        pen = penStates.pop();
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

        // Public

        this.getTree = function() {
            return tree;
        };

        this.addConstants = function(c) {
            constants = constants.concat(c);
        };

        this.iterate = function() {
            var newTree = '';
            var node;

            for (var i = 0; i < tree.length; i++) {
                node = tree.charAt(i);
                newTree += rules[node] || node;
            }

            tree = newTree;

            return tree;
        };

        this.render = function() {

            var re = new RegExp('[^' + constants.join('') + '\\+\\-\\[\\]]', 'g');
            tree = tree.replace(re, '');

            var defaultDist = Math.max(width, height);

            process(defaultDist, false);

            var newDistX = ((width - padding * 2) / (boundingBox.maxX - boundingBox.minX)) * defaultDist;
            var newDistY = ((height - padding * 2) / (boundingBox.maxY - boundingBox.minY)) * defaultDist;

            var newDist = newDistX < newDistY ? newDistX : newDistY;

            boundingBox.minX *= (newDist / defaultDist);
            boundingBox.maxX *= (newDist / defaultDist);
            boundingBox.minY *= (newDist / defaultDist);
            boundingBox.maxY *= (newDist / defaultDist);

            var xoffset = (width / 2) - (((boundingBox.maxX - boundingBox.minX) / 2) + boundingBox.minX);
            var yoffset = (height / 2) - (((boundingBox.maxY - boundingBox.minY) / 2) + boundingBox.minY);

            pen = new Pen(xoffset, yoffset, 0, pen.color);

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