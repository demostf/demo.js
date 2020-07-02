"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bit_buffer_1 = require("bit-buffer");
const Math_1 = require("../../Math");
const readBitVar_1 = require("../readBitVar");
const snappyjs_1 = require("snappyjs");
const StringTableParser_1 = require("../StringTableParser");
function ParseCreateStringTable(stream) {
    const tableName = stream.readASCIIString();
    const maxEntries = stream.readUint16();
    const encodeBits = Math_1.logBase2(maxEntries);
    const entityCount = stream.readBits(encodeBits + 1);
    const bitCount = readBitVar_1.readVarInt(stream);
    let userDataSize = 0;
    let userDataSizeBits = 0;
    // userdata fixed size
    if (stream.readBoolean()) {
        userDataSize = stream.readBits(12);
        userDataSizeBits = stream.readBits(4);
    }
    const isCompressed = stream.readBoolean();
    let data = stream.readBitStream(bitCount);
    if (isCompressed) {
        const decompressedByteSize = data.readUint32();
        const compressedByteSize = data.readUint32();
        const magic = data.readASCIIString(4);
        const compressedData = data.readArrayBuffer(compressedByteSize - 4); // 4 magic bytes
        if (magic !== 'SNAP') {
            throw new Error('Unknown compressed stringtable format');
        }
        const decompressedData = snappyjs_1.uncompress(compressedData);
        if (decompressedData.byteLength !== decompressedByteSize) {
            throw new Error('Incorrect length of decompressed stringtable');
        }
        data = new bit_buffer_1.BitStream(decompressedData.buffer);
    }
    const table = {
        name: tableName,
        entries: [],
        maxEntries,
        fixedUserDataSize: userDataSize,
        fixedUserDataSizeBits: userDataSizeBits,
        compressed: isCompressed
    };
    // console.log(`${tableName} ${entityCount} ${bitCount}`);
    table.entries = StringTableParser_1.parseStringTableEntries(data, table, entityCount);
    return {
        packetType: 'createStringTable',
        table
    };
}
exports.ParseCreateStringTable = ParseCreateStringTable;
function EncodeCreateStringTable(packet, stream) {
    stream.writeASCIIString(packet.table.name);
    stream.writeUint16(packet.table.maxEntries);
    const encodeBits = Math_1.logBase2(packet.table.maxEntries);
    const numEntries = packet.table.entries.filter((entry) => entry).length;
    stream.writeBits(numEntries, encodeBits + 1);
    let entryData = new bit_buffer_1.BitStream(new ArrayBuffer(StringTableParser_1.guessStringTableEntryLength(packet.table, packet.table.entries)));
    StringTableParser_1.encodeStringTableEntries(entryData, packet.table, packet.table.entries);
    if (packet.table.compressed) {
        const decompressedByteLength = Math.ceil(entryData.length / 8);
        entryData.index = 0;
        const compressedData = snappyjs_1.compress(entryData.readArrayBuffer(decompressedByteLength));
        entryData = new bit_buffer_1.BitStream(new ArrayBuffer(decompressedByteLength));
        entryData.writeUint32(decompressedByteLength);
        entryData.writeUint32(compressedData.byteLength + 4); // 4 magic bytes
        entryData.writeASCIIString('SNAP', 4);
        const typeForce = compressedData.buffer;
        entryData.writeArrayBuffer(typeForce);
    }
    const entryLength = entryData.index;
    entryData.index = 0;
    readBitVar_1.writeVarInt(entryLength, stream);
    if (packet.table.fixedUserDataSize || packet.table.fixedUserDataSizeBits) {
        stream.writeBoolean(true);
        stream.writeBits(packet.table.fixedUserDataSize || 0, 12);
        stream.writeBits(packet.table.fixedUserDataSizeBits || 0, 4);
    }
    else {
        stream.writeBoolean(false);
    }
    stream.writeBoolean(packet.table.compressed);
    if (entryLength) {
        stream.writeBitStream(entryData, entryLength);
    }
}
exports.EncodeCreateStringTable = EncodeCreateStringTable;
//# sourceMappingURL=CreateStringTable.js.map