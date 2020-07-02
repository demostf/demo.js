"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringTableParser_1 = require("../StringTableParser");
function ParseUpdateStringTable(stream, state) {
    const tableId = stream.readBits(5);
    const multipleChanged = stream.readBoolean();
    const changedEntries = multipleChanged ? stream.readUint16() : 1;
    const bitCount = stream.readBits(20);
    const data = stream.readBitStream(bitCount);
    data.index = 0;
    if (!state.stringTables[tableId]) {
        throw new Error(`Table not found for update: ${tableId}`);
    }
    const table = state.stringTables[tableId];
    const updatedEntries = StringTableParser_1.parseStringTableEntries(data, table, changedEntries, table.entries);
    return {
        packetType: 'updateStringTable',
        entries: updatedEntries,
        tableId
    };
}
exports.ParseUpdateStringTable = ParseUpdateStringTable;
function EncodeUpdateStringTable(packet, stream, state) {
    stream.writeBits(packet.tableId, 5);
    const changedEntryCount = packet.entries.filter((entry) => entry).length;
    const multipleChanged = changedEntryCount > 1;
    stream.writeBoolean(multipleChanged);
    if (multipleChanged) {
        stream.writeUint16(changedEntryCount);
    }
    if (!state.stringTables[packet.tableId]) {
        throw new Error(`Table not found for update: ${packet.tableId}`);
    }
    const lengthStart = stream.index;
    stream.index += 20;
    const lengthEnd = stream.index;
    const table = state.stringTables[packet.tableId];
    StringTableParser_1.encodeStringTableEntries(stream, table, packet.entries, table.entries);
    const dataEnd = stream.index;
    stream.index = lengthStart;
    const entryLength = dataEnd - lengthEnd;
    stream.writeBits(entryLength, 20);
    stream.index = dataEnd;
}
exports.EncodeUpdateStringTable = EncodeUpdateStringTable;
//# sourceMappingURL=UpdateStringTable.js.map