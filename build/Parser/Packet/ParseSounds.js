"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ParseParseSounds(stream) {
    const reliable = stream.readBoolean();
    const num = (reliable) ? 1 : stream.readUint8();
    const length = (reliable) ? stream.readUint8() : stream.readUint16();
    const data = stream.readBitStream(length);
    return {
        packetType: 'parseSounds',
        reliable,
        num,
        length,
        data
    };
}
exports.ParseParseSounds = ParseParseSounds;
function EncodeParseSounds(packet, stream) {
    stream.writeBoolean(packet.reliable);
    if (packet.reliable) {
        stream.writeUint8(packet.length);
    }
    else {
        stream.writeUint8(packet.num);
        stream.writeUint16(packet.length);
    }
    packet.data.index = 0;
    stream.writeBitStream(packet.data, packet.length);
    packet.data.index = 0;
}
exports.EncodeParseSounds = EncodeParseSounds;
//# sourceMappingURL=ParseSounds.js.map