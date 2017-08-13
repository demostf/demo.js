import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {Packet} from '../../../../Data/Packet';

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

export function assertEncoder(parser: Parser, encoder: Encoder, data: any, length: number = 0) {
	const stream = new BitStream(new ArrayBuffer(Math.max(64, length * 8)));

	encoder(data as Packet, stream);

	const pos = stream.index;

	if (length) {
		assert.equal(stream.index, length, 'Unexpected number of bits used for encoding');
	}

	stream.index = 0;

	const result = parser(stream);
	assert.deepEqual(result, data, 'Re-decoded value not equal to original value');
	assert.equal(stream.index, pos, 'Number of bits used for encoding and parsing not equal');
}

export type Parser = (stream: BitStream) => any;

export function assertParser(parser: Parser, stream: BitStream, expected: any, length: number) {
	const start = stream.index;
	assert.deepEqual(parser(stream), expected);
	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
}
