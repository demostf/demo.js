var ParserGenerator = require('./parsergenerator');
var StringTable = require('./stringtable');

function logBase2 (num) {
	var result = 0;
	while ((num >>= 1) != 0) {
		result++;
	}
	return result;
}

var Packet = function (type, tick, stream, length) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
};

Packet.gameEventMap = {};

Object.defineProperty(Packet.prototype, 'bitsLeft', {
	get: function () {
		return (this.length * 8) - this.stream._index;
	}
});

Packet.prototype.parse = function () {
	var packets = [];
	while (this.bitsLeft > 6) { // last 6 bits for NOOP
		var type = this.stream.readBits(6);
		if (Packet.parsers[type]) {
			var packet = Packet.parsers[type](this.stream);
			//console.log(packet);
			packets.push(packet);
		} else {
			throw 'Unknown packet type ' + type;
		}
	}
	return packets;
};

Packet.parseGameEvent = function (eventId, stream) {
	if (!Packet.gameEventMap[eventId]) {
		return 'unknown';
	}
	var eventDescription = this.gameEventMap[eventId];
	//console.log(eventDescription);
	var values = {};
	for (var i = 0; i < eventDescription.entries.length; i++) {
		var entry = eventDescription.entries[i];
		values[entry.name] = Packet.getGameEventValue(stream, entry);
	}
	return {
		name: eventDescription.name,
		type: eventDescription.type,
		values: values
	};
};

Packet.getGameEventValue = function (stream, entry) {
	switch (entry.type) {
		case 1:
			return stream.readASCIIString();
		case 2:
			return stream.readFloat32();
		case 3:
			return stream.readInt32();
		case 4:
			return stream.readBits(16);
		case 5:
			return stream.readBits(8);
		case 6:
			return !!stream.readBits(1);
		case 7:
			return 'local value'
	}
};

