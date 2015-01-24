var Packet = require('./packet');
var ConsoleCmd = require('./consolecmd');
var StringTable = require('./stringtable');
var BitStream = require('bit-buffer').BitStream;

var Parser = function (steam) {
	this.stream = steam;
};

Parser.MessageType = {
	Sigon       : 1,
	Packet      : 2,
	SyncTick    : 3,
	ConsoleCmd  : 4,
	UserCmd     : 5,
	DataTables  : 6,
	Stop        : 7,
	StringTables: 8
};

Parser.prototype.readHeader = function () {
	return {
		'type'    : this.stream.readASCIIString(8),
		'version' : this.stream.readInt32(),
		'protocol': this.stream.readInt32(),
		'server'  : this.stream.readASCIIString(260),
		'nick'    : this.stream.readASCIIString(260),
		'map'     : this.stream.readASCIIString(260),
		'game'    : this.stream.readASCIIString(260),
		'duration': this.stream.readFloat32(),
		'ticks'   : this.stream.readInt32(),
		'frames'  : this.stream.readInt32(),
		'sigon'   : this.stream.readInt32()
	}
};

Parser.prototype.readMessage = function () {
	console.log();
	console.log('start message');
	console.log(this.stream.byteIndex);
	var type = this.stream.readBits(8);
	console.log(type);
	if (type === Parser.MessageType.Stop) {
		return null;
	}
	var tick = this.stream.readInt32();
	var data, start, length, buffer;

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			this.stream.byteIndex += 0x54; // command/sequence info
			break;
		case Parser.MessageType.UserCmd:
			this.stream.byteIndex += 0x04; // unknown / outgoing sequence
			break;
		case Parser.MessageType.Stop:
			return false;
		case Parser.MessageType.SyncTick:
			return true;
	}

	length = this.stream.readInt32();
	console.log('message length: ' + length + ' byte');
	start = this.stream.byteIndex;
	buffer = this.stream.buffer.slice(start, start + length);
	this.stream.byteIndex += length;
	data = new BitStream(buffer);
	//console.log(this.stream.buffer);

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			return new Packet(type, tick, data, length);
		case Parser.MessageType.ConsoleCmd:
			return new ConsoleCmd(type, tick, data, length);
		case Parser.MessageType.UserCmd:
			return true;
		case Parser.MessageType.DataTables:
			console.log('datatable');
			return true;
		case Parser.MessageType.StringTables:
			return new StringTable(type, tick, data, length);
		default:
			return true;
			//throw 'Unknown message type: ' + type;
	}
};

module.exports = Parser;
