"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../Data/Message");
exports.StringTableHandler = {
    parseMessage: (stream) => {
        const tick = stream.readInt32();
        const length = stream.readInt32();
        const messageStream = stream.readBitStream(length * 8);
        // https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
        const tableCount = messageStream.readUint8();
        const tables = [];
        for (let i = 0; i < tableCount; i++) {
            const entries = [];
            const tableName = messageStream.readASCIIString();
            const entryCount = messageStream.readUint16();
            for (let j = 0; j < entryCount; j++) {
                const entry = readEntry(messageStream);
                entries.push(entry);
            }
            const table = {
                entries,
                name: tableName,
                maxEntries: entryCount,
                clientEntries: [],
                compressed: false
            };
            if (messageStream.readBoolean()) {
                const clientEntries = messageStream.readUint16();
                for (let j = 0; j < clientEntries; j++) {
                    const entry = readEntry(messageStream);
                    table.clientEntries.push(entry);
                }
            }
            tables.push(table);
        }
        return {
            type: Message_1.MessageType.StringTables,
            tick,
            rawData: messageStream,
            tables
        };
    },
    encodeMessage: (message, stream) => {
        stream.writeUint32(message.tick);
        const lengthStart = stream.index;
        stream.index += 32;
        const dataStart = stream.index;
        stream.writeUint8(message.tables.length);
        for (const table of message.tables) {
            stream.writeASCIIString(table.name);
            stream.writeUint16(table.entries.length);
            for (const entry of table.entries) {
                writeEntry(entry, stream);
            }
            if (table.clientEntries && table.clientEntries.length) {
                stream.writeBoolean(true);
                stream.writeUint16(table.clientEntries.length);
                for (const entry of table.clientEntries) {
                    writeEntry(entry, stream);
                }
            }
            else {
                stream.writeBoolean(false);
            }
        }
        const dataEnd = stream.index;
        stream.index = lengthStart;
        const byteLength = Math.ceil((dataEnd - dataStart) / 8);
        stream.writeUint32(byteLength);
        // align to byte;
        stream.index = dataStart + byteLength * 8;
    }
};
function readEntry(stream) {
    const entry = { text: stream.readUTF8String() };
    if (stream.readBoolean()) {
        const extraDataLength = stream.readUint16();
        entry.extraData = stream.readBitStream(extraDataLength * 8);
    }
    return entry;
}
function writeEntry(entry, stream) {
    stream.writeUTF8String(entry.text);
    if (entry.extraData) {
        stream.writeBoolean(true);
        stream.writeUint16(Math.ceil(entry.extraData.length / 8));
        entry.extraData.index = 0;
        stream.writeBitStream(entry.extraData, entry.extraData.length);
    }
    else {
        stream.writeBoolean(false);
    }
}
//# sourceMappingURL=StringTable.js.map