import * as assert from 'assert';
import {readFileSync} from 'fs';
import {Demo} from '../../Demo';
import {Packet} from '../../Data/Packet';
import {BitStream} from 'bit-buffer';

function testDemo(name: string, fastMode: boolean = false) {
	const target = JSON.parse(readFileSync(`${__dirname}/../data/${name}.json`, 'utf8'));
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo = Demo.fromNodeBuffer(source);
	const parser = demo.getParser(fastMode);
	parser.readHeader();
	parser.parseBody();
	const parsed = parser.match.getState();
	assert.deepEqual(JSON.parse(JSON.stringify(parsed)), target);
}

function testPackets() {
	const target = JSON.parse(readFileSync(`${__dirname}/../data/${name}_packets.json`, 'utf8'));
	const source = readFileSync(`${__dirname}/../data/${name}.dem`);
	const demo = Demo.fromNodeBuffer(source);
	const parser = demo.getParser(false);
	parser.readHeader();
	const match = parser.match;

	const packets: {[tick: string]: Partial<Packet>[]} = {};

	parser.on('packet', (packet: Packet) => {
		if (!packets[match.tick]) {
			packets[match.tick] = [];
		}
		const packetData = {};
		for (const key in packet) {
			if (packet.hasOwnProperty(key) && !(packet[key] instanceof BitStream)) {
				packetData[key] = packet[key];
			}
		}
		packets[match.tick].push(packetData);
	});

	assert.deepEqual(JSON.parse(JSON.stringify(packets)), target);
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
});
