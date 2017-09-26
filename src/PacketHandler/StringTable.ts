import {CreateStringTablePacket, StringTablePacket, UpdateStringTablePacket} from '../Data/Packet';
import {ParserState} from '../Data/ParserState';
import {StringTable, StringTableEntry} from '../Data/StringTable';

export function handleStringTable(packet: CreateStringTablePacket, state: ParserState) {
	handleTable(packet.table, state);
}

export function handleStringTables(packet: StringTablePacket, state: ParserState) {
	for (const table of packet.tables) {
		handleTable(table, state);
	}
}

export function handleStringTableUpdate(packet: UpdateStringTablePacket, state: ParserState) {
	const updatedTable = state.stringTables[packet.tableId];
	handleStringTableEntries(updatedTable.name, packet.entries, state);
}

export function handleTable(table: StringTable, state: ParserState) {
	if (!state.getStringTable(table.name)) {
		state.stringTables.push(table);
	}

	handleStringTableEntries(table.name, table.entries, state);
}

function handleStringTableEntries(tableName: string, entries: StringTableEntry[], state: ParserState) {
	if (tableName === 'userinfo') {
		for (const entry of entries) {
			if (entry && entry.extraData) {
				state.userInfoEntries.set(entry.text, entry.extraData);
			}
		}
	}
	if (tableName === 'instancebaseline') {
		for (const instanceBaseLine of entries) {
			if (instanceBaseLine) {
				saveInstanceBaseLine(instanceBaseLine, state);
			}
		}
	}
}

function saveInstanceBaseLine(entry: StringTableEntry, state: ParserState) {
	if (entry.extraData) {
		const serverClassId = parseInt(entry.text, 10);
		state.staticBaselineCache.delete(serverClassId);
		state.staticBaseLines.set(serverClassId, entry.extraData);
	} else {
		throw new Error('Missing baseline');
	}
}
