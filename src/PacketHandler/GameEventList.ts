import {GameEventDefinition} from '../Data/GameEvent';
import {GameEventType} from '../Data/GameEventTypes';
import {GameEventListPacket} from '../Data/Packet';
import {ParserState} from '../Data/ParserState';

export function handleGameEventList(packet: GameEventListPacket, state: ParserState) {
	state.eventDefinitions = packet.eventList;

	const entries: Array<[number, GameEventDefinition<GameEventType>]> = Array.from(packet.eventList.entries());
	const reversedEntries = entries.map(([type, definition]) => [definition.name, type]) as Array<[GameEventType, number]>;
	state.eventDefinitionTypes = new Map(reversedEntries);
}
