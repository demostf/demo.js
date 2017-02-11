require('source-map-support').install();

var Demo = require('../index');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2), {boolean: true});

if (argv._.length !== 1) {
	console.log('Usage: "node analyse [--strings] [--dump] [--head] FILE"');
	process.exit(1);
}

var echo = function (data) {
	var string = JSON.stringify(data, null, 2);
	console.log(string);
};

//var stream = fs.createReadStream(argv._[0]);
//
//var demo = Demo.fromNodeStream(stream);
//var parser = demo.getParser();
//parser.on('done', function (state) {
//	echo(state);
//});
//parser.start();

fs.readFile(argv._[0], function (err, data) {
	if (err) throw err;
	var demo = Demo.fromNodeBuffer(data);
	var parser = demo.getParser();
	var head = parser.readHeader();
	if (argv.head) {
		echo(head);
		return;
	}
	var match = parser.parseBody();
	if (argv.dump) {
		echo(parser.match.packets);
	} else if (argv.strings) {
		echo(parser.match.strings);
	} else {
		echo(match.getState());
	}
});
