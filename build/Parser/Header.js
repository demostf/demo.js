"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseHeader(stream) {
    return {
        type: stream.readASCIIString(8),
        version: stream.readInt32(),
        protocol: stream.readInt32(),
        server: stream.readASCIIString(260),
        nick: stream.readASCIIString(260),
        map: stream.readASCIIString(260),
        game: stream.readASCIIString(260),
        duration: stream.readFloat32(),
        ticks: stream.readInt32(),
        frames: stream.readInt32(),
        sigon: stream.readInt32()
    };
}
exports.parseHeader = parseHeader;
function encodeHeader(header, stream) {
    stream.writeASCIIString(header.type, 8);
    stream.writeUint32(header.version);
    stream.writeUint32(header.protocol);
    stream.writeASCIIString(header.server, 260);
    stream.writeASCIIString(header.nick, 260);
    stream.writeASCIIString(header.map, 260);
    stream.writeASCIIString(header.game, 260);
    stream.writeFloat32(header.duration);
    stream.writeUint32(header.ticks);
    stream.writeUint32(header.frames);
    stream.writeUint32(header.sigon);
}
exports.encodeHeader = encodeHeader;
//# sourceMappingURL=Header.js.map