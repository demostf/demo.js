var Packet = require('./packet');
var ConsoleCmd = require('./consolecmd');
var StringTable = require('./stringtable');
var DataTable = require('./datatable');
var BitStream = require('bit-buffer').BitStream;

var Parser = function (steam) {
	this.stream = steam;
	this.state = {
		chat           : [],
		users          : {},
		deaths         : [],
		rounds         : [],
		startTick      : 0,
		intervalPerTick: 0
	};
	this.packets = [];
	this.strings = {};
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

Parser.prototype.parseBody = function () {
	var message, i, tick = 0;
	while (message = this.readMessage()) {
		if (message.parse) {
			var packets = message.parse();
			for (i = 0; i < packets.length; i++) {
				var packet = packets[i];
				if (packet) {
					this.packets.push(packet);
				}
				if (!packet) {
					continue;
				}
				switch (packet.packetType) {
					case 'netTick':
						if (this.state.startTick === 0) {
							this.state.startTick = packet.tick;
						}
						tick = packet.tick;
						break;
					case 'serverInfo':
						this.state.intervalPerTick = packet.intervalPerTick;
						break;
					case 'sayText2':
						this.state.chat.push({
							kind: packet.kind,
							from: packet.from,
							text: packet.text,
							tick: tick
						});
						break;
					case 'stringTable':
						if (packet.tables.userinfo) {
							for (var j = 0; j < packet.tables.userinfo.length; j++) {
								if (packet.tables.userinfo[j].extraData) {
									var name = packet.tables.userinfo[j].extraData[0];
									var steamId = packet.tables.userinfo[j].extraData[2];
									var userId = packet.tables.userinfo[j].extraData[1].charCodeAt(0);
									this.state.users[userId] = {
										name   : name,
										userId : userId,
										steamId: steamId
									}
								}
							}
						}
						break;
					case 'gameEvent':
						switch (packet.event.name) {
							case 'player_death':
								// todo get player names, not same id as the name string table
								var assister = packet.event.values.assister < 32 ? packet.event.values.assister : null;
								this.state.deaths.push({
									killer  : packet.event.values.attacker,
									assister: assister,
									victim  : packet.event.values.userid,
									weapon  : packet.event.values.weapon,
									tick    : tick
								});
								break;
							case 'teamplay_round_win':
								if (packet.event.values.winreason !== 6) {// 6 = timelimit
									this.state.rounds.push({
										winner  : packet.event.values.team === 2 ? 'red' : 'blue',
										length  : packet.event.values.round_time,
										end_tick: tick
									});
								}
						}
						break;
				}
			}
		}
	}
	this.strings = StringTable.tables;
	return this.state;
};

Parser.prototype.readMessage = function () {
	//console.log();
	//console.log('start message');
	//console.log(this.stream.byteIndex);
	var type = this.stream.readBits(8);
	//console.log(type);
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
	//console.log('message length: ' + length + ' byte');
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
			console.log('usercmd');
			return true;
		case Parser.MessageType.DataTables:
			return new DataTable(type, tick, data, length);
		case Parser.MessageType.StringTables:
			return new StringTable(type, tick, data, length);
		default:
			return true;
		//throw 'Unknown message type: ' + type;
	}
};

module.exports = Parser;
