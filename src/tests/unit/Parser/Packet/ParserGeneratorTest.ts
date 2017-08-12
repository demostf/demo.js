import * as assert from 'assert';
import {make} from '../../../../Parser/Packet/ParserGenerator';
import {BitStream} from 'bit-buffer';
import {Packet} from '../../../../Data/Packet';

function getStream(data: string) {
	const buffer = new Buffer(data);
	return new BitStream(buffer);
}

function assertEncoder(definition: string, data: any, length: number = 0) {
	const stream = new BitStream(new ArrayBuffer(64));
	const {parser, encoder} = make('packetName', definition);
	data.packetType = 'packetName';

	encoder(data as Packet, stream);

	const pos = stream.index;

	if (length) {
		assert.equal(stream.index, length, 'Unexpected number of bits used for encoding');
	}

	stream.index = 0;

	const result = parser(stream);
	assert.deepEqual(data, result);
	assert.equal(pos, stream.index, 'Number of bits used for encoding and parsing not equal');
}

function assertParser(definition: string, stream: BitStream, expected: any, length: number) {
	const {parser} = make('packetName', definition);
	expected.packetType = 'packetName';
	const start = stream.index;
	assert.deepEqual(expected, parser(stream));
	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
}

suite('Parser generator', () => {
	test('Empty parser', () => {
		assertParser('', getStream('dummy'), {}, 0);
	});

	test('Fixed string', () => {
		assertParser('foo{s3}', getStream('dummy'), {foo: 'dum'}, 3 * 8);
	});

	test('Null terminated string', () => {
		assertParser('foo{s}', getStream('dummy'), {foo: 'dummy'}, 5 * 8);
	});

	test('Boolean', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeBoolean(1);
		stream.writeBoolean(0);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertParser('foo{b}', stream, {foo: true}, 1);
		assertParser('foo{b}', stream, {foo: false}, 1);
	});

	test('Unsigned Int', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeUint8(0b11111111);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertParser('foo{u2}', stream, {foo: 3}, 2);
		assertParser('foo{u8}', stream, {foo: 0b00111111}, 8);
		assertParser('foo{u12}', stream, {foo: 0b0000111111000011}, 12);
	});

	test('Signed Int', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeUint8(0b11111111);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertParser('foo{2}', stream, {foo: -1}, 2);
		assertParser('foo{8}', stream, {foo: 63}, 8);
		assertParser('foo{12}', stream, {foo: -61}, 12);
	});

	test('Variable length', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertParser('length{u2}foo{$length}', stream, {length: 3, foo: 7}, 5);
	});

	test('Float32', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeFloat32(12.234233856201172);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertParser('foo{f32}', stream, {foo: 12.234233856201172}, 32);
	});

	test('Encode fixed string', () => {
		assertEncoder('foo{s3}', {
			foo: 'bar'
		}, 3 * 8);
	});

	test('Encode null terminated string', () => {
		assertEncoder('foo{s}', {
			foo: 'bar'
		}, 4 * 8);
	});

	test('Encode booleans', () => {
		assertEncoder('foo{b}bar{b}', {
			foo: 1,
			bar: 0
		}, 2);
	});
	test('Encode integers', () => {
		assertEncoder('foo{u2}bar{12}', {
			foo: 3,
			bar: 7
		}, 2 + 12);
	});
	test('Encode variable length', () => {
		assertEncoder('foo{u2}bar{$foo}', {
			foo: 3,
			bar: 4
		}, 2 + 3);
	});
	test('Encode float', () => {
		assertEncoder('foo{f32}', {
			foo: 3.5
		}, 32);
	});
});
