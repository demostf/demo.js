import {BitStream} from "bit-buffer";
export function readBitVar(stream: BitStream, signed?: boolean): number {
	switch (stream.readBits(2)) {
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
