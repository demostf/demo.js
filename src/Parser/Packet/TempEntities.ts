import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {TempEntitiesPacket} from '../../Data/Packet';
import {PacketEntity, PVS} from '../../Data/PacketEntity';
import {encodeEntityUpdate, getEntityUpdate} from '../EntityDecoder';
import {readVarInt, writeVarInt} from '../readBitVar';
import {DynamicBitStream} from '../../DynamicBitStream';

export function ParseTempEntities(stream: BitStream, match: Match, skip: boolean = false): TempEntitiesPacket { // 10: classInfo
	const entityCount = stream.readUint8();
	const length = readVarInt(stream);
	const entityData = stream.readBitStream(length);

	let entity: PacketEntity | null = null;
	const entities: PacketEntity[] = [];
	if (!skip) {
		for (let i = 0; i < entityCount; i++) {
			const delay = (entityData.readBoolean()) ? entityData.readUint8() / 100 : 0; // unused it seems
			if (entityData.readBoolean()) {
				const classId = entityData.readBits(match.classBits);
				const serverClass = match.serverClasses[classId - 1];
				if (!serverClass) {
					throw new Error(`Unknown serverClass ${classId}`);
				}
				// no clue why the -1 but it works
				const sendTable = match.getSendTable(serverClass.dataTable);
				entity = new PacketEntity(serverClass, 0, PVS.ENTER);
				entity.delay = delay;
				entity.props = getEntityUpdate(sendTable, entityData);
				entities.push(entity);
			} else {
				if (entity) {
					const updatedProps = getEntityUpdate(match.getSendTable(entity.serverClass.dataTable), entityData);
					entity.applyPropUpdate(updatedProps);
				} else {
					throw new Error('no entity set to update');
				}
			}
		}
		if (entityData.bitsLeft > 8) {
			throw new Error(`unexpected content after TempEntities ${entityData.bitsLeft} bits`);
		}
	}

	return {
		packetType: 'tempEntities',
		entities,
	};
}

export function EncodeTempEntities(packet: TempEntitiesPacket, stream: BitStream, match: Match) {
	stream.writeUint8(packet.entities.length);

	const entityStream = new DynamicBitStream();
	for (const entity of packet.entities) {
		if (entity.delay) {
			entityStream.writeBoolean(true);
			entityStream.writeUint8(Math.round(entity.delay * 100));
		} else {
			entityStream.writeBoolean(false);
		}

		entityStream.writeBoolean(true);

		const classId = match.serverClasses.findIndex(serverClass => serverClass && serverClass.name === entity.serverClass.name) + 1;
		entityStream.writeBits(classId, match.classBits);

		const sendTable = match.getSendTable(entity.serverClass.dataTable);

		encodeEntityUpdate(entity.props, sendTable, entityStream);
	}

	const entityDataLength = entityStream.index;
	entityStream.index = 0;

	writeVarInt(entityDataLength, stream);

	stream.writeBitStream(entityStream, entityDataLength);
}
