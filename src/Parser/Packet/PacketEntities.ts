import {BitStream} from 'bit-buffer';
import {PacketEntitiesPacket} from '../../Data/Packet';
import {EntityId, PacketEntity, PVS} from '../../Data/PacketEntity';
import {SendProp} from '../../Data/SendProp';
import {encodeEntityUpdate, getEntityUpdate} from '../EntityDecoder';
import {readUBitVar, writeBitVar} from '../readBitVar';
import {getClassBits, getSendTable, ParserState} from '../../Data/ParserState';

const pvsMap = new Map([
	[0, PVS.PRESERVE],
	[2, PVS.ENTER],
	[1, PVS.LEAVE],
	[3, PVS.LEAVE + PVS.DELETE],
]);

const pvsReverseMap = new Map([
	[PVS.PRESERVE, 0],
	[PVS.ENTER, 2],
	[PVS.LEAVE, 1],
	[PVS.LEAVE + PVS.DELETE, 3],
]);

function readPVSType(stream: BitStream): PVS {
	const pvs = stream.readBits(2);
	// console.log(pvs);
	return pvsMap.get(pvs) as number;
}

function writePVSType(pvs: PVS, stream: BitStream) {
	const raw = pvsReverseMap.get(pvs);
	if (!raw) {
		throw new Error(`Unknown pvs ${pvs}`);
	}
	stream.writeBits(raw, 2);
}

function readEnterPVS(stream: BitStream, entityId: EntityId, state: ParserState, baseLine: number): PacketEntity {
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs#L198
	const classBits = getClassBits(state);
	const serverClass = state.serverClasses[stream.readBits(classBits)];
	const serial = stream.readBits(10); // unused serial number

	const sendTable = getSendTable(state, serverClass.dataTable);

	const instanceBaseline = state.instanceBaselines[baseLine].get(entityId);
	const entity = new PacketEntity(serverClass, entityId, PVS.ENTER);
	entity.serialNumber = serial;
	if (instanceBaseline) {
		const result = entity.clone();
		result.applyPropUpdate(instanceBaseline);
		return result;
	} else {
		const staticBaseLine = state.staticBaseLines.get(serverClass.id);
		if (staticBaseLine) {
			const cachedBaseline = state.staticBaselineCache.get(serverClass.id);
			if (cachedBaseline) {
				entity.applyPropUpdate(cachedBaseline);
			} else {
				staticBaseLine.index = 0;
				const props = getEntityUpdate(sendTable, staticBaseLine);
				entity.applyPropUpdate(props);
				// TODO: cache
				// state.staticBaselineCache.set(serverClass.id, props.map(prop => prop.clone()));
			}
			// if (staticBaseLine.bitsLeft > 7) {
			// console.log(staticBaseLine.length, staticBaseLine.index);
			// throw new Error('Unexpected data left at the end of staticBaseline, ' + staticBaseLine.bitsLeft + ' bits left');
			// }
		}
		return entity;
	}
}

function writeEnterPVS(entity: PacketEntity, stream: BitStream, state: ParserState, baseLine: number) {
	const serverClassId = state.serverClasses.findIndex(serverClass => serverClass && entity.serverClass.id === serverClass.id);
	if (serverClassId === -1) {
		throw new Error(`Unknown server class ${entity.serverClass.name}(${entity.serverClass.id})`);
	}
	// get the instance from the match, not the entity
	const serverClass = state.serverClasses[serverClassId];

	stream.writeBits(serverClassId, getClassBits(state));
	stream.writeBits(entity.serialNumber || 0, 10);

	const sendTable = getSendTable(state, serverClass.dataTable);

	let instanceBaseLine = state.instanceBaselines[baseLine].get(entity.entityIndex);
	if (!instanceBaseLine) {
		const staticBaseLine = state.staticBaseLines.get(serverClass.id);
		if (staticBaseLine) {
			staticBaseLine.index = 0;
			instanceBaseLine = getEntityUpdate(sendTable, staticBaseLine);
			// state.instanceBaselines.set(serverClass, instanceBaseLine.clone());
		}
	}

	const propsToEncode = instanceBaseLine ? entity.diffFromBaseLine(instanceBaseLine) : entity.props;

	// console.log(propsToEncode.map(prop => `${prop.definition.name}: ${prop.value}`));

	const allProps = sendTable.flattenedProps;
	propsToEncode.sort((a, b) => allProps.findIndex(propDef => propDef.fullName === a.definition.fullName) -
		allProps.findIndex(propDef => propDef.fullName === b.definition.fullName));

	encodeEntityUpdate(propsToEncode, sendTable, stream);
}

function getPacketEntityForExisting(entityId: EntityId, state: ParserState, pvs: PVS) {
	const serverClass = state.entityClasses.get(entityId);
	if (!serverClass) {
		throw new Error(`"unknown entity ${entityId} for ${PVS[pvs]}(${pvs})`);
	}

	return new PacketEntity(serverClass, entityId, pvs);
}

