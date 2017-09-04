import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {TempEntitiesPacket} from '../../Data/Packet';
import {PacketEntity, PVS} from '../../Data/PacketEntity';
import {getEntityUpdate} from '../EntityDecoder';
import {readVarInt} from '../readBitVar';

export function ParseTempEntities(stream: BitStream, match: Match, skip: boolean = false): TempEntitiesPacket { // 10: classInfo
	const entityCount = stream.readBits(8);
	const length = readVarInt(stream);
	const end = stream.index + length;

	let entity: PacketEntity | null = null;
	const entities: PacketEntity[] = [];
	if (!skip) {
		for (let i = 0; i < entityCount; i++) {
			const delay = (stream.readBoolean()) ? stream.readUint8() / 100 : 0; // unused it seems
			if (stream.readBoolean()) {
				const classId = stream.readBits(match.classBits);
				const serverClass = match.serverClasses[classId - 1];
				// no clue why the -1 but it works
				// maybe because world (id=0) can never be temp
				// but it's not like the -1 saves any space
				const sendTable = match.getSendTable(serverClass.dataTable);
				entity = new PacketEntity(serverClass, 0, PVS.ENTER);
				entity.delay = delay;
				entity.props = getEntityUpdate(sendTable, stream);
				entities.push(entity);
			} else {
				if (entity) {
					const updatedProps = getEntityUpdate(match.getSendTable(entity.serverClass.dataTable), stream);
					entity.applyPropUpdate(updatedProps);
				} else {
					throw new Error('no entity set to update');
				}
			}
		}
		if (end - stream.index > 8) {
			throw new Error('unexpected content after TempEntities');
		}
	}

	stream.index = end;
	return {
		packetType: 'tempEntities',
		entities,
	};
}
