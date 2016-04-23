var util = require('util');
var Packet = require('./packet');
var ConsoleCmd = require('./consolecmd');
var StringTable = require('./stringtable');
var DataTable = require('./datatable');
var UserCmd = require('./usercmd');
var BitStream = require('bit-buffer').BitStream;
var EventEmitter = require('events').EventEmitter;
var Match = require('./match');

var Parser = function (stream) {
	this.stream = stream;
	this.packets = [];
	this.match = new Match();
	this.on('packet', this.match.handlePacket.bind(this.match));
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
	while (message = this.readMessage(this.stream, this.match)) {
		this.handleMessage(message);
	}
	this.emit('done', this.match);
	return this.match;
};

Parser.prototype.parseMessage = function (buffer, type, tick, length, viewOrigin, match) {
	var data = new BitStream(buffer);

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			return new Packet(type, tick, data, length, viewOrigin, match);
		case Parser.MessageType.ConsoleCmd:
			return new ConsoleCmd(type, tick, data, length, match);
		case Parser.MessageType.UserCmd:
			return new UserCmd(type, tick, data, length, match);
		case Parser.MessageType.DataTables:
			return new DataTable(type, tick, data, length, match);
		case Parser.MessageType.StringTables:
			return new StringTable(type, tick, data, length, match);
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

Parser.prototype.readMessage = function (stream, match) {
	var type = stream.readBits(8);
	if (type === Parser.MessageType.Stop) {
		return null;
	}
	var tick = stream.readInt32();
	var start, length, buffer;

	var viewOrigin = [];
	var viewAngles = [];

	switch (type) {
		case Parser.MessageType.Sigon:
		case Parser.MessageType.Packet:
			this.stream.readInt32(); // flags
			for (var j = 0; j < 2; j++) {
				viewOrigin[j] = [];
				viewAngles[j] = [];
				for (var i = 0; i < 3; i++) {
					viewOrigin[j][i] = this.stream.readInt32();
				}
				for (i = 0; i < 3; i++) {
					viewAngles[j][i] = this.stream.readInt32();
				}
				for (i = 0; i < 3; i++) {
					this.stream.readInt32(); // local viewAngles
				}
			}
			this.stream.readInt32(); // sequence in
			this.stream.readInt32(); // sequence out
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
	return this.parseMessage(buffer, type, tick, length, viewOrigin, match);
};

module.exports = Parser;
