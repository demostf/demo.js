"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ParseSetConVar(stream) {
    const count = stream.readUint8();
    const vars = new Map();
    for (let i = 0; i < count; i++) {
        const key = stream.readUTF8String();
        const value = stream.readUTF8String();
        vars.set(key, value);
    }
    return {
        packetType: 'setConVar',
        vars
    };
}
exports.ParseSetConVar = ParseSetConVar;
function EncodeSetConVar(packet, stream) {
    stream.writeUint8(packet.vars.size);
    for (const [key, value] of packet.vars.entries()) {
        stream.writeUTF8String(key);
        stream.writeUTF8String(value);
    }
}
exports.EncodeSetConVar = EncodeSetConVar;
//# sourceMappingURL=SetConVar.js.map