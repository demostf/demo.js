import {BitStream} from 'bit-buffer';
import {
	EncodeBSPDecal, encodeVecCoord, getVecCoord,
	ParseBSPDecal
} from '../../../../Parser/Packet/BSPDecal';
import {SendPropEncoder} from '../../../../Parser/SendPropEncoder';
import {SendPropParser} from '../../../../Parser/SendPropParser';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

const data = [239, 236, 208, 85, 33, 127, 128, 9, 8];

suite('BSPDecal', () => {
	test('getCoord', () => {
		assertParser(SendPropParser.readBitCoord, getStream([157, 29, 186]), -948, 17);
	});

	test('getVecCoord', () => {
		assertParser(getVecCoord, getStream([239, 236, 208, 85, 33, 127, 128]), {
			x: -948,
			y: -684,
			z: 128
		}, 54);
	});

	test('encodeCoord', () => {
		assertEncoder(SendPropParser.readBitCoord, SendPropEncoder.writeBitCoord, 5, 17);
		assertEncoder(SendPropParser.readBitCoord, SendPropEncoder.writeBitCoord, -5, 17);
		assertEncoder(SendPropParser.readBitCoord, SendPropEncoder.writeBitCoord, 0.09375, 8);
		assertEncoder(SendPropParser.readBitCoord, SendPropEncoder.writeBitCoord, -6.09375, 22);
		assertEncoder(SendPropParser.readBitCoord, SendPropEncoder.writeBitCoord, 0, 2);
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

	test('Re-encode bspDecal', () => {
		assertReEncode(getVecCoord, encodeVecCoord, getStream([239, 236, 208, 85, 33, 127, 128]));
	});
});
