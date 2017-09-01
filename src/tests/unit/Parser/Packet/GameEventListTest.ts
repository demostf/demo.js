import {BitStream} from 'bit-buffer';
import {assertEncoder, assertParser, getStream} from './PacketTest';
import {readFileSync} from 'fs';
import {EncodeGameEventList, ParseGameEventList} from '../../../../Parser/Packet/GameEventList';

const data = JSON.parse(readFileSync(__dirname + '/../../../data/gameEventListData.json', 'utf8'));
const expected = JSON.parse(readFileSync(__dirname + '/../../../data/gameEventList.json', 'utf8'));

const eventList = {
	'packetType': 'gameEventList',
	'eventList': {
		'0': {
			'id': 0,
			'name': 'server_spawn',
			'entries': [
				{
					'type': 1,
					'name': 'hostname'
				},
				{
					'type': 1,
					'name': 'address'
				},
				{
					'type': 3,
					'name': 'ip'
				},
				{
					'type': 4,
					'name': 'port'
				},
				{
					'type': 1,
					'name': 'game'
				},
				{
					'type': 1,
					'name': 'mapname'
				},
				{
					'type': 3,
					'name': 'maxplayers'
				},
				{
					'type': 1,
					'name': 'os'
				},
				{
					'type': 6,
					'name': 'dedicated'
				},
				{
					'type': 6,
					'name': 'password'
				}
			]
		},
		'1': {
			'id': 1,
			'name': 'server_changelevel_failed',
			'entries': [
				{
					'type': 1,
					'name': 'levelname'
				}
			]
		},
		'2': {
			'id': 2,
			'name': 'server_shutdown',
			'entries': [
				{
					'type': 1,
					'name': 'reason'
				}
			]
		}
	}
};

suite('GameEventList', () => {
	test('Parse gameEventList', () => {
		assertParser(ParseGameEventList, getStream(data), expected, 122783);
	});

	test('Encode gameEventList', () => {
		assertEncoder(ParseGameEventList, EncodeGameEventList, eventList, 1245);
	});
});
