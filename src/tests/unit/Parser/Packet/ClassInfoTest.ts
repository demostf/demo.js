import {BitStream} from 'bit-buffer';
import {EncodeClassInfo, ParseClassInfo} from '../../../../Parser/Packet/ClassInfo';
import {assertEncoder, assertParser, getStream} from './PacketTest';

suite('ClassInfo', () => {
	test('Parse classInfo', () => {
		assertParser(ParseClassInfo, getStream([92, 1, 29]), {
			packetType: 'classInfo',
			number: 348,
			create: true,
			entries: []
		}, 17);
	});

	test('Encode classInfo', () => {
		assertEncoder(ParseClassInfo, EncodeClassInfo, {
			packetType: 'classInfo',
			number: 348,
			create: true,
			entries: []
		}, 17);
	});
});
