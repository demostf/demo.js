"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ParseVoiceInit(stream) {
    const codec = stream.readASCIIString();
    const quality = stream.readUint8();
    // no clue, from 2017-2-14 update
    const extraData = readExtraData(stream, codec, quality);
    return {
        packetType: 'voiceInit',
        codec,
        quality,
        extraData
    };
}
exports.ParseVoiceInit = ParseVoiceInit;
function readExtraData(stream, codec, quality) {
    if (quality === 255) {
        return stream.readUint16();
    }
    else if (codec === 'vaudio_celt') {
        return 11025;
    }
    else {
        return 0;
    }
}
function EncodeVoiceInit(packet, stream) {
    stream.writeASCIIString(packet.codec);
    stream.writeUint8(packet.quality);
    if (packet.quality === 255) {
        stream.writeUint16(packet.extraData);
    }
}
exports.EncodeVoiceInit = EncodeVoiceInit;
//# sourceMappingURL=VoiceInit.js.map