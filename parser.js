var util = require('util');
var Packet = require('./packet');
var State = require('./state');
var ConsoleCmd = require('./consolecmd');
var StringTable = require('./stringtable');
var DataTable = require('./datatable');
var BitStream = require('bit-buffer').BitStream;
var EventEmitter = require('events').EventEmitter;

var Parser = function (steam) {
	this.stream = steam;
	this.state = new State();
	this.packets = [];
	this.strings = {};
	this.on('packet', this.state.updateState.bind(this.state));
	this.on('packet', function (packet) {
		this.packets.push(packet);
	});
};

util.inherits(Parser, EventEmitter);

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
	return this.parseHeader(this.stream);
};

Parser.prototype.parseHeader = function (stream) {
	return {
		'type'    : stream.readASCIIString(8),
		'version' : stream.readInt32(),
		'protocol': stream.readInt32(),
		'server'  : stream.readASCIIString(260),
		'nick'    : stream.readASCIIString(260),
		'map'     : stream.readASCIIString(260),
		'game'    : stream.readASCIIString(260),
		'duration': stream.readFloat32(),
		'ticks'   : stream.readInt32(),
		'frames'  : stream.readInt32(),
		'sigon'   : stream.readInt32()
	}
};

Parser.prototype.parseBody = function () {
	var message;
	while (message = this.readMessage(this.stream)) {
		this.handleMessage(message);
	}
	this.strings = StringTable.tables;
	return this.state.get();
};

Parser.prototype.parseMessage = function (buffer, type, tick, length) {
	var data = new BitStream(buffer);

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			return new Packet(type, tick, data, length);
		case Parser.MessageType.ConsoleCmd:
			return new ConsoleCmd(type, tick, data, length);
		case Parser.MessageType.UserCmd:
			//console.log('usercmd');
			return true;
		case Parser.MessageType.DataTables:
			return new DataTable(type, tick, data, length);
		case Parser.MessageType.StringTables:
			return new StringTable(type, tick, data, length);
		default:
			return true;
	}
};

Parser.prototype.handleMessage = function (message) {
	if (message.parse) {
		var packets = message.parse();
		for (var i = 0; i < packets.length; i++) {
			var packet = packets[i];
			if (packet) {
				this.emit('packet', packet);
			}
		}
	}
};

Parser.prototype.readMessage = function (stream) {
	var type = stream.readBits(8);
	if (type === Parser.MessageType.Stop) {
		return null;
	}
	var tick = stream.readInt32();
	var start, length, buffer;

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			stream.byteIndex += 0x54; // command/sequence info
			break;
		case Parser.MessageType.UserCmd:
			stream.byteIndex += 0x04; // unknown / outgoing sequence
			break;
		case Parser.MessageType.Stop:
			return false;
		case Parser.MessageType.SyncTick:
			return true;
	}

	length = stream.readInt32();
	start = stream.byteIndex;
	buffer = stream.buffer.slice(start, start + length);
	stream.byteIndex += length;
	return this.parseMessage(buffer, type, tick, length);
};

module.exports = Parser;
