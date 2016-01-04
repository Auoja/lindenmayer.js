# lindenmayer.js

A simple [L-System](http://en.wikipedia.org/wiki/L-system) implementation in JavaScript.

## Introduction

An L-System is a way of generating self similar fractals using a set of simple commands and production rules. By replacing each symbol of the initial seed using these production rules it is possible construct very complex geometric structures after just a few iterations.

### Rendering

Rendering of the generated tree is done using [Turtle Graphics](http://en.wikipedia.org/wiki/Turtle_graphics). The commands supported are:

__\+__    Anticlockwise rotation.

__\-__    Clockwise rotation.

__\[__    Push to stack (Save current position and angle).

__\]__    Pop from stack (Restore saved position and angle).

__F__    Draw forward.


### Basic Usage


```javascript

	var canvas = document.getElementById('canvas');

	var plant = Lindenmayer.createLSystem({
		seed: 'X',
		rules: {
			'X': 'F-[[X]+X]+F[+FX]-X',
			'F': 'FF'
		},
		canvas: canvas,
		angle: 22.5
	});
    
	plant.iterate(8);
    
	plant.render();
    
```

This will render an L-System that fills the entire canvas. `X` is the starting seed of the system. The `rules` object lists the production rules used to expand the tree each iteration. `angle` is used when rendering and dictates the amount the rotation commands will alter the drawing direction.

### More Advanced Usage


```javascript

	var canvas = document.getElementById('canvas');

	var sierpinskiTriangle = Lindenmayer.createLSystem({
		seed: 'A',
		rules: {
			'A': 'B-A-B',
			'B': 'A+B+A'
		},
		canvas: canvas,
		angle: 60,
		constants: ['A', 'B'],
		initialAngle: 90,
		x: 100,
		y: 200,
		width: 512,
		height: 512,
		color: '#0000ff'
	});
	
	sierpinskiTriangle.iterate(9);

	sierpinskiTriangle.render();
    
```

`F` is the default drawing command. By adding `constants` it is possible to use others as well, in this case `A` and `B`. `initialAngle` is the starting direction of the L-System. `x`, `y`, `width` and `height` should be self explanatory as well as `color`.

