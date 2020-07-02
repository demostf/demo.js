"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Math_1 = require("../../Math");
function ParseClassInfo(stream) {
    const count = stream.readUint16();
    const create = stream.readBoolean();
    const entries = [];
    if (!create) {
        const bits = Math_1.logBase2(count) + 1;
        for (let i = 0; i < count; i++) {
            const entry = {
                classId: stream.readBits(bits),
                className: stream.readASCIIString(),
                dataTableName: stream.readASCIIString()
            };
            entries.push(entry);
        }
    }
    return {
        packetType: 'classInfo',
        number: count,
        create,
        entries
    };
}
exports.ParseClassInfo = ParseClassInfo;
function EncodeClassInfo(packet, stream) {
    stream.writeUint16(packet.number);
    stream.writeBoolean(packet.create);
    if (!packet.create) {
        const bits = Math_1.logBase2(packet.number) + 1;
        for (const entry of packet.entries) {
            stream.writeBits(entry.classId, bits);
            stream.writeASCIIString(entry.className);
            stream.writeASCIIString(entry.dataTableName);
        }
    }
}
exports.EncodeClassInfo = EncodeClassInfo;
//# sourceMappingURL=ClassInfo.js.map