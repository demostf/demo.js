export interface GameEventDefinition {
	id: number;
	name: string;
	entries: GameEventEntry[];
}

export interface GameEvent {
	name: string;
	values: GameEventValues;
}

export interface GameEventEntry {
	name: string;
	type: GameEventType;
}

export enum GameEventType {
	STRING  = 1,
	FLOAT   = 2,
	LONG    = 3,
	SHORT   = 4,
	BYTE    = 5,
	BOOLEAN = 6,
	LOCAL   = 7
}

export interface DeathEventValues {
	attacker: number;
	userid: number;
	assister: number;
	weapon: string;
}

export interface RoundWinEventValues {
	winreason: number;
	team: number;
	round_time: number;
}

export interface PlayerSpawnEventValues {
	userid: number;
	team: number;
	'class': number
}

export interface ObjectDestroyedValues {
	userid: number;
	attacker: number;
	weapon: string;
	weapinid: number;
	objecttype: number;
	index: number;
}

export type GameEventValue = string|number|boolean;

export type GameEventValueMap = {
	[name: string]: GameEventValue;
}

export type GameEventValues = GameEventValueMap |
	DeathEventValues |
	RoundWinEventValues |
	PlayerSpawnEventValues |
	ObjectDestroyedValues;

export type GameEventDefinitionMap = {
	[id: number]: GameEventDefinition;
}
