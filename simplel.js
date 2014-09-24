function StringArray(s) {
    this.str = [];
    this.count = 0;
    if (s) {
        for (var i = 0; i < s.length; i++) {
            this.str.push(s.charAt(i));
            this.count++;
        }
    }
    return this;
}

StringArray.prototype.append = function append(s) {
    this.str = this.str.concat(s);
    this.count += s.length;
    return this;
};

StringArray.prototype.length = function length() {
    return this.count;
};

function Pen(x, y, d) {
    this.x = x;
    this.y = y;
    this.angle = d;
}

function LSystem(conf) {

    var tree = new StringArray(conf.seed);
    var rules = conf.rules;

    var keys = Object.keys(conf.rules);

    for (var i = keys.length - 1; i >= 0; i--) {
        rules[keys[i]] = new StringArray(conf.rules[keys[i]]);
    }

    var iterate = function() {

        var newTree = new StringArray();
        var node = [];
        for (var i = 0; i < tree.length(); i++) {
            node = tree.str[i];
            var rule = rules[node];
            newTree.append(rule != null ? rule.str : [node]);
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

    var x = 0;
    var y = 250;
    var angle = 0;

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
        for (var i = 0; i < tree.length(); i++) {
            node = tree.str[i];

            if (node === 'F') {
                drawForward(8);
            } else if (node === '+') {
                pen.angle += 0.392699082;
            } else if (node === '-') {
                pen.angle -= 0.392699082;
            } else if (node === '[') {
                penStates.push(new Pen(pen.x, pen.y, pen.angle));
            } else if (node === ']') {
                pen = penStates.pop();
            }

        }

    };

    return {
        render: render
    }

}