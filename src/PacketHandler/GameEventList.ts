import {GameEventListPacket} from '../Data/Packet';
import {ParserState} from '../Data/ParserState';

export function handleGameEventList(packet: GameEventListPacket, state: ParserState) {
	state.eventDefinitions = packet.eventList;
}
