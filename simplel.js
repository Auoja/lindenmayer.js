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

    this.tree = conf.seed;
    this.rules = conf.rules;

    this.iterate = function() {
        var newTree = '';
        var node;

        for (var i = 0; i < this.tree.length; i++) {
            node = this.tree.charAt(i);
            newTree += this.rules[node] || node;
        }

        this.tree = newTree;

        return this.tree;
    };

    return this;
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


    this.render = function() {

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

    return this;

}