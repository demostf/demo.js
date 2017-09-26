import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {isObject} from 'util';
import {Packet} from '../../../../Data/Packet';
import {ParserState} from '../../../../Data/ParserState';
import {deepEqual} from '../../deepEqual';

export function getStream(data: string | number[]) {
	if (typeof data === 'string') {
		const buffer = new Buffer(data + '\0remaining dummy data');
		return new BitStream(buffer);
	} else {
		const array = new Uint8Array(data as number[]);
		return new BitStream(array.buffer as ArrayBuffer);
	}
}

export type Encoder = (data: any, stream: BitStream, state?) => void;

export function assertEncoder(parser: Parser, encoder: Encoder, data: any, length: number = 0, message: string = '', state?: ParserState) {
	const stream = new BitStream(new ArrayBuffer(length + 64000));

	encoder(data as Packet, stream, state);

	const pos = stream.index;

	if (length) {
		assert.equal(stream.index, length, 'Unexpected number of bits used for encoding' + message);
	}

	stream.index = 0;

	const result = parser(stream);
	if (!deepEqual(result, data)) {
		assert.deepEqual(result, data, 'Re-decoded value not equal to original value' + message);
	}
	assert.equal(stream.index, pos, 'Number of bits used for encoding and parsing not equal' + message);
}

export type Parser = (stream: BitStream, state?) => any;

export function assertParser(parser: Parser, stream: BitStream, expected: any, length: number, state?: ParserState) {
	const start = stream.index;
	const result = parser(stream, state);
	if (!deepEqual(result, expected)) {
		assert.deepEqual(result, expected);
	}
	assert.equal(stream.index - start, length, 'Unexpected number of bits consumed from stream');
}
