import {BitStream} from 'bit-buffer';
import {readFileSync} from 'fs';
import {GameEvent} from '../../../../Data/GameEventTypes';
import {GameEventListPacket} from '../../../../Data/Packet';
import {EncodeGameEventList, ParseGameEventList} from '../../../../Parser/Packet/GameEventList';
import {assertEncoder, assertParser, assertReEncode, getStream} from './PacketTest';

const data = JSON.parse(readFileSync(__dirname + '/../../../data/gameEventListData.json', 'utf8'));
const expectedSource = JSON.parse(readFileSync(__dirname + '/../../../data/gameEventList.json', 'utf8'));

const expected = {
	packetType: 'gameEventList',
	eventList: new Map(Object.entries(expectedSource.eventList))
};

const eventList: GameEventListPacket = {
	packetType: 'gameEventList',
	eventList: new Map([
		[0, {
			id: 0,
			name: 'server_spawn' as GameEvent['name'],
			entries: [
				{
					type: 1,
					name: 'hostname'
				},
				{
					type: 1,
					name: 'address'
				},
				{
					type: 3,
					name: 'ip'
				},
				{
					type: 4,
					name: 'port'
				},
				{
					type: 1,
					name: 'game'
				},
				{
					type: 1,
					name: 'mapname'
				},
				{
					type: 3,
					name: 'maxplayers'
				},
				{
					type: 1,
					name: 'os'
				},
				{
					type: 6,
					name: 'dedicated'
				},
				{
					type: 6,
					name: 'password'
				}
			]
		}],
		[1, {
			id: 1,
			name: 'server_changelevel_failed' as GameEvent['name'],
			entries: [
				{
					type: 1,
					name: 'levelname'
				}
			]
		}],
		[2, {
			id: 2,
			name: 'server_shutdown' as GameEvent['name'],
			entries: [
				{
					type: 1,
					name: 'reason'
				}
			]
		}]
	])
};

suite('GameEventList', () => {
	test('Parse gameEventList', () => {
		assertParser(ParseGameEventList, getStream(data), expected, 122783);
	});

	test('Encode gameEventList', () => {
		assertEncoder(ParseGameEventList, EncodeGameEventList, eventList, 1245);
	});

	test('Re-encode gameEventList', () => {
		assertReEncode(ParseGameEventList, EncodeGameEventList, getStream(data));
	});
});
