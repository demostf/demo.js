import {BitStream} from 'bit-buffer';
import {logBase2} from '../Math';

function makeUnsigned(value: number, signed?: boolean) {
	if (signed) {
		const signBit = value < 0 ? 1 : 0;
		return ((value ^ -signBit) << 1) + signBit;
	} else {
		return value;
	}
}

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

export function writeBitVar(value: number, stream: BitStream, signed?: boolean) {
	const bitsNeeded = (signed) ? logBase2(Math.abs(value)) + 2 : logBase2(value) + 1;
	if (signed) {
		const signBit = value < 0 ? 1 : 0;
		value = value ^ (-signBit << (bitsNeeded - 1)) + (signBit << (bitsNeeded - 1));
	}

	if (bitsNeeded > 12) {
		stream.writeBits(3, 2);
		stream.writeBits(value, 32);
	} else if (bitsNeeded > 8) {
		stream.writeBits(2, 2);
		stream.writeBits(value, 12);
	} else if (bitsNeeded > 4) {
		stream.writeBits(1, 2);
		stream.writeBits(value, 8);
	} else {
		stream.writeBits(0, 2);
		stream.writeBits(value, 4);
	}
}

export const readUBitVar = readBitVar;

export function readVarInt(stream: BitStream, signed: boolean = false) {
	let result = 0;
	for (let i = 0; i < 35; i += 7) {
		const byte = stream.readBits(8);
		result |= ((byte & 0x7F) << i);

		if ((byte >> 7) === 0) {
			break;
		}
	}

	if (signed) {
		return ((result >> 1) ^ -(result & 1));
	} else {
		return result;
	}
}

export function writeVarInt(value: number, stream: BitStream, signed: boolean = false) {
	value = makeUnsigned(value, signed);

	do {
		const byte = value & 0x7F;
		const resumeBit = (value > 128) ? 0x80 : 0;
		stream.writeUint8(byte | resumeBit);
		value = value >> 7;
	} while (value > 0);
}
