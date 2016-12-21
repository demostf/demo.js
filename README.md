# demo.js

Parsing of TF2 demo files in node.js and the browser

## usage

###cli

```
node bin/analyse demo.dem
```

### api

```js
var Demo = require('tf2-demo');
var fs = require('fs');

fs.readFile("example.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	console.log(head);
	var body = parser.parseBody();
	console.log(body);
});
```

## A note on POV demos

During the development of this project the main focus has always been on parsing
STV demos. Parsing POV demos is a lot more error prone and has known issues.

### Known issue with POV demos

- Not all player names can be parsed correctly, resulting in multiple players
having `null` as a name in the output.
