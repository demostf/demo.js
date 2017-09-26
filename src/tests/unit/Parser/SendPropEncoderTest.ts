import {BitStream} from 'bit-buffer';
import {SendPropDefinition, SendPropFlag, SendPropType} from '../../../Data/SendPropDefinition';
import {readBitVar, readVarInt, writeBitVar, writeVarInt} from '../../../Parser/readBitVar';
import {SendPropEncoder} from '../../../Parser/SendPropEncoder';
import {SendPropParser} from '../../../Parser/SendPropParser';
import {assertEncoder, assertParser, getStream} from './Packet/PacketTest';

function basicIntReader(bitCount: number, signed: boolean) {
	return (stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Int, '', signed ? 0 : SendPropFlag.SPROP_UNSIGNED, '');
		definition.bitCount = bitCount;
		return SendPropParser.decode(
			definition,
			stream
		);
	};
}

function basicIntWriter(bitCount: number, signed: boolean) {
	return (value: number, stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Int, '', signed ? 0 : SendPropFlag.SPROP_UNSIGNED, '');
		definition.bitCount = bitCount;
		return SendPropEncoder.encode(
			value,
			definition,
			stream
		);
	};
}

function readString(stream: BitStream) {
	const definition = new SendPropDefinition(SendPropType.DPT_String, '', 0, '');
	return SendPropParser.decode(definition, stream);
}

function writeString(value: string, stream: BitStream) {
	const definition = new SendPropDefinition(SendPropType.DPT_String, '', 0, '');
	return SendPropEncoder.encode(value, definition, stream);
}

function arrayReader(arrayType: SendPropType, length: number, arrayFlags: number = 0, arrayBitSize: number = 0) {
	return (stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Array, '', 0, '');
		definition.numElements = length;
		definition.arrayProperty = new SendPropDefinition(arrayType, '', arrayFlags, '');
		definition.arrayProperty.bitCount = arrayBitSize;
		return SendPropParser.decode(
			definition,
			stream
		);
	};
}

function arrayWriter(arrayType: SendPropType, length: number, arrayFlags: number = 0, arrayBitSize: number = 0) {
	return (value: any[], stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Array, '', 0, '');
		definition.numElements = length;
		definition.arrayProperty = new SendPropDefinition(arrayType, '', arrayFlags, '');
		definition.arrayProperty.bitCount = arrayBitSize;
		return SendPropEncoder.encode(
			value,
			definition,
			stream
		);
	};
}

function floatReader(flags: number, bitCount: number = 0, lowValue: number = 0, highValue: number = 0) {
	return (stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Float, '', flags, '');
		definition.bitCount = bitCount;
		definition.lowValue = lowValue;
		definition.highValue = highValue;
		return SendPropParser.decode(
			definition,
			stream
		);
	};
}

function floatWriter(flags: number, bitCount: number = 0, lowValue: number = 0, highValue: number = 0) {
	return (value: number, stream: BitStream) => {
		const definition = new SendPropDefinition(SendPropType.DPT_Float, '', flags, '');
		definition.bitCount = bitCount;
		definition.lowValue = lowValue;
		definition.highValue = highValue;
		return SendPropEncoder.encode(
			value,
			definition,
			stream
		);
	};
}

suite('SendPropEncoder', () => {
	test('basic int', () => {
		assertEncoder(basicIntReader(9, false), basicIntWriter(9, false), 61, 9);
		assertEncoder(basicIntReader(9, true), basicIntWriter(9, true), -61, 9);
	});

	test('string', () => {
		assertEncoder(readString, writeString, 'foobar', (7 * 8) + 9);
		assertEncoder(readString, writeString, '', 8 + 9);
	});

	test('array', () => {
		assertEncoder(arrayReader(SendPropType.DPT_Int, 2, 0, 5),
			arrayWriter(SendPropType.DPT_Int, 2, SendPropFlag.SPROP_UNSIGNED, 5),
			[12, 14], 12);
		assertEncoder(arrayReader(SendPropType.DPT_Int, 2, 0, 5),
			arrayWriter(SendPropType.DPT_Int, 2, 0, 5),
			[12, -14], 12);
		assertEncoder(arrayReader(SendPropType.DPT_Int, 9, 0, 5),
			arrayWriter(SendPropType.DPT_Int, 9, 0, 5),
			[1, 2, 3, 4, 5, 6, 7, 8, 9], 5 * 9 + 4);
		assertEncoder(arrayReader(SendPropType.DPT_String, 2),
			arrayWriter(SendPropType.DPT_String, 2),
			['foo', 'bar'], (4 * 8 + 9) * 2 + 2);
	});

	test('floats', () => {
		assertEncoder(floatReader(0, 12, 0, 128), floatWriter(0, 12, 0, 128), 61.01489621489622, 12);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD), floatWriter(SendPropFlag.SPROP_COORD), 12.5, 22);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD), floatWriter(SendPropFlag.SPROP_COORD), -12, 17);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD), floatWriter(SendPropFlag.SPROP_COORD), .5, 8);

		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP), floatWriter(SendPropFlag.SPROP_COORD_MP), 12.5, 19);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP), floatWriter(SendPropFlag.SPROP_COORD_MP), .5, 8);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP), floatWriter(SendPropFlag.SPROP_COORD_MP), -0.5, 8);

		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), floatWriter(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), 12.5, 17);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), floatWriter(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), .5, 6);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), floatWriter(SendPropFlag.SPROP_COORD_MP_LOWPRECISION), -0.5, 6);

		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_INTEGRAL), floatWriter(SendPropFlag.SPROP_COORD_MP_INTEGRAL), 12, 14);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_INTEGRAL), floatWriter(SendPropFlag.SPROP_COORD_MP_INTEGRAL), -12, 14);
		assertEncoder(floatReader(SendPropFlag.SPROP_COORD_MP_INTEGRAL), floatWriter(SendPropFlag.SPROP_COORD_MP_INTEGRAL), 0, 2);

		assertEncoder(floatReader(SendPropFlag.SPROP_NOSCALE), floatWriter(SendPropFlag.SPROP_NOSCALE), 12.5, 32);
		assertEncoder(floatReader(SendPropFlag.SPROP_NOSCALE), floatWriter(SendPropFlag.SPROP_NOSCALE), .5, 32);
		assertEncoder(floatReader(SendPropFlag.SPROP_NOSCALE), floatWriter(SendPropFlag.SPROP_NOSCALE), -0.5, 32);

		assertEncoder(floatReader(SendPropFlag.SPROP_NORMAL), floatWriter(SendPropFlag.SPROP_NORMAL), .5002442598925256, 12);
		assertEncoder(floatReader(SendPropFlag.SPROP_NORMAL), floatWriter(SendPropFlag.SPROP_NORMAL), -0.5002442598925256, 12);
	});
});
