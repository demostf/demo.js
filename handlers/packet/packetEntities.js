var PVS = {
	PRESERVE: 0,
	ENTER   : 1,
	LEAVE   : 2,
	DELETE  : 3
};


function readIndex(stream, baseIndex) {
	// https://github.com/skadistats/smoke/blob/a2954fbe2fa3936d64aee5b5567be294fef228e6/smoke/io/stream/entity.pyx#L15
	var encodedIndex = stream.readBits(6);
	if (encodedIndex & 0x30) {
		var a = (encodedIndex >> 4) & 3;
		var b = (a == 3) ? 16 : 0;
		var i = stream.readBits(4 * a + b) << 4;
		encodedIndex = i | (encodedIndex & 0x0f);
	}
	return baseIndex + encodedIndex + 1;
}

function readPVSType(stream) {
	// https://github.com/skadistats/smoke/blob/a2954fbe2fa3936d64aee5b5567be294fef228e6/smoke/io/stream/entity.pyx#L24
	var pvs;
	var hi = stream.readBoolean();
	var low = stream.readBoolean();
	if (low && !hi) {
		pvs = PVS.ENTER;
	} else if (!(hi || low)) {
		pvs = PVS.PRESERVE;
	} else if (hi) {
		pvs = (low) ? (PVS.LEAVE | PVS.DELETE) : PVS.LEAVE;
	} else {
		pvs = -1;
	}
	return pvs;
}

function readEnterPVS(stream, entityId) {

}

module.exports = function (stream, events, entities) { //26: packetEntities
	// https://github.com/skadistats/smoke/blob/master/smoke/replay/handler/svc_packetentities.pyx
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Handler/PacketEntitesHandler.cs
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Entity.cs
	// todo
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
	var end = stream._index + length;
	//console.log('max: ' + maxEntries);
	var entityId = -1;

	for (var i = 0; i < updatedEntries; i++) {
		entityId = readIndex(stream, entityId);
		var pvs = readPVSType(stream);
		if (pvs = PVS.PRESERVE) {
			var entity = readEnterPVS(stream, entityId)
		}
	}
	stream._index = end;
	//var ent = {
	//	packetType     : 'packetEntities',
	//	maxEntries     : maxEntries,
	//	isDelta        : isDelta,
	//	delta          : delta,
	//	baseLink       : baseLink,
	//	updatedEntries : updatedEntries,
	//	length         : length,
	//	updatedBaseLink: updatedBaseLink
	//};
	//console.log(ent);
	//console.log(entities);
	//process.exit();
	return {
		packetType: 'packetEntities',
		entities  : entities
	};
};