Packet.parsers = {
	0: function () {
	},
	2: ParserGenerator.make('file', 'transferId{32}fileName{s}requested{b}'),
	3: ParserGenerator.make('netTick', 'tick{32}frameTime{16}stdDev{16}'),
	4: ParserGenerator.make('stringCmd', 'command{s}'),
	5: function (stream) {
		var count = stream.readBits(8);
		var vars = {};
		for (var i = 0; i < count; i++) {
			vars[stream.readASCIIString()] = stream.readASCIIString();
		}
		return {
			packetType: 'setConVar',
			vars: vars
		}
	},
	6: ParserGenerator.make('sigOnState', 'state{8}count{32}'),
	7: ParserGenerator.make('print', 'value{s}'),
	8: ParserGenerator.make('serverInfo',
		'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
		'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
		'game{s}map{s}skybox{s}serverName{s}replay{b}'),
	10: function (stream) {
		var number = stream.readBits(16);
		var create = !!stream.readBits(1);
		var entries = [];
		if (!create) {
			var bits = logBase2(number) + 1;
			for (var i = 0; i < number; i++) {
				var entry = {
					'classId': stream.readBits(bits),
					'className': stream.readASCIIString(),
					'dataTableName': stream.readASCIIString()
				};
				entries.push(entry);
			}
		}
		return {
			'packetType': 'classInfo',
			number: number,
			create: create,
			entries: entries
		}
	},
	11: ParserGenerator.make('setPause', 'paused{b}'),
	12: function (stream) {
		//todo
		// https://coldemoplayer.googlecode.com/svn/branches/2.0/code/plugins/CDP.Source/Messages/SvcCreateStringTable.cs
		var name = stream.readASCIIString();
		var maxEntries = stream.readBits(16);
		var bits = Math.log(maxEntries) / Math.LN2;
		var numEntries = stream.readBits(bits + 1);
		var length = stream.readBits(20);
		var userDataFixedSize = !!stream.readBits(1);
		if (userDataFixedSize) {
			var userSize = stream.readBits(12);
			var userDataBits = stream.readBits(4);
		}
		var end = stream._index + length;

		var stringTable = new PacketStringTable(name, maxEntries, bits, userDataFixedSize, userSize || -1, userDataBits || -1, numEntries);
		stringTable.parse(stream);
		//console.log(stringTable);
		//console.log();
		//console.log(length);
		//console.log(end - stream._index);
		//console.log();
		//throw false;

		stream._index = end;
		return {
			packetType: 'createStringTable',
			table: stringTable
		};
	},
	13: function (stream) {
		var tableId = stream.readBits(5);
		var changeEntries = stream.readBits(1) ? stream.readBits(16) : 1;
		var length = stream.readBits(20);
		var end = stream._index + length;
		stream.readBits(7);
		var strings = {};
		//var table = StringTable.tables[tableId];

		// no idea why but it mostly works
		var a = stream.readBits(1);
		var b = stream.readBits(1);
		if (a && !b) {
			stream.readBits(12);
		} else if (!b) {
			stream.readBits(16);
		} else {
			stream.readBits(6);
		}
		//console.log(a ? 'a' : '!a')
		//console.log('table: ' + table.name);
		//console.log('       ' + table.entries.length + ' entries');
		for (var i = 0; i < changeEntries; i++) {
			//console.log(stream.readBits(2));
			var string = stream.readASCIIString();
			stream.readBits(16);
			//todo last entry overflows by 13 (3 bits at the end 13 before next entry?)
			strings[i] = string;
		}
		//throw false;
		//console.log(changeEntries);
		//console.log(strings);
		//console.log(end - stream._index);
		stream._index = end;
		//throw false;
		return {
			packetType: 'updateStringTables',
			tableId: tableId,
			changedEntries: changeEntries,
			length: length,
			strings: strings
		}
	},
	14: ParserGenerator.make('voiceInit', 'coded{s}quality{8}'),
	15: ParserGenerator.make('voiceData', 'client{8}proximity{8}length{16}data{$length}'),
	17: function (stream) {
		var reliable = !!stream.readBits(1);
		var num = (reliable) ? 1 : stream.readBits(8);
		var length = (reliable) ? stream.readBits(8) : stream.readBits(16);
		stream._index += length;
		return {
			packetType: 'parseSounds',
			reliable: reliable,
			num: num,
			length: length
		}
	},
	18: ParserGenerator.make('setView', 'index{11}'),
	19: ParserGenerator.make('fixAngle', 'relative{b}x{16}y{16}z{16}'),
	21: function (stream) {
		var getCoord = function (stream) {
			var hasInt = !!stream.readBits(1);
			var hasFract = !!stream.readBits(1);
			var value = 0;
			if (hasInt || hasFract) {
				var sign = !!stream.readBits(1);
				if (hasInt) {
					value += stream.readBits(14) + 1;
				}
				if (hasFract) {
					value += stream.readBits(5) * (1 / 32);
				}
				if (sign) {
					value = -value;
				}
			}
			return value;
		};
		var getVecCoord = function (stream) {
			var hasX = !!stream.readBits(1);
			var hasY = !!stream.readBits(1);
			var hasZ = !!stream.readBits(1);
			return {
				x: hasX ? getCoord(stream) : 0,
				y: hasY ? getCoord(stream) : 0,
				z: hasZ ? getCoord(stream) : 0
			}
		};
		var position = getVecCoord(stream);
		var textureIndex = stream.readBits(9);
		if (stream.readBits(1)) {
			var entIndex = stream.readBits(11);
			var modelIndex = stream.readBits(12);
		}
		var lowPriority = !!stream.readBits(1);
		return {
			packetType: 'BSPDecal',
			position: position,
			textureIndex: textureIndex,
			entIndex: entIndex,
			modelIndex: modelIndex,
			lowPriority: lowPriority
		}
	},
	23: function (stream) {
		// user message
		var type = stream.readBits(8);
		var length = stream.readBits(11);
		var pos = stream._index;
		if (Packet.userMessageParsers[type]) {
			var result = Packet.userMessageParsers[type](stream);
		} else {
			result = {
				packetType: 'unknownUserMessage',
				type: type
			}
		}
		stream._index = pos + length;
		return result;
	},
	24: ParserGenerator.make('entityMessage', 'index{11}id{9}length{11}data{$length}'),
	25: function (stream) {
		var length = stream.readBits(11);
		var end = stream._index + length;
		var eventId = stream.readBits(9);
		var event = Packet.parseGameEvent(eventId, stream);
		stream._index = end;
		return {
			packetType: 'gameEvent',
			event: event
		}
	},
	26: function (stream) {
		var maxEntries = stream.readBits(11);
		var isDelta = !!stream.readBits(1);
		if (isDelta) {
			var delta = stream.readInt32();
		} else {
			delta = null;
		}
		var baseLink = !!stream.readBits(1);
		var updatedEntries = stream.readBits(11);
		var length = stream.readBits(20);
		var updatedBaseLink = !!stream.readBits(1);
		stream._index += length;
		return {
			packetType: 'packetEntities',
			maxEntries: maxEntries,
			isDelta: isDelta,
			delta: delta,
			baseLink: baseLink,
			updatedEntries: updatedEntries,
			length: length,
			updatedBaseLink: updatedBaseLink
		}
	},
	27: ParserGenerator.make('tempEntities', 'count{8}length{17}_{$length}'),
	28: ParserGenerator.make('preFetch', 'index{14}'),
	29: ParserGenerator.make('menu', 'type{16}length{16}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}'),//length*8
	30: function (stream) {
		// list of game events and parameters
		var numEvents = stream.readBits(9);
		var length = stream.readBits(20);
		var events = {};
		for (var i = 0; i < numEvents; i++) {
			var id = stream.readBits(9);
			var name = stream.readASCIIString();
			var type = stream.readBits(3);
			var entries = [];
			while (type !== 0) {
				var entryName = stream.readASCIIString();
				entries.push({
					type: type,
					name: entryName
				});
				type = stream.readBits(3);
			}
			events[id] = {
				id: id,
				name: name,
				type: type,
				entries: entries
			};
		}
		Packet.gameEventMap = events;
		return {
			packetType: 'gameEventList',
			events: events
		}
	},
	31: ParserGenerator.make('getCvarValue', 'cookie{32}value{s}'),
	32: ParserGenerator.make('cmdKeyValues', 'length{32}data{$length}')
};

