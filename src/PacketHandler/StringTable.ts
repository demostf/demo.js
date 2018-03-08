import {BitStream} from 'bit-buffer';
import {CreateStringTablePacket, StringTablePacket, UpdateStringTablePacket} from '../Data/Packet';
import {ParserState} from '../Data/ParserState';
import {StringTable, StringTableEntry} from '../Data/StringTable';
import {UserEntityInfo, UserInfo} from '../Data/UserInfo';

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
				calculateUserInfoFromEntry(entry.text, entry.extraData, state);
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

function calculateUserInfoFromEntry(text: string, extraData: BitStream, state: ParserState) {
	if (extraData.bitsLeft > (32 * 8)) {
		const name = extraData.readUTF8String(32);
		let userId = extraData.readUint32();
		while (userId > 256) {
			userId -= 256;
		}
		const steamId = extraData.readUTF8String();
		if (steamId) {
			const entityId = parseInt(text, 10) + 1;
			let userState = state.userInfo.get(userId);

			if (!userState) {
				userState = {
					name: '',
					userId,
					steamId: '',
					entityId
				};

				state.userInfo.set(userState.userId, userState);
			}

			userState.name = name;
			userState.steamId = steamId;
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
