import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {Match} from "../../Data/Match";
import {Entity} from "../../Data/Entity";
import {applyEntityUpdate} from "../EntityDecoder";

export function TempEntities(stream: BitStream, match: Match): Packet { // 10: classInfo
	const entityCount = stream.readBits(8);
	const length      = readVarInt(stream);
	const end         = stream.index + length;

	let entity: Entity|null = null;
	let entities: Entity[]  = [];
	for (let i = 0; i < entityCount; i++) {
		const delay = (stream.readBoolean()) ? stream.readUint8() / 100 : 0; //unused it seems
		if (stream.readBoolean()) {
			const classId     = stream.readBits(match.classBits);
			const serverClass = match.serverClasses[classId - 1]; //no clue why the -1 but it works
			const sendTable   = match.getSendTable(serverClass.dataTable);
			entity            = new Entity(serverClass, sendTable, 0, 0);
			applyEntityUpdate(entity, stream);
			entities.push(entity);
		} else {
			if (entity) {
				applyEntityUpdate(entity, stream);
			} else {
				throw new Error("no entity set to update");
			}
		}
	}
	if (end - stream.index > 8) {
		throw new Error("unexpected content after TempEntities");
	}

	stream.index = end;
	return {
		'packetType': 'tempEntities',
		entities: entities
	}
}

function readVarInt(stream: BitStream) {
	let result = 0;
	for (let run = 0; run < 35; run += 7) {
		const byte = stream.readUint8();
		result |= ((byte & 0x7F) << run);

		if ((byte >> 7) == 0) {
			return result;
		}
	}
	return result;
}
