import {BitStream} from 'bit-buffer';
import {TempEntitiesPacket} from '../../Data/Packet';
import {PacketEntity, PVS} from '../../Data/PacketEntity';
import {encodeEntityUpdate, getEntityUpdate} from '../EntityDecoder';
import {readVarInt, writeVarInt} from '../readBitVar';
import {DynamicBitStream} from '../../DynamicBitStream';
import {getClassBits, getSendTable, ParserState} from '../../Data/ParserState';

export function ParseTempEntities(stream: BitStream, state: ParserState, skip: boolean = false): TempEntitiesPacket { // 10: classInfo
	const entityCount = stream.readUint8();
	const length = readVarInt(stream);
	const entityData = stream.readBitStream(length);

	let entity: PacketEntity | null = null;
	const entities: PacketEntity[] = [];
	if (!skip) {
		for (let i = 0; i < entityCount; i++) {
			const delay = (entityData.readBoolean()) ? entityData.readUint8() / 100 : 0; // unused it seems
			if (entityData.readBoolean()) {
				const classId = entityData.readBits(getClassBits(state));
				// no clue why the -1 but it works
				const serverClass = state.serverClasses[classId - 1];
				if (!serverClass) {
					throw new Error(`Unknown serverClass ${classId}`);
				}
				const sendTable = getSendTable(state, serverClass.dataTable);
				entity = new PacketEntity(serverClass, 0, PVS.ENTER);
				entity.delay = delay;
				entity.props = getEntityUpdate(sendTable, entityData);
				entities.push(entity);
			} else {
				if (entity) {
					const sendTable = getSendTable(state, entity.serverClass.dataTable);
					const updatedProps = getEntityUpdate(sendTable, entityData);
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

export function EncodeTempEntities(packet: TempEntitiesPacket, stream: BitStream, state: ParserState) {
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

		const classId = state.serverClasses.findIndex(serverClass => serverClass && serverClass.name === entity.serverClass.name) + 1;
		entityStream.writeBits(classId, getClassBits(state));

		const sendTable = getSendTable(state, entity.serverClass.dataTable);

		encodeEntityUpdate(entity.props, sendTable, entityStream);
	}

	const entityDataLength = entityStream.index;
	entityStream.index = 0;

	writeVarInt(entityDataLength, stream);

	if (entityDataLength > 0) {
		stream.writeBitStream(entityStream, entityDataLength);
	}
}
