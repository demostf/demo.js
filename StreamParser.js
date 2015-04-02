var util = require('util');
var Parser = require('./parser');
var State = require('./state');
var BitStream = require('bit-buffer').BitStream;

var StreamParser = function (stream) {
	this.stream = stream;
	this.state = new State();
	this.on('packet', this.state.updateState.bind(this.state));
	this.header = null;
	this.buffer = new Buffer(0);
};

util.inherits(StreamParser, Parser);

function shrinkBuffer(buffer, length) {
	if (length < 0) {
		throw 'cant shrink by negative length ' + length;
	}
	return buffer.slice(length, buffer.length);
}

StreamParser.prototype.eatBuffer = function (length) {
	this.buffer = shrinkBuffer(this.buffer, length);
};

StreamParser.prototype.start = function () {
	this.stream.on('data', this.handleData.bind(this));
	this.stream.on('end', function () {
		this.emit('done', this.state.get());
	}.bind(this));
};

StreamParser.prototype.handleData = function (data) {
	this.buffer = Buffer.concat([this.buffer, data]);
	if (this.header === null) {
		if (this.buffer.length > 1072) {
			this.header = this.parseHeader(new BitStream(this.buffer));
			this.eatBuffer(1072);
		}
	} else {
		this.readMessage();
	}
};

StreamParser.prototype.readMessage = function () {
	if (this.buffer.length < 9) { // 9 byte minimum message header (type, tick, length)
		return;
	}
	var stream = new BitStream(this.buffer);
	var type = stream.readBits(8);
	if (type === Parser.MessageType.Stop) {
		console.log('stop');
		return;
	}
	var tick = stream.readInt32();

	var headerSize = 5;
	var extraHeader = 0;

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			extraHeader += 0x54; // command/sequence info
			break;
		case Parser.MessageType.UserCmd:
			extraHeader += 0x04; // unknown / outgoing sequence
			break;
		case Parser.MessageType.Stop:
		case Parser.MessageType.SyncTick:
			this.eatBuffer(headerSize);
			return;
	}
	stream.byteIndex += extraHeader;
	var length = stream.readInt32();
	headerSize += extraHeader + 4;

	if (this.buffer.length < (headerSize + length)) {
		console.log('wants ' + length);
		return;
	}

	console.log('got message ' + tick);
	var messageBuffer = this.buffer.slice(headerSize, headerSize + length);
	this.eatBuffer(headerSize + length);
	var message = this.parseMessage(messageBuffer, type, tick, length);
	this.handleMessage(message);
};

module.exports = StreamParser;