export function ParsePacketEntities(stream: BitStream, state: ParserState, skip: boolean = false): PacketEntitiesPacket { // 26: packetEntities
	// require('fs').writeFileSync('src/tests/data/packetEntitiesParserState.json', JSON.stringify(state), 'utf8');
	// process.exit();

	// https://github.com/skadistats/smoke/blob/master/smoke/replay/handler/svc_packetentities.pyx
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Handler/PacketEntitesHandler.cs
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Entity.cs
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs
	const maxEntries = stream.readBits(11);
	const isDelta = stream.readBoolean();
	const delta = (isDelta) ? stream.readInt32() : 0;
	const baseLine = stream.readBits(1);
	const updatedEntries = stream.readBits(11);
	const length = stream.readBits(20);
	const updatedBaseLine = stream.readBoolean();
	const end = stream.index + length;
	let entityId = -1;

	const receivedEntities: PacketEntity[] = [];
	const removedEntityIds: EntityId[] = [];

	if (!skip) {
		if (updatedBaseLine) {
			state.instanceBaselines[1 - baseLine] = new Map(state.instanceBaselines[baseLine]);
			// state.instanceBaselines[baseLine] = new Map();
		}

		for (let i = 0; i < updatedEntries; i++) {
			const diff = readUBitVar(stream);
			entityId += 1 + diff;
			const pvs = readPVSType(stream);
			if (pvs === PVS.ENTER) {
				const packetEntity = readEnterPVS(stream, entityId, state, baseLine);
				const sendTable = getSendTable(state, packetEntity.serverClass.dataTable);
				const updatedProps = getEntityUpdate(sendTable, stream);
				packetEntity.applyPropUpdate(updatedProps);

				if (updatedBaseLine) {
					state.instanceBaselines[1 - baseLine].set(entityId, packetEntity.clone().props);
				}
				packetEntity.inPVS = true;
				receivedEntities.push(packetEntity);
			} else if (pvs === PVS.PRESERVE) {
				const packetEntity = getPacketEntityForExisting(entityId, state, pvs);
				const sendTable = state.sendTables.get(packetEntity.serverClass.dataTable);
				if (!sendTable) {
					throw new Error(`Unknown sendTable ${packetEntity.serverClass.dataTable}`);
				}
				const updatedProps = getEntityUpdate(sendTable, stream);
				packetEntity.applyPropUpdate(updatedProps);
				receivedEntities.push(packetEntity);
			} else if (state.entityClasses.has(entityId)) {
				const packetEntity = getPacketEntityForExisting(entityId, state, pvs);
				receivedEntities.push(packetEntity);
			} else {
				// throw new Error(`No existing entity to update with id ${entityId}`);
			}
		}

		if (isDelta) {
			while (stream.readBoolean()) {
				removedEntityIds.push(stream.readBits(11));
			}
		}
	}

	stream.index = end;
	return {
		packetType: 'packetEntities',
		entities: receivedEntities,
		removedEntities: removedEntityIds,
		maxEntries,
		delta,
		baseLine,
		updatedBaseLine,
	};
}

export function EncodePacketEntities(packet: PacketEntitiesPacket, stream: BitStream, state: ParserState) {
	stream.writeBits(packet.maxEntries, 11);
	const isDelta = packet.removedEntities.length > 0;
	stream.writeBoolean(isDelta);
	if (isDelta) {
		stream.writeInt32(packet.delta);
	}
	stream.writeBits(packet.baseLine, 1);
	stream.writeBits(packet.entities.length, 11);

	const lengthStart = stream.index;

	stream.index += 20;
	stream.writeBoolean(packet.updatedBaseLine);
	const packetDataStart = stream.index;

	let lastEntityId = -1;

	if (packet.updatedBaseLine) {
		state.instanceBaselines[1 - packet.baseLine] = new Map(state.instanceBaselines[packet.baseLine]);
		// state.instanceBaselines[baseLine] = new Map();
	}

	for (const entity of packet.entities) {
		const diff = entity.entityIndex - lastEntityId;
		lastEntityId = entity.entityIndex;
		writeBitVar(diff - 1, stream);
		writePVSType(entity.pvs, stream);

		if (entity.pvs === PVS.ENTER) {
			if (packet.updatedBaseLine) {
				state.instanceBaselines[1 - packet.baseLine].set(entity.entityIndex, entity.clone().props);
			}

			writeEnterPVS(entity, stream, state, packet.baseLine);
		} else if (entity.pvs === PVS.PRESERVE) {
			const sendTable = getSendTable(state, entity.serverClass.dataTable);
			encodeEntityUpdate(entity.props, sendTable, stream);
		}
	}

	if (isDelta) {
		for (const removedEntity of packet.removedEntities) {
			stream.writeBoolean(true);
			stream.writeBits(removedEntity, 11);
		}
		stream.writeBoolean(false);
	}

	const packetDataEnd = stream.index;

	stream.index = lengthStart;
	stream.writeBits(packetDataEnd - packetDataStart, 20);
	stream.index = packetDataEnd;
}
