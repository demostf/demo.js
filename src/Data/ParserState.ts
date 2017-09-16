import {BitStream} from 'bit-buffer';
import {GameEventDefinition} from './GameEvent';
import {EntityId, PacketEntity} from './PacketEntity';
import {SendTable, SendTableName} from './SendTable';
import {ServerClass, ServerClassId} from './ServerClass';
import {StringTable} from './StringTable';
import {GameEventType} from './GameEventTypes';
import {SendProp} from './SendProp';

export interface ParserState {
	staticBaseLines: Map<ServerClassId, BitStream>;
	staticBaselineCache: Map<ServerClassId, SendProp[]>;
	eventDefinitions: Map<number, GameEventDefinition<GameEventType>>;
	entityClasses: Map<EntityId, ServerClass>;
	sendTables: Map<SendTableName, SendTable>;
	version: number;
	stringTables: StringTable[];
	serverClasses: ServerClass[];
	instanceBaselines: [Map<EntityId, SendProp[]>, Map<EntityId, SendProp[]>];
}

export function getClassBits(state: ParserState) {
	return Math.ceil(Math.log(state.serverClasses.length) * Math.LOG2E);
}

export function getSendTable(state: ParserState, dataTable: string): SendTable {
	const sendTable = state.sendTables.get(dataTable);
	if (!sendTable) {
		throw new Error(`Unknown sendTable ${dataTable}`);
	}
	return sendTable;
}

export function createParserState(): ParserState {
	return {
		staticBaseLines: new Map(),
		staticBaselineCache: new Map(),
		eventDefinitions: new Map(),
		entityClasses: new Map(),
		sendTables: new Map(),
		version: 0,
		stringTables: [],
		serverClasses: [],
		instanceBaselines: [new Map(), new Map()]
	};
}

export function getStringTable(state: ParserState, name: string) {
	for (const table of state.stringTables) {
		if (table.name === name) {
			return table;
		}
	}
	return null;
}
