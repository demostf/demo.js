import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {Packet} from '../../../../Data/Packet';
import {Encoder, Parser} from '../../../../Parser/Packet/Parser';
import {isArray} from 'util';

export function getStream(data: string | number[]) {
	if (isArray(data)) {
		const array = new Uint8Array(data as number[]);
		return new BitStream(array.buffer);
	} else {
		const buffer = new Buffer(data + '\0remaining dummy data');
		return new BitStream(buffer);
	}
}

export function assertEncoder(parser: Parser, encoder: Encoder, data: any, length: number = 0) {
	const stream = new BitStream(new ArrayBuffer(64));

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

export function assertParser(parser: Parser, stream: BitStream, expected: any, length: number) {
	const start = stream.index;
	assert.deepEqual(expected, parser(stream));
	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
}
