import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {DynamicBitStream} from '../../DynamicBitStream';
import {nullTransform, Transformer} from '../../Transformer';
import {Parser} from '../../Parser';
import {Analyser} from '../../Analyser';

function testDemo(name: string) {
	const decodeStream = new BitStream(
		readFileSync(`${__dirname}/../data/${name}.dem`).buffer as ArrayBuffer
	);

	const parser = new Parser(decodeStream);
	const analyser = new Analyser(parser);
	const original = analyser.getBody().getState();
	decodeStream.index = 0;

	const encodeStream = new DynamicBitStream(32 * 1024 * 1024);

	const transformer = new Transformer(decodeStream, encodeStream);
	transformer.transform(nullTransform, nullTransform);

	const encodedLength = encodeStream.index;
	encodeStream.index = 0;

	const reParser = new Parser(encodeStream);
	const reAnalyser = new Analyser(reParser);
	const parsed = reAnalyser.getBody().getState();

	const reParsedLength = encodeStream.index;

	assert.equal(reParsedLength, encodedLength, 'Unexpected number of bits used when parsing encoding stream');

	assert.deepEqual(JSON.parse(JSON.stringify(parsed)), original);
}

suite('Transcode demo', () => {
	test('Noop transcode', () => {
		testDemo('short');
	});
});
