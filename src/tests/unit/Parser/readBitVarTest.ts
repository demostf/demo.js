import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './Packet/PacketTest';
import {readBitVar, readVarInt, writeBitVar, writeVarInt} from '../../../Parser/readBitVar';

function readVarIntSigned(stream: BitStream) {
	return readVarInt(stream, true);
}

function writeVarIntSigned(value: number, stream: BitStream) {
	return writeVarInt(value, stream, true);
}

function readBitVarSigned(stream: BitStream) {
	return readBitVar(stream, true);
}

function writeBitVarSigned(value: number, stream: BitStream) {
	return writeBitVar(value, stream, true);
}

suite('readBitVar', () => {
	test('readVarInt', () => {
		assertParser(readVarInt, getStream([121, 25, 12, 14]), 121, 8);
		assertParser(readVarInt, getStream([129, 25, 12, 14]), 3201, 16);
		assertParser(readVarInt, getStream([129, 225, 12, 14]), 209025, 24);
		assertParser(readVarInt, getStream([129, 225, 212, 14]), 30748801, 32);
	});

	test('readVarInt signed', () => {
		assertParser(readVarIntSigned, getStream([121, 25, 12, 14]), -61, 8);
		assertParser(readVarIntSigned, getStream([129, 25, 12, 14]), -1601, 16);
		assertParser(readVarIntSigned, getStream([129, 225, 12, 14]), -104513, 24);
		assertParser(readVarIntSigned, getStream([130, 225, 212, 14]), 15374401, 32);
	});

	test('writeVarInt', () => {
		assertEncoder(readVarInt, writeVarInt, 121, 8);
		assertEncoder(readVarInt, writeVarInt, 3201, 16);
		assertEncoder(readVarInt, writeVarInt, 209025, 24);
		assertEncoder(readVarInt, writeVarInt, 30748801, 32);
	});

	test('writeVarInt signed', () => {
		assertEncoder(readVarIntSigned, writeVarIntSigned, -61, 8);
		assertEncoder(readVarIntSigned, writeVarIntSigned, -1254, 16);
		assertEncoder(readVarIntSigned, writeVarIntSigned, -104513, 24);
		assertEncoder(readVarIntSigned, writeVarIntSigned, 15374401, 32);
	});

	test('readBitVar', () => {
		assertParser(readBitVar, getStream([121, 25, 12, 14]), 94, 10);
		assertParser(readBitVar, getStream([130, 25, 12, 14]), 1632, 14);
		assertParser(readBitVar, getStream([8, 225, 12, 14]), 2, 6);
		assertParser(readBitVar, getStream([131, 225, 212, 14, 123]), 3283433568, 34);
	});

	test('readBitVar signed', () => {
		assertParser(readBitVarSigned, getStream([120, 225, 12, 14]), -2, 6);
		assertParser(readBitVarSigned, getStream([121, 25, 12, 14]), 94, 10);
		assertParser(readBitVarSigned, getStream([130, 25, 12, 14]), 1632, 14);
		assertParser(readBitVarSigned, getStream([131, 225, 212, 14, 123]), -1011533728, 34);
	});

	test('writeBitVar', () => {
		assertEncoder(readBitVar, writeBitVar, 2, 6);
		assertEncoder(readBitVar, writeBitVar, 94, 10);
		assertEncoder(readBitVar, writeBitVar, 1632, 14);
		assertEncoder(readBitVar, writeBitVar, 3283433568, 34);
	});

	test('writeBitVar signed', () => {
		assertEncoder(readBitVarSigned, writeBitVarSigned, 2, 6);
		assertEncoder(readBitVarSigned, writeBitVarSigned, -94, 10);
		assertEncoder(readBitVarSigned, writeBitVarSigned, 1632, 14);
		assertEncoder(readBitVarSigned, writeBitVarSigned, -283433565, 34);
	});
});
