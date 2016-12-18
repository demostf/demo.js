import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function TempEntities(stream: BitStream): Packet { // 10: classInfo
	const entityCount = stream.readBits(8);
	const length      = readVarInt(stream);
	console.log(length);
	stream._index += length;

	return {
		'packetType': 'tempEntities'
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
