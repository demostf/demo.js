var BitStream = require('bit-buffer').BitStream;
var Parser = require('./parser');

var Demo = function (arrayBuffer) {
	this.stream = new BitStream(arrayBuffer);
};

Demo.prototype.getParser = function () {
	return new Parser(this.stream);
};

Demo.fromNodeBuffer = function (nodeBuffer) {
	var arrayBuffer = new ArrayBuffer(nodeBuffer.length);
	var view = new Uint8Array(arrayBuffer);
	for (var i = 0; i < nodeBuffer.length; ++i) {
		view[i] = nodeBuffer[i];
	}
	return new Demo(arrayBuffer);
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
