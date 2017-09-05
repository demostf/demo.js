import * as assert from 'assert';
import {DynamicBitStream} from '../../DynamicBitStream';

suite('DynamitcBitStream', () => {
	test('write grow', () => {
		const stream = new DynamicBitStream(2);
		stream.writeBits(0, 15);
		stream.writeBits(17, 16);

		assert.equal(stream.length, 32);
		assert.equal(stream.index, 31);

		stream.index = 18;

		assert.equal(stream.readBits(2), 2);
	});
});
