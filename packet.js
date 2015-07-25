var ParserGenerator = require('./parsergenerator');

// https://code.google.com/p/coldemoplayer/source/browse/branches/2.0/compLexity+Demo+Player/CDP.Source/Messages/?r=219
// https://github.com/TimePath/hl2-toolkit/tree/master/src/main/java/com/timepath/hl2/io/demo
// https://github.com/stgn/netdecode/blob/master/Packet.cs
// https://github.com/LestaD/SourceEngine2007/blob/master/src_main/common/netmessages.cpp

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
	//var table = new PacketStringTable(this.stream);
	//table.searchIds();
	//return [];

	var packets = [];
	var entities = [];
	while (this.bitsLeft > 6) { // last 6 bits for NOOP
		var type = this.stream.readBits(6);
		if (Packet.parsers[type]) {
			var packet = Packet.parsers[type].call(this, this.stream, Packet.gameEventMap, entities);
			//console.log(packet);
			packets.push(packet);
		} else {
			throw 'Unknown packet type ' + type;
		}
	}
	return packets;
};

Packet.parsers = {
	0 : function () {//NOOP
	},
	2 : ParserGenerator.make('file', 'transferId{32}fileName{s}requested{b}'),
	3 : ParserGenerator.make('netTick', 'tick{32}frameTime{16}stdDev{16}'),
	4 : ParserGenerator.make('stringCmd', 'command{s}'),
	5 : require('./handlers/packet/setConVar'),
	6 : ParserGenerator.make('sigOnState', 'state{8}count{32}'),
	7 : ParserGenerator.make('print', 'value{s}'),
	8 : ParserGenerator.make('serverInfo',
		'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
		'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
		'game{s}map{s}skybox{s}serverName{s}replay{b}'),
	10: require('./handlers/packet/classInfo'),
	11: ParserGenerator.make('setPause', 'paused{b}'),
	12: require('./handlers/packet/createStringTable'),
	13: require('./handlers/packet/updateStringTable'),
	14: ParserGenerator.make('voiceInit', 'codec{s}quality{8}'),
	15: ParserGenerator.make('voiceData', 'client{8}proximity{8}length{16}_{$length}'),
	17: require('./handlers/packet/parseSounds'),
	18: ParserGenerator.make('setView', 'index{11}'),
	19: ParserGenerator.make('fixAngle', 'relative{b}x{16}y{16}z{16}'),
	21: require('./handlers/packet/bspDecal'),
	23: require('./handlers/packet/userMessage'),
	24: require('./handlers/packet/entityMessage'),
	25: require('./handlers/packet/gameEvent'),
	26: require('./handlers/packet/packetEntities'),
	27: ParserGenerator.make('tempEntities', 'count{8}length{17}_{$length}'),
	28: ParserGenerator.make('preFetch', 'index{14}'),
	29: ParserGenerator.make('menu', 'type{16}length{16}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}_{$length}'),//length*8
	30: require('./handlers/packet/gameEventList'),
	31: ParserGenerator.make('getCvarValue', 'cookie{32}value{s}'),
	32: ParserGenerator.make('cmdKeyValues', 'length{32}data{$length}')
};

module.exports = Packet;
