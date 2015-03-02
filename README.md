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
