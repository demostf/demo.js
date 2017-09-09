import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {PacketEntitiesPacket} from '../../Data/Packet';
import {EntityId, PacketEntity, PVS} from '../../Data/PacketEntity';
import {SendProp} from '../../Data/SendProp';
import {encodeEntityUpdate, getEntityUpdate} from '../EntityDecoder';
import {readUBitVar, writeBitVar} from '../readBitVar';
import {isDate} from 'util';
import {ServerClass} from '../../Data/ServerClass';
import {SendTable} from '../../Data/SendTable';

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

function readEnterPVS(stream: BitStream, entityId: EntityId, match: Match): PacketEntity {
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs#L198
	const serverClass = match.serverClasses[stream.readBits(match.classBits)];
	const serial = stream.readBits(10); // unused serial number

	const cachedBaseLine = match.baseLineCache.get(serverClass);
	if (cachedBaseLine) {
		const result = cachedBaseLine.clone();
		result.entityIndex = entityId;
		result.serialNumber = serial;
		return result;
	} else {
		const entity = new PacketEntity(serverClass, entityId, PVS.ENTER);
		const sendTable = match.getSendTable(serverClass.dataTable);
		if (!sendTable) {
			throw new Error('Unknown SendTable for serverclass');
		}
		const staticBaseLine = match.staticBaseLines.get(serverClass.id);
		if (staticBaseLine) {
			staticBaseLine.index = 0;
			const props = getEntityUpdate(sendTable, staticBaseLine);
			entity.applyPropUpdate(props);
			match.baseLineCache.set(serverClass, entity.clone());
			// if (staticBaseLine.bitsLeft > 7) {
			// console.log(staticBaseLine.length, staticBaseLine.index);
			// throw new Error('Unexpected data left at the end of staticBaseline, ' + staticBaseLine.bitsLeft + ' bits left');
			// }
		}
		entity.serialNumber = serial;
		return entity;
	}
}

/**
 * @param {PacketEntity} entity
 * @param {BitStream} stream
 * @param {Match} match
 * @returns {SendProp[]} the entities to be encoded
 */
function writeEnterPVS(entity: PacketEntity, stream: BitStream, match: Match) {
	const serverClassId = match.serverClasses.findIndex(serverClass => serverClass && entity.serverClass.id === serverClass.id);
	if (serverClassId === -1) {
		throw new Error(`Unknown server class ${entity.serverClass.name}(${entity.serverClass.id})`);
	}
	// get the instance from the match, not the entity
	const serverClass = match.serverClasses[serverClassId];

	stream.writeBits(serverClassId, match.classBits);
	stream.writeBits(entity.serialNumber || 0, 10);

	const cachedBaseLine = match.baseLineCache.get(serverClass);
	const propsToEncode = cachedBaseLine ? entity.diffFromBaseLine(cachedBaseLine) : entity.props;


	encodeEntityUpdate(propsToEncode, match.getSendTable(serverClass.dataTable), stream);
}

function getPacketEntityForExisting(entityId: EntityId, match: Match, pvs: PVS) {
	const serverClass = match.entityClasses.get(entityId);
	if (!serverClass) {
		throw new Error(`"unknown entity ${entityId} for ${PVS[pvs]}(${pvs})`);
	}

	return new PacketEntity(serverClass, entityId, pvs);
}

export function ParsePacketEntities(stream: BitStream, match: Match, skip: boolean = false): PacketEntitiesPacket { // 26: packetEntities
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
		for (let i = 0; i < updatedEntries; i++) {
			const diff = readUBitVar(stream);
			entityId += 1 + diff;
			const pvs = readPVSType(stream);
			if (pvs === PVS.ENTER) {
				const packetEntity = readEnterPVS(stream, entityId, match);
				const updatedProps = getEntityUpdate(match.getSendTable(packetEntity.serverClass.dataTable), stream);
				packetEntity.applyPropUpdate(updatedProps);

				if (updatedBaseLine) {
					// console.log('updated baseline', packetEntity.serverClass.name);
					const newBaseLine: SendProp[] = [];
					newBaseLine.concat(packetEntity.props);
					match.baseLineCache.set(packetEntity.serverClass, packetEntity.clone());
				}
				packetEntity.inPVS = true;
				receivedEntities.push(packetEntity);
			} else if (pvs === PVS.PRESERVE) {
				const packetEntity = getPacketEntityForExisting(entityId, match, pvs);
				const updatedProps = getEntityUpdate(match.getSendTable(packetEntity.serverClass.dataTable), stream);
				packetEntity.applyPropUpdate(updatedProps);
				receivedEntities.push(packetEntity);
			} else if (match.entityClasses.has(entityId)) {
				const packetEntity = getPacketEntityForExisting(entityId, match, pvs);
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

export function EncodePacketEntities(packet: PacketEntitiesPacket, stream: BitStream, match: Match) {
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

	for (const entity of packet.entities) {
		const diff = entity.entityIndex - lastEntityId;
		lastEntityId = entity.entityIndex;
		writeBitVar(diff - 1, stream);
		writePVSType(entity.pvs, stream);

		if (entity.pvs === PVS.ENTER) {
			writeEnterPVS(entity, stream, match);
		} else if (entity.pvs === PVS.PRESERVE) {
			encodeEntityUpdate(entity.props, match.getSendTable(entity.serverClass.dataTable), stream);
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
