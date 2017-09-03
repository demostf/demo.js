import {GameEventType} from './GameEventTypes';

export interface GameEventDefinition<T extends GameEventType> {
	id: number;
	name: T;
	entries: GameEventEntry[];
}

export interface GameEventEntry {
	name: string;
	type: GameEventValueType;
}

export enum GameEventValueType {
	STRING = 1,
	FLOAT = 2,
	LONG = 3,
	SHORT = 4,
	BYTE = 5,
	BOOLEAN = 6,
	LOCAL = 7,
}

export type GameEventValue = string | number | boolean;

export interface GameEventValues {
	[name: string]: GameEventValue;
}
