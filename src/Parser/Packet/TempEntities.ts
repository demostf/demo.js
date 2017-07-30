import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {TempEntitiesPacket} from '../../Data/Packet';
import {PacketEntity, PVS} from '../../Data/PacketEntity';
import {applyEntityUpdate} from '../EntityDecoder';

export function TempEntities(stream: BitStream, match: Match, skip: boolean = false): TempEntitiesPacket { // 10: classInfo
	const entityCount = stream.readBits(8);
	const length      = readVarInt(stream);
	const end         = stream.index + length;

	let entity: PacketEntity|null = null;
	const entities: PacketEntity[]  = [];
	if (!skip) {
		for (let i = 0; i < entityCount; i++) {
			const delay = (stream.readBoolean()) ? stream.readUint8() / 100 : 0; // unused it seems
			if (stream.readBoolean()) {
				const classId     = stream.readBits(match.classBits);
				const serverClass = match.serverClasses[classId - 1];
				// no clue why the -1 but it works
				// maybe because world (id=0) can never be temp
				// but it's not like the -1 saves any space
				const sendTable = match.getSendTable(serverClass.dataTable);
				entity          = new PacketEntity(serverClass, 0, PVS.ENTER);
				applyEntityUpdate(entity, sendTable, stream);
				entities.push(entity);
			} else {
				if (entity) {
					applyEntityUpdate(entity, match.getSendTable(entity.serverClass.dataTable), stream);
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

function readVarInt(stream: BitStream) {
	let result = 0;
	for (let run = 0; run < 35; run += 7) {
		const byte = stream.readUint8();
		result |= ((byte & 0x7F) << run);

		if ((byte >> 7) === 0) {
			return result;
		}
	}
	return result;
}
