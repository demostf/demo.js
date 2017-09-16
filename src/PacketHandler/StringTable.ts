import {Match} from '../Data/Match';
import {CreateStringTablePacket, StringTablePacket, UpdateStringTablePacket} from '../Data/Packet';
import {StringTable, StringTableEntry} from '../Data/StringTable';
import {getStringTable} from '../Data/ParserState';

export function handleStringTable(packet: CreateStringTablePacket, match: Match) {
	handleTable(packet.table, match);
}

export function handleStringTables(packet: StringTablePacket, match: Match) {
	for (const table of packet.tables) {
		handleTable(table, match);
	}
}

export function handleStringTableUpdate(packet: UpdateStringTablePacket, match: Match) {
	const updatedTable = match.stringTables[packet.tableId];
	handleStringTableEntries(updatedTable.name, packet.entries, match);
}


function handleTable(table: StringTable, match: Match) {
	if (!getStringTable(match, table.name)) {
		match.stringTables.push(table);
	}

	handleStringTableEntries(table.name, table.entries, match);
}

function handleStringTableEntries(tableName: string, entries: StringTableEntry[], match: Match) {
	if (tableName === 'userinfo') {
		for (const userData of entries) {
			saveUserData(userData, match);
		}
	}
	if (tableName === 'instancebaseline') {
		for (const instanceBaseLine of entries) {
			if (instanceBaseLine) {
				saveInstanceBaseLine(instanceBaseLine, match);
			}
		}
	}
}

function saveUserData(userData: StringTableEntry, match: Match) {
	if (userData && userData.extraData) {
		if (userData.extraData.bitsLeft > (32 * 8)) {
			const name = userData.extraData.readUTF8String(32);
			const userId = userData.extraData.readUint32();
			const steamId = userData.extraData.readUTF8String();
			if (steamId) {
				const userState = match.getUserInfo(userId);
				userState.name = name;
				userState.steamId = steamId;
				userState.entityId = parseInt(userData.text, 10) + 1;
			}
		}
	}
}

function saveInstanceBaseLine(entry: StringTableEntry, match: Match) {
	if (entry.extraData) {
		const serverClassId = parseInt(entry.text, 10);
		match.staticBaselineCache.delete(serverClassId);
		match.staticBaseLines.set(serverClassId, entry.extraData);
	} else {
		throw new Error('Missing baseline');
	}
}
