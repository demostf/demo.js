var Demo = require('./demo');
var fs = require('fs');

fs.readFile("gully.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	//console.log(parser.readHeader());
	//parser.parseBody()
	console.log(parser.parseBody());
});
