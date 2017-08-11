import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {PacketEntitiesPacket} from '../../Data/Packet';
import {PacketEntity, PVS} from '../../Data/PacketEntity';
import {SendProp} from '../../Data/SendProp';
import {applyEntityUpdate} from '../EntityDecoder';
import {readUBitVar} from '../readBitVar';

const pvsMap = {
	0: PVS.PRESERVE,
	2: PVS.ENTER,
	1: PVS.LEAVE,
	3: PVS.LEAVE + PVS.DELETE,
};

function readPVSType(stream: BitStream): PVS {
	const pvs = stream.readBits(2);
	// console.log(pvs);
	return pvsMap[pvs];
}

function readEnterPVS(stream: BitStream, entityId: number, match: Match): PacketEntity {
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs#L198
	const serverClass = match.serverClasses[stream.readBits(match.classBits)];
	const serial      = stream.readBits(10); // unused serial number

	if (match.baseLineCache[serverClass.id]) {
		const result        = match.baseLineCache[serverClass.id].clone();
		result.entityIndex  = entityId;
		result.serialNumber = serial;
		return result;
	} else {
		const entity    = new PacketEntity(serverClass, entityId, PVS.ENTER);
		const sendTable = match.getSendTable(serverClass.dataTable);
		if (!sendTable) {
			throw new Error('Unknown SendTable for serverclass');
		}
		const staticBaseLine = match.staticBaseLines[serverClass.id];
		if (staticBaseLine) {
			staticBaseLine.index = 0;
			applyEntityUpdate(entity, sendTable, staticBaseLine);
			match.baseLineCache[serverClass.id] = entity.clone();
			// if (staticBaseLine.bitsLeft > 7) {
				// console.log(staticBaseLine.length, staticBaseLine.index);
				// throw new Error('Unexpected data left at the end of staticBaseline, ' + staticBaseLine.bitsLeft + ' bits left');
			// }
		}
		entity.serialNumber = serial;
		return entity;
	}
}

function getPacketEntityForExisting(entityId: number, match: Match, pvs: PVS) {
	if (!match.entityClasses[entityId]) {
		throw new Error(`"unknown entity ${entityId} for ${PVS[pvs]}(${pvs})`);
	}
	const serverClass = match.entityClasses[entityId];
	return new PacketEntity(serverClass, entityId, pvs);
}

export function ParsePacketEntities(stream: BitStream, match: Match, skip: boolean = false): PacketEntitiesPacket { // 26: packetEntities
	// https://github.com/skadistats/smoke/blob/master/smoke/replay/handler/svc_packetentities.pyx
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Handler/PacketEntitesHandler.cs
	// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Entity.cs
	// https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs
	const maxEntries      = stream.readBits(11);
	const isDelta         = !!stream.readBits(1);
	const delta           = (isDelta) ? stream.readInt32() : 0;
	const baseLine        = stream.readBits(1);
	const updatedEntries  = stream.readBits(11);
	const length          = stream.readBits(20);
	const updatedBaseLine = stream.readBoolean();
	const end             = stream.index + length;
	let entityId          = -1;

	const receivedEntities: PacketEntity[] = [];
	const removedEntityIds: number[] = [];

	if (!skip) {
		for (let i = 0; i < updatedEntries; i++) {
			const diff = readUBitVar(stream);
			entityId += 1 + diff;
			const pvs  = readPVSType(stream);
			if (pvs === PVS.ENTER) {
				const packetEntity = readEnterPVS(stream, entityId, match);
				applyEntityUpdate(packetEntity, match.getSendTable(packetEntity.serverClass.dataTable), stream);

				if (updatedBaseLine) {
					const newBaseLine: SendProp[] = [];
					newBaseLine.concat(packetEntity.props);
					match.baseLineCache[packetEntity.serverClass.id] = packetEntity.clone();
				}
				packetEntity.inPVS = true;
				receivedEntities.push(packetEntity);
			} else if (pvs === PVS.PRESERVE) {
				const packetEntity = getPacketEntityForExisting(entityId, match, pvs);
				applyEntityUpdate(packetEntity, match.getSendTable(packetEntity.serverClass.dataTable), stream);
				receivedEntities.push(packetEntity);
			} else {
				if (match.entityClasses[entityId]) {
					const packetEntity = getPacketEntityForExisting(entityId, match, pvs);
					receivedEntities.push(packetEntity);
				}
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
		packetType:      'packetEntities',
		entities:        receivedEntities,
		removedEntities: removedEntityIds,
		maxEntries,
		isDelta,
		delta,
		baseLine,
		updatedEntries,
		length,
		updatedBaseLine,
	};
}
