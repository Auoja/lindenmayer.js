const ANTICLOCK = '+';
const CLOCKWISE = '-';
const PUSH = '[';
const POP = ']';
const DRAW = 'F';

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

    return this;
}

LSystem.prototype.iterate = function() {
    var newTree = '';
    var node;

    for (var i = 0; i < this.tree.length; i++) {
        node = this.tree.charAt(i);
        newTree += this.rules[node] || node;
    }

    this.tree = newTree;

    return this.tree;
}

function RenderL(conf) {

    this.tree = conf.system.tree;
    this.angle = conf.angle;
    this.canvas = conf.canvas;
    this.context = conf.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.boundingBox = {
        minX: 0,
        minY: 0,
        maxX: this.width,
        maxY: this.height
    };
    this.pen = new Pen(0, 0, 0);

    this.padding = 20;


    this.render = function() {

        this.tree = this.tree.replace(/[^F\+\-\[\]]/g, '');

        var defaultDist = Math.max(this.width, this.height);

        this.process(defaultDist, false);

        var newDistX = ((this.width - this.padding * 2) / (this.boundingBox.maxX - this.boundingBox.minX)) * defaultDist;
        var newDistY = ((this.height - this.padding * 2) / (this.boundingBox.maxY - this.boundingBox.minY)) * defaultDist;

        var newDist = newDistX < newDistY ? newDistX : newDistY;

        this.boundingBox.minX *= (newDist / defaultDist);
        this.boundingBox.maxX *= (newDist / defaultDist);
        this.boundingBox.minY *= (newDist / defaultDist);
        this.boundingBox.maxY *= (newDist / defaultDist);

        var xoffset = (this.width / 2) - (((this.boundingBox.maxX - this.boundingBox.minX) / 2) + this.boundingBox.minX);
        var yoffset = (this.height / 2) - (((this.boundingBox.maxY - this.boundingBox.minY) / 2) + this.boundingBox.minY);

        this.pen = new Pen(xoffset, yoffset, 0, this.pen.color);

        this.process(newDist, true);
    };

    return this;

}

RenderL.prototype.process = function(dist, draw) {

    var penStates = [];

    for (var i = 0; i < this.tree.length; i++) {
        switch (this.tree.charAt(i)) {
            case ANTICLOCK:
                this.pen.angle += this.angle;
                break;
            case CLOCKWISE:
                this.pen.angle -= this.angle;
                break;
            case PUSH:
                penStates.push(new Pen(this.pen.x, this.pen.y, this.pen.angle, this.pen.color));
                break;
            case POP:
                this.pen = penStates.pop();
                break;
            case DRAW:
                this.drawForward(dist, draw);
                break;
        }
    }
};

RenderL.prototype.drawForward = function(dist, draw) {

    var lastX = this.pen.x;
    var lastY = this.pen.y;
    var angle = this.pen.angle * RAD;

    this.pen.x += dist * Math.cos(angle);
    this.pen.y += dist * Math.sin(angle);

    if (this.pen.x < this.boundingBox.minX) {
        this.boundingBox.minX = this.pen.x;
    } else if (this.pen.x > this.boundingBox.maxX) {
        this.boundingBox.maxX = this.pen.x;
    }

    if (this.pen.y < this.boundingBox.minY) {
        this.boundingBox.minY = this.pen.y;
    } else if (this.pen.y > this.boundingBox.maxY) {
        this.boundingBox.maxY = this.pen.y;
    }

    if (draw) {
        this.context.beginPath();
        this.context.moveTo(lastX, lastY);
        this.context.lineTo(this.pen.x, this.pen.y);
        this.context.strokeStyle = this.pen.color;
        this.context.closePath();
        this.context.stroke();
    }
};