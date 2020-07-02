"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ParseVoiceData(stream) {
    const client = stream.readUint8();
    const proximity = stream.readUint8();
    const length = stream.readUint16();
    const data = stream.readBitStream(length);
    return {
        packetType: 'voiceData',
        client,
        proximity,
        length,
        data
    };
}
exports.ParseVoiceData = ParseVoiceData;
function EncodeVoiceData(packet, stream) {
    stream.writeUint8(packet.client);
    stream.writeUint8(packet.proximity);
    stream.writeUint16(packet.length);
    packet.data.index = 0;
    stream.writeBitStream(packet.data, packet.length);
    packet.data.index = 0;
}
exports.EncodeVoiceData = EncodeVoiceData;
//# sourceMappingURL=VoiceData.js.map