"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    constructor(type, tick, stream, length, state, skippedPacket = []) {
        this.type = type;
        this.tick = tick;
        this.stream = stream;
        this.length = length; // length in bytes
        this.state = state;
        this.skippedPackets = skippedPacket;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map