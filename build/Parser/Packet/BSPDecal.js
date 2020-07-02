"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendPropEncoder_1 = require("../SendPropEncoder");
const SendPropParser_1 = require("../SendPropParser");
function getVecCoord(stream) {
    const hasX = stream.readBoolean();
    const hasY = stream.readBoolean();
    const hasZ = stream.readBoolean();
    return {
        x: hasX ? SendPropParser_1.SendPropParser.readBitCoord(stream) : 0,
        y: hasY ? SendPropParser_1.SendPropParser.readBitCoord(stream) : 0,
        z: hasZ ? SendPropParser_1.SendPropParser.readBitCoord(stream) : 0
    };
}
exports.getVecCoord = getVecCoord;
function encodeVecCoord(vector, stream) {
    stream.writeBoolean(vector.x !== 0);
    stream.writeBoolean(vector.y !== 0);
    stream.writeBoolean(vector.z !== 0);
    if (vector.x !== 0) {
        SendPropEncoder_1.SendPropEncoder.writeBitCoord(vector.x, stream);
    }
    if (vector.y !== 0) {
        SendPropEncoder_1.SendPropEncoder.writeBitCoord(vector.y, stream);
    }
    if (vector.z !== 0) {
        SendPropEncoder_1.SendPropEncoder.writeBitCoord(vector.z, stream);
    }
}
exports.encodeVecCoord = encodeVecCoord;
function ParseBSPDecal(stream) {
    let modelIndex = 0;
    let entIndex = 0;
    const position = getVecCoord(stream);
    const textureIndex = stream.readBits(9);
    if (stream.readBoolean()) {
        entIndex = stream.readBits(11);
        modelIndex = stream.readBits(12);
    }
    const lowPriority = stream.readBoolean();
    return {
        packetType: 'bspDecal',
        position,
        textureIndex,
        entIndex,
        modelIndex,
        lowPriority
    };
}
exports.ParseBSPDecal = ParseBSPDecal;
function EncodeBSPDecal(packet, stream) {
    encodeVecCoord(packet.position, stream);
    stream.writeBits(packet.textureIndex, 9);
    if (packet.entIndex || packet.modelIndex) {
        stream.writeBoolean(true);
        stream.writeBits(packet.entIndex, 11);
        stream.writeBits(packet.modelIndex, 12);
    }
    else {
        stream.writeBoolean(false);
    }
    stream.writeBoolean(packet.lowPriority);
}
exports.EncodeBSPDecal = EncodeBSPDecal;
//# sourceMappingURL=BSPDecal.js.map