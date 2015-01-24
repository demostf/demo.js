var Demo = require('./demo');
var fs = require('fs');

fs.readFile("upward.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	//console.log(parser.readHeader());
	//var message;
	//parser.parseBody()
	console.log(parser.parseBody());
	//while (message = parser.readMessage()) {
	//	if (message.parse) {
	//		message.parse();
	//	}
	//}
});
