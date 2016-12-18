import {SendPropParser} from '../../Parser/SendPropParser';
import {Entity} from '../../Data/Entity';
import {SendProp} from '../../Data/SendProp';

var PVS = {
	PRESERVE: 0,
	ENTER   : 1,
	LEAVE   : 2,
	DELETE  : 4
};

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

function readEnterPVS(stream, entityId, match, baseLine) {
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs#L198
	var serverClass = match.serverClasses[stream.readBits(match.classBits)];
	console.log(serverClass);
	var sendTable = match.getSendTable(serverClass.dataTable);
	var serialNumber = stream.readBits(10);

	var entity = (match.entities[entityId]) ? match.entities[entityId] : new Entity(serverClass, sendTable, entityId, serialNumber);

	var decodedBaseLine = match.instanceBaselines[baseLine][entityId];
	if (decodedBaseLine) {
		for (var i = 0; i < decodedBaseLine.length; i++) {
			var newProp = decodedBaseLine[i];
			if (!entity.getPropByDefinition(newProp.definition)) {
				entity.props.push(newProp.clone(entity));
			}
		}
	} else {
		var staticBaseLine = match.staticBaseLines[serverClass.id];
		if (staticBaseLine) {
			var streamStart = staticBaseLine._index;
			applyEntityUpdate(entity, staticBaseLine);
			staticBaseLine._index = streamStart;
		}
	}
	return entity;
}

function readLeavePVS(match, entityId, shouldDelete) {
	if (shouldDelete) {
		match.entities[entityId] = null;
	}
}

module.exports = function (stream, events, entities, match) { //26: packetEntities
	// https://github.com/skadistats/smoke/blob/master/smoke/replay/handler/svc_packetentities.pyx
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Handler/PacketEntitesHandler.cs
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Entity.cs
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs
	// todo
	var maxEntries = stream.readBits(11);
	var isDelta = !!stream.readBits(1);
	if (isDelta) {
		var delta = stream.readInt32();
	} else {
		delta = null;
	}
	var baseLine = stream.readBits(1);
	var updatedEntries = stream.readBits(11);
	var length = stream.readBits(20);
	var updatedBaseLine = stream.readBoolean();
	var end = stream._index + length;
	var entityId = -1;

	if (updatedBaseLine) {
		if (baseLine === 0) {
			match.instanceBaselines[1] = match.instanceBaselines[0];
			match.instanceBaselines[0] = new Array((1 << 11)); // array of SendPropDefinition with size MAX_EDICTS
		} else {
			match.instanceBaselines[0] = match.instanceBaselines[1];
			match.instanceBaselines[1] = new Array((1 << 11)); // array of SendPropDefinition with size MAX_EDICTS
		}
	}

	for (var i = 0; i < updatedEntries; i++) {
		var diff = readUBitVar(stream);
		console.log(diff);
		entityId += 1 + diff;
		var pvs = readPVSType(stream);
		if (pvs === PVS.ENTER) {
			var entity = readEnterPVS(stream, entityId, match, baseLine);
			applyEntityUpdate(entity, stream);
			match.entities[entityId] = entity;

			if (updatedBaseLine) {
				match.instanceBaselines[baseLine][entityId] = [].concat(entity.props);
			}
			entity.inPVS = true;
		} else if (pvs === PVS.PRESERVE) {
			entity = match.entities[entityId];
			if (!entity) {
				console.log(entityId, match.entities.length);
				throw new Error("unknown entity");
			}
			applyEntityUpdate(entity, stream);
		} else {
			entity = match.entities[entityId];
			if (entity) {
				entity.inPVS = false;
			}
			readLeavePVS(match, entityId, pvs === PVS.DELETE);
		}
	}

	if (isDelta) {
		while (stream.readBoolean()) {
			var ent = stream.readBits(11);
			match.entities[ent] = null;
		}
	}

	stream._index = end;
	//var ent = {
	//	packetType     : 'packetEntities',
	//	maxEntries     : maxEntries,
	//	isDelta        : isDelta,
	//	delta          : delta,
	//	baseLine       : baseLine,
	//	updatedEntries : updatedEntries,
	//	length         : length,
	//	updatedBaseLine: updatedBaseLine
	//};
	//console.log(ent);
	//console.log(entities);
	//process.exit();
	return {
		packetType: 'packetEntities',
		entities  : entities
	};
};

var readFieldIndex = function (stream, lastIndex) {
	if (!stream.readBoolean()) {
		return -1;
	}
	var diff = readUBitVar(stream);
	return lastIndex + diff + 1;
};

var applyEntityUpdate = function (entity, stream) {
	var index = -1;
	var allProps = entity.sendTable.flattenedProps;
	while ((index = readFieldIndex(stream, index)) != -1) {
		if (index > 4096) {
			throw new Error('prop index out of bounds');
		}
		console.log(index);
		var propDefinition = allProps[index];
		var existingProp = entity.getPropByDefinition(propDefinition);
		var prop;
		if (existingProp) {
			prop = existingProp;
		} else {
			prop = new SendProp(propDefinition);
		}
		prop.value = SendPropParser.decode(propDefinition, stream);
		console.log(prop);

		if (!existingProp) {
			entity.props.push(prop);
		}
	}
	return entity;
};

var readUBitVar = function (stream) {
	switch (stream.readBits(2)) {
		case 0:
			return stream.readBits(4);
		case 1:
			return stream.readBits(8);
		case 2:
			return stream.readBits(12);
		case 3:
			return stream.readBits(32);
	}
};
