# demo.js

[![Build Status](https://travis-ci.org/demostf/demo.js.svg?branch=master)](https://travis-ci.org/demostf/demo.js)

Parsing of TF2 demo files in node.js and the browser

## usage

### cli

```
node bin/analyse demo.dem
```

### api

```js
var Demo = require('@demostf/demo.js');
var fs = require('fs');

fs.readFile("example.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var analyser = demo.getAnalyser();
	var head = analyser.getHeader();
	console.log(head);
	var body = analyser.getBody();
	console.log(body.getState());
});
```

### more information from packets

Using the javascript api it's possible to get far more information out of a demo
file than the basic state provided by the cli interface.

```js
var Demo = require('@demostf/demo.js');
var fs = require('fs');

fs.readFile("example.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var analyser = demo.getAnalyser();
	var head = analyser.getHeader();
	var match = analyser.match;
	for (const packet of analyser.getPackets()) {
		// where you can either get information directly from the packet (see ./src/Data/Packet.ts)
		// or use the `match` object which has contains an (incomplete) state of the match at the current tick
	}
});
```


## A note on POV demos

During the development of this project the main focus has always been on parsing
STV demos.
Although there are currently no known issues iwth POV demos parsing them is a lot more error prone.

## Credits

Special thanks goes to

- Panzer for [DemoLib](https://github.com/PazerOP/DemoLib)
- The StatsHelix team for [DemoInfo](https://github.com/StatsHelix/demoinfo)
- The SkadiStats for [smoke](https://github.com/skadistats/smoke)

Without the information provided by these projects this would not have been possible
