import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {DynamicBitStream} from '../../DynamicBitStream';
import {nullTransform, Transformer} from '../../Transformer';
import {Parser} from '../../Parser';
import {Analyser} from '../../Analyser';

function testDemo(name: string) {
	const target = JSON.parse(readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
	const decodeStream = new BitStream(
		readFileSync(`${__dirname}/../data/${name}.dem`).buffer as ArrayBuffer
	);
	const encodeStream = new DynamicBitStream(32 * 1024 * 1024);

	const transformer = new Transformer(decodeStream, encodeStream);
	transformer.transform(nullTransform, nullTransform);

	const encodedLength = encodeStream.index;
	encodeStream.index = 0;

	console.log('start reparse');

	const reParser = new Parser(encodeStream);
	const analyser = new Analyser(reParser);
	const parsed = analyser.getBody().getState();

	const reParsedLength = encodeStream.index;

	assert.equal(reParsedLength, encodedLength, 'Unexpected number of bits used when parsing encoding stream');

	assert.deepEqual(JSON.parse(JSON.stringify(parsed)), target);
}

suite('Transcode demo', () => {
	test('Noop transcode', () => {
		testDemo('short');
	});
});
