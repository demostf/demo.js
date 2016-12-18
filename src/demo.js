var BitStream = require('bit-buffer').BitStream;
var Parser = require('./parser');
var StreamParser = require('./StreamParser');

var Demo = function (arrayBuffer) {
	this.stream = new BitStream(arrayBuffer);
};

Demo.prototype.getParser = function () {
	return new Parser(this.stream);
};

var StreamDemo = function (nodeStream) {
	this.stream = nodeStream;
};

StreamDemo.prototype.getParser = function () {
	return new StreamParser(this.stream);
};

Demo.fromNodeBuffer = function (nodeBuffer) {
	var arrayBuffer = new ArrayBuffer(nodeBuffer.length);
	var view = new Uint8Array(arrayBuffer);
	for (var i = 0; i < nodeBuffer.length; ++i) {
		view[i] = nodeBuffer[i];
	}
	return new Demo(arrayBuffer);
};

Demo.fromNodeStream = function (nodeStream) {
	return new StreamDemo(nodeStream);
};

Demo.fromPath = function (path) {
	var arrayBuffer = new ArrayBuffer(nodeBuffer.length);
	var view = new Uint8Array(arrayBuffer);
	for (var i = 0; i < nodeBuffer.length; ++i) {
		view[i] = nodeBuffer[i];
	}
	return new Demo(arrayBuffer);
};

module.exports = Demo;
