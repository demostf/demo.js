import {BitStream} from "bit-buffer";
export function readBitVar(stream: BitStream, signed?: boolean): number {
	const type = stream.readBits(2);
	switch (type) {
		case 0:
			return stream.readBits(4, signed);
		case 1:
			return stream.readBits(8, signed);
		case 2:
			return stream.readBits(12, signed);
		case 3:
			return stream.readBits(32, signed);
	}
	throw new Error('Invalid var bit');
}

export const readUBitVar = readBitVar;


export function readVarInt(stream: BitStream) {
	let result = 0;
	for (let i = 0; i < 35; i += 7) {
		const byte = stream.readBits(8);
		result |= ((byte & 0x7F) << i);

		if ((byte >> 7) === 0) {
			break;
		}
	}

	return result;
}
