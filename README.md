# demo.js

[![Build Status](https://travis-ci.org/icewind1991/demo.js.svg?branch=master)](https://travis-ci.org/icewind1991/demo.js)

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
	console.log(body.getState());
});
```

### more information from packets

Using the javascript api it's possible to get far more information out of a demo
file than the basic state provided by the cli interface.

```js
var Demo = require('tf2-demo');
var fs = require('fs');

fs.readFile("example.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	var match = parser.match;
	parser.on('packet', function(packet) {
		// where you can either get information directly from the packet (see ./src/Data/Packet.ts)
		// or use the `match` object which has contains an (incomplete) state of the match at the current tick
	});
	parser.parseBody();
});
```


## A note on POV demos

During the development of this project the main focus has always been on parsing
STV demos. Parsing POV demos is a lot more error prone and has known issues.

### Known issue with POV demos

- Not all player names can be parsed correctly, resulting in multiple players
having `null` as a name in the output.

## Credits

Special thanks goes to

- Panzer for [DemoLib](https://github.com/PazerOP/DemoLib)
- The StatsHelix team for [DemoInfo](https://github.com/StatsHelix/demoinfo)
- The SkadiStats for [smoke](https://github.com/skadistats/smoke)

Without the information provided by these projects this would not have been possible
