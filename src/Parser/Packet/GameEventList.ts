import {BitStream} from 'bit-buffer';
import {GameEventDefinitionMap, GameEventEntry} from '../../Data/GameEvent';
import {Match} from '../../Data/Match';
import {GameEventListPacket} from '../../Data/Packet';

export function ParseGameEventList(stream: BitStream, match: Match): GameEventListPacket { // 30: gameEventList
	// list of game events and parameters
	const numEvents                         = stream.readBits(9);
	const length                            = stream.readBits(20);
	const eventList: GameEventDefinitionMap = {};
	for (let i = 0; i < numEvents; i++) {
		const id                        = stream.readBits(9);
		const name                      = stream.readASCIIString();
		let type                        = stream.readBits(3);
		const entries: GameEventEntry[] = [];
		while (type !== 0) {
			entries.push({
				type,
				name: stream.readASCIIString(),
			});
			type = stream.readBits(3);
		}
		eventList[id] = {
			id,
			name,
			entries,
		};
	}
	return {
		packetType: 'gameEventList',
		eventList,
	};
}
