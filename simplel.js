function Pen(x, y, d) {
    this.x = x;
    this.y = y;
    this.angle = d;
}

const ANTICLOCK = '+';
const CLOCKWISE = '-';
const PUSH = '[';
const POP = ']';

function LSystem(conf) {

    var tree = conf.seed;
    var rules = conf.rules;

    var iterate = function() {

        var newTree = '';
        var node;

        for (var i = 0; i < tree.length; i++) {
            node = tree.charAt(i);
            newTree += rules[node] || node;
        }

        tree = newTree;
        return tree;
    };

    var getTree = function() {
        return tree;
    }

    return {
        getTree: getTree,
        iterate: iterate
    };

}

function RenderL(conf) {

    var tree = conf.tree;
    var rules = conf.rules;
    var context = conf.context;

    var penStates = [];

    var pen = new Pen(0, 250, 0);

    function drawForward(dist) {

        var lastX = pen.x;
        var lastY = pen.y;

        var rad = pen.angle;
        pen.x += dist * Math.cos(rad);
        pen.y += dist * Math.sin(rad);

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(pen.x, pen.y);
        context.closePath();
        context.stroke();

    }


    var render = function() {

        var node;
        for (var i = 0; i < tree.length; i++) {
            node = tree.charAt(i);

            switch (node) {
                case ANTICLOCK:
                    pen.angle += 0.392699082;
                    break;
                case CLOCKWISE:
                    pen.angle -= 0.392699082;
                    break;
                case PUSH:
                    penStates.push(new Pen(pen.x, pen.y, pen.angle));
                    break;
                case POP:
                    pen = penStates.pop();
                    break;
                default:
                    drawForward(8);
                    break;
            }
        }

    };

    return {
        render: render
    }

}