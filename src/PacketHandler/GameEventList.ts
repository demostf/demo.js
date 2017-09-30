import {GameEventListPacket} from '../Data/Packet';
import {ParserState} from '../Data/ParserState';
import {GameEventType} from '../Data/GameEventTypes';
import {GameEventDefinition} from '../Data/GameEvent';

export function handleGameEventList(packet: GameEventListPacket, state: ParserState) {
	state.eventDefinitions = packet.eventList;

	const entries: ([number, GameEventDefinition<GameEventType>])[] = Array.from(packet.eventList.entries());
	const reversedEntries = entries.map(([type, definition]) => [definition.name, type]) as [GameEventType, number][];
	state.eventDefinitionTypes = new Map(reversedEntries);
}
