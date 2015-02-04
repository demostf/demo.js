var Demo = require('./demo');
var fs = require('fs');

fs.readFile("bin/54cbce7f7479dmatch-20150130-1912-cp_process_final.dem", function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	//console.log(head);
	var body = parser.parseBody();
	//console.log(body);
});
