"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleStringTable(packet, state) {
    handleTable(packet.table, state);
}
exports.handleStringTable = handleStringTable;
function handleStringTables(packet, state) {
    for (const table of packet.tables) {
        handleTable(table, state);
    }
}
exports.handleStringTables = handleStringTables;
function handleStringTableUpdate(packet, state) {
    const updatedTable = state.stringTables[packet.tableId];
    handleStringTableEntries(updatedTable.name, packet.entries, state);
}
exports.handleStringTableUpdate = handleStringTableUpdate;
function handleTable(table, state) {
    if (!state.getStringTable(table.name)) {
        state.stringTables.push(table);
    }
    handleStringTableEntries(table.name, table.entries, state);
}
exports.handleTable = handleTable;
function handleStringTableEntries(tableName, entries, state) {
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
function calculateUserInfoFromEntry(text, extraData, state) {
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
function saveInstanceBaseLine(entry, state) {
    if (entry.extraData) {
        const serverClassId = parseInt(entry.text, 10);
        state.staticBaselineCache.delete(serverClassId);
        state.staticBaseLines.set(serverClassId, entry.extraData);
    }
    else {
        throw new Error('Missing baseline');
    }
}
//# sourceMappingURL=StringTable.js.map