Packet.userMessageParsers = {
	4: ParserGenerator.make('sayText2', 'client{8}raw{8}kind{s}from{s}text{s}'),
	5: ParserGenerator.make('textMsg', 'destType{8}text{s}')
};

var UserMessageType = {
	Geiger: 0,
	Train: 1,
	HudText: 2,
	SayText: 3,
	SayText2: 4,
	TextMsg: 5,
	ResetHUD: 6,
	GameTitle: 7,
	ItemPickup: 8,
	ShowMenu: 9,
	Shake: 10,
	Fade: 11,
	VGUIMenu: 12,
	Rumble: 13,
	CloseCaption: 14,
	SendAudio: 15,
	VoiceMask: 16,
	RequestState: 17,
	Damage: 18,
	HintText: 19,
	KeyHintText: 20,
	HudMsg: 21,
	AmmoDenied: 22,
	AchievementEvent: 23,
	UpdateRadar: 24,
	VoiceSubtitle: 25,
	HudNotify: 26,
	HudNotifyCustom: 27,
	PlayerStatsUpdate: 28,
	PlayerIgnited: 29,
	PlayerIgnitedInv: 30,
	HudArenaNotify: 31,
	UpdateAchievement: 32,
	TrainingMsg: 33,
	TrainingObjective: 34,
	DamageDodged: 35,
	PlayerJarated: 36,
	PlayerExtinguished: 37,
	PlayerJaratedFade: 38,
	PlayerShieldBlocked: 39,
	BreakModel: 40,
	CheapBreakModel: 41,
	BreakModel_Pumpkin: 42,
	BreakModelRocketDud: 43,
	CallVoteFailed: 44,
	VoteStart: 45,
	VotePass: 46,
	VoteFailed: 47,
	VoteSetup: 48,
	PlayerBonusPoints: 49,
	SpawnFlyingBird: 50,
	PlayerGodRayEffect: 51,
	SPHapWeapEvent: 52,
	HapDmg: 53,
	HapPunch: 54,
	HapSetDrag: 55,
	HapSet: 56,
	HapMeleeContact: 57
};

var PacketStringTable = function (name, maxEntries, entryBits, userDataFixedSize, userDataSize, userDataSizeBits, numEntries) {
	this.name = name;
	this.maxEntries = maxEntries;
	this.entryBits = entryBits;
	this.userDataFixedSize = userDataFixedSize;
	this.userDataSize = userDataSize;
	this.userDataSizeBits = userDataSizeBits;
	this.numEntries = numEntries;
	this.id = PacketStringTable.tables.length;
	this.strings = [];
	PacketStringTable.tables.push(this);
};

PacketStringTable.prototype.parse = function (stream) {
	var entryIndex, lastEntry = -1;
	for (var i = 0; i < this.numEntries; i++) {
		entryIndex = lastEntry + 1;
		this.strings.push(stream.readASCIIString());
		//if (!stream.readBits(1)) {
		//	entryIndex = stream.readBits(this.entryBits);
		//}
		//lastEntry = entryIndex;
		//if (entryIndex < 0 || entryIndex >= this.maxEntries) {
		//	throw 'invalid index';
		//}
		//var string = '';
		//if (stream.readBits(1)) {
		//	if (stream.readBits(1)) {
		//		throw 'substr not implented';
		//	} else {
		//		string = stream.readASCIIString();
		//	}
		//}

		if (stream.readBits(1)) { //user data
			if (this.userDataFixedSize) {
				var userData = stream.readBits(this.userDataSizeBits)
			} else {
				var bits = stream.readBits(14);
				userData = stream.readBits(bits);
			}
			console.log('userdata: ' + userData);
		}

		//this.strings.push(string);
	}
};

PacketStringTable.tables = [];

module.exports = Packet;
