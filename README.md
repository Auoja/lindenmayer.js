# lindenmayer.js

A simple L-System implementation in JavaScript.


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

This will render an L-System that fills the canvas.

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

`F` is the default drawing command, by adding `constants` it is possible to use others as well, in this case `A` and `B`. `initialAngle` is the starting direction of the L-System. `x`, `y`, `width` and `height` should be self explanatory as well as `color`.