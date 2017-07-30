import {Match} from '../Data/Match';
import {GameEventListPacket} from '../Data/Packet';

export function handleGameEventList(packet: GameEventListPacket, match: Match) {
	match.eventDefinitions = packet.eventList;
}
