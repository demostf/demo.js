import * as assert from 'assert';
import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {Demo, ParseMode} from '../../Demo';

function testDemo(name: string, fastMode: boolean = false) {
	const target = JSON.parse(readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo = Demo.fromNodeBuffer(source);
	const analyser = demo.getAnalyser(fastMode ? ParseMode.MINIMAL : ParseMode.COMPLETE);
	const parsed = analyser.getBody().getState();
	assert.deepEqual(JSON.parse(JSON.stringify(parsed)), target);
}

suite('Parse basic demo info', () => {
	test('Fast mode', () => {
		testDemo('snakewater', true);
	});

	test('Parse snakewater.dem', () => {
		testDemo('snakewater');
	});

	test('Parse demo with new celt voice codec', () => {
		testDemo('celt');
	});

	test('Parse pov demo', () => {
		testDemo('pov');
	});

	test('Parse post MyM pov demo', () => {
		testDemo('pov2');
	});

	test('Parse pyro update demo', () => {
		testDemo('pyroupdate');
	});

	test('Parse hl2dm ffa demo', () => {
		testDemo('hl2dm_ffa');
	});

	test('Parse hl2dm 2v2 demo', () => {
		testDemo('hl2dm_2v2');
	});
});
