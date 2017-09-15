import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {Packet} from '../../../../Data/Packet';
import {deepEqual} from '../../deepEqual';
import {isObject} from 'util';

export function getStream(data: string | number[]) {
	if (typeof data === 'string') {
		const buffer = new Buffer(data + '\0remaining dummy data');
		return new BitStream(buffer);
	} else {
		const array = new Uint8Array(data as number[]);
		return new BitStream(array.buffer);
	}
}

export type Encoder = (data: any, stream: BitStream) => void;

export function assertEncoder(parser: Parser, encoder: Encoder, data: any, length: number = 0, message: string = '') {
	const stream = new BitStream(new ArrayBuffer(Math.max(64000, (length + 1) * 8)));

	encoder(data as Packet, stream);

	const pos = stream.index;

	if (length) {
		assert.equal(stream.index, length, 'Unexpected number of bits used for encoding' + message);
	}

	stream.index = 0;

	const result = parser(stream);
	deepEqual(result, data);
	if (!deepEqual(result, data)) {
		assert.deepEqual(result, data, 'Re-decoded value not equal to original value' + message);
	}
	assert.equal(stream.index, pos, 'Number of bits used for encoding and parsing not equal' + message);
}

export type Parser = (stream: BitStream, match?) => any;

export function assertParser(parser: Parser, stream: BitStream, expected: any, length: number) {
	const start = stream.index;
	const result = parser(stream);
	if (!deepEqual(result, expected)) {
		assert.deepEqual(result, expected);
	}
	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
}
