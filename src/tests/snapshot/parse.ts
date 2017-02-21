import {readFileSync} from 'fs';
import {Demo} from "../../Demo";
import * as assert from 'assert';

function testDemo(name: string) {
	const target = JSON.parse(readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo   = Demo.fromNodeBuffer(source);
	const parser = demo.getParser();
	parser.readHeader();
	parser.parseBody();
	const parsed = parser.match.getState();
	assert.deepEqual(parsed, target);
}

suite('Parse basic demo info', () => {
	test('Parse snakewater.dem', () => {
		testDemo('snakewater');
	});

	test('Parse demo with new celt voice codec', () => {
		testDemo('celt');
	});

	test('Parse pov demo', () => {
		testDemo('pov');
	});
});
