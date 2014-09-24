const ANTICLOCK = '+';
const CLOCKWISE = '-';
const PUSH = '[';
const POP = ']';
const RAD = Math.PI / 180;


function Pen(x, y, d, c) {
    this.x = x;
    this.y = y;
    this.angle = d;
    this.color = c || 'rgb(0,0,0)';
}

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

    var pen = conf.pen;

    function drawForward(dist) {
        var lastX = pen.x;
        var lastY = pen.y;

        var rad = pen.angle * RAD;
        pen.x += dist * Math.cos(rad);
        pen.y += dist * Math.sin(rad);

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(pen.x, pen.y);
        context.strokeStyle = pen.color;
        context.closePath();
        context.stroke();
    }


    this.render = function() {

        var node;
        for (var i = 0; i < tree.length; i++) {
            node = tree.charAt(i);

            switch (node) {
                case ANTICLOCK:
                    pen.angle += conf.angle;
                    break;
                case CLOCKWISE:
                    pen.angle -= conf.angle;
                    break;
                case PUSH:
                    penStates.push(new Pen(pen.x, pen.y, pen.angle, pen.color));
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