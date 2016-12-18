export interface GameEventDefinition {
	id: number;
	name: string;
	entries: GameEventEntry[];
}

export interface GameEvent {
	name: string;
	values: GameEventValueMap;
}

export interface GameEventEntry {
	name: string;
	type: GameEventType;
}

export enum GameEventType {
	STRING = 1,
	FLOAT = 2,
	LONG = 3,
	SHORT = 4,
	BYTE = 5,
	BOOLEAN = 6,
	LOCAL = 7
}

export type GameEventValue = string|number|boolean;

export type GameEventValueMap = {
	[name: string]: GameEventValue;
}

export type GameEventDefinitionMap = {
	[id: number]: GameEventDefinition;
}
