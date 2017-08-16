import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {
	EncodeBSPDecal, encodeCoord, encodeVecCoord, getCoord, getVecCoord,
	ParseBSPDecal
} from '../../../../Parser/Packet/BSPDecal';

const data = [239, 236, 208, 85, 33, 127, 128, 9, 8];

suite('BSPDecal', () => {
	test('getCoord', () => {
		assertParser(getCoord, getStream([157, 29, 186]), -948, 17);
	});

	test('getVecCoord', () => {
		assertParser(getVecCoord, getStream([239, 236, 208, 85, 33, 127, 128]), {
			x: -948,
			y: -684,
			z: 128
		}, 54);
	});

	test('encodeCoord', () => {
		assertEncoder(getCoord, encodeCoord, 5, 17);
		assertEncoder(getCoord, encodeCoord, -5, 17);
		assertEncoder(getCoord, encodeCoord, 0.09375, 8);
		assertEncoder(getCoord, encodeCoord, -6.09375, 22);
		assertEncoder(getCoord, encodeCoord, 0, 2);
	});

	test('encodeVecCoord', () => {
		assertEncoder(getVecCoord, encodeVecCoord, {
			x: 1,
			y: -12,
			z: 0.5
		}, 45);
		assertEncoder(getVecCoord, encodeVecCoord, {
			x: 0,
			y: 0,
			z: 0.5
		}, 11);
	});

	test('Parse bspDecal', () => {
		assertParser(ParseBSPDecal, getStream(data), {
			packetType: 'bspDecal',
			position: {x: -948, y: -684, z: 128},
			textureIndex: 38,
			entIndex: 0,
			modelIndex: 0,
			lowPriority: false
		}, 65);
	});

	test('Encode bspDecal', () => {
		assertEncoder(ParseBSPDecal, EncodeBSPDecal, {
			packetType: 'bspDecal',
			position: {x: -948, y: -684, z: 128},
			textureIndex: 38,
			entIndex: 0,
			modelIndex: 0,
			lowPriority: false
		}, 65);
	});
});
