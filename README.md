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

