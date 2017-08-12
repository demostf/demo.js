import {make} from '../../../../Parser/Packet/ParserGenerator';
import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';

function assertGeneratedParser(definition: string, stream: BitStream, expected: any, length: number) {
	expected.packetType = 'packetName';
	const {parser} = make('packetName', definition);
	return assertParser(parser, stream, expected, length);
}

function assertGeneratedEncoder(definition: string, data: any, length: number = 0) {
	data.packetType = 'packetName';
	const {parser, encoder} = make('packetName', definition);
	return assertEncoder(parser, encoder, data, length);
}

suite('Parser generator', () => {
	test('Empty parser', () => {
		assertGeneratedParser('', getStream('dummy'), {}, 0);
	});

	test('Fixed string', () => {
		assertGeneratedParser('foo{s3}', getStream('dummy'), {foo: 'dum'}, 3 * 8);
	});

	test('Null terminated string', () => {
		assertGeneratedParser('foo{s}', getStream('dummy'), {foo: 'dummy'}, 5 * 8);
	});

	test('Boolean', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeBoolean(1);
		stream.writeBoolean(0);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertGeneratedParser('foo{b}', stream, {foo: true}, 1);
		assertGeneratedParser('foo{b}', stream, {foo: false}, 1);
	});

	test('Unsigned Int', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeUint8(0b11111111);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertGeneratedParser('foo{u2}', stream, {foo: 3}, 2);
		assertGeneratedParser('foo{u8}', stream, {foo: 0b00111111}, 8);
		assertGeneratedParser('foo{u12}', stream, {foo: 0b0000111111000011}, 12);
	});

	test('Signed Int', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeUint8(0b11111111);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertGeneratedParser('foo{2}', stream, {foo: -1}, 2);
		assertGeneratedParser('foo{8}', stream, {foo: 63}, 8);
		assertGeneratedParser('foo{12}', stream, {foo: -61}, 12);
	});

	test('Variable length', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeUint8(0b11111111);
		stream.writeUint8(0b00001100);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertGeneratedParser('length{u2}foo{$length}', stream, {length: 3, foo: 7}, 5);
	});

	test('Float32', () => {
		const stream = new BitStream(new ArrayBuffer(64));
		stream.writeFloat32(12.234233856201172);
		stream.writeASCIIString('remaining');
		stream.index = 0;

		assertGeneratedParser('foo{f32}', stream, {foo: 12.234233856201172}, 32);
	});

	test('Encode fixed string', () => {
		assertGeneratedEncoder('foo{s3}', {
			foo: 'bar'
		}, 3 * 8);
	});

	test('Encode null terminated string', () => {
		assertGeneratedEncoder('foo{s}', {
			foo: 'bar'
		}, 4 * 8);
	});

	test('Encode booleans', () => {
		assertGeneratedEncoder('foo{b}bar{b}', {
			foo: 1,
			bar: 0
		}, 2);
	});
	test('Encode integers', () => {
		assertGeneratedEncoder('foo{u2}bar{12}', {
			foo: 3,
			bar: 7
		}, 2 + 12);
	});
	test('Encode variable length', () => {
		assertGeneratedEncoder('foo{u2}bar{$foo}', {
			foo: 3,
			bar: 4
		}, 2 + 3);
	});
	test('Encode float', () => {
		assertGeneratedEncoder('foo{f32}', {
			foo: 3.5
		}, 32);
	});
});
