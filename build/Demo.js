"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bit_buffer_1 = require("bit-buffer");
const Analyser_1 = require("./Analyser");
const Packet_1 = require("./Data/Packet");
const Parser_1 = require("./Parser");
var ParseMode;
(function (ParseMode) {
    ParseMode[ParseMode["MINIMAL"] = 0] = "MINIMAL";
    ParseMode[ParseMode["ENTITIES"] = 1] = "ENTITIES";
    ParseMode[ParseMode["COMPLETE"] = 2] = "COMPLETE";
})(ParseMode = exports.ParseMode || (exports.ParseMode = {}));
class Demo {
    static fromNodeBuffer(nodeBuffer) {
        return new Demo(nodeBuffer.buffer);
    }
    constructor(arrayBuffer) {
        this.stream = new bit_buffer_1.BitStream(arrayBuffer);
    }
    getParser(mode = ParseMode.ENTITIES) {
        if (!this.parser) {
            this.parser = new Parser_1.Parser(this.stream, this.getSkippedPackets(mode));
        }
        return this.parser;
    }
    getAnalyser(mode = ParseMode.ENTITIES) {
        return new Analyser_1.Analyser(this.getParser(mode));
    }
    getSkippedPackets(mode) {
        switch (mode) {
            case ParseMode.MINIMAL:
                return [
                    Packet_1.PacketTypeId.packetEntities,
                    Packet_1.PacketTypeId.tempEntities,
                    Packet_1.PacketTypeId.entityMessage
                ];
            case ParseMode.ENTITIES:
                return [
                    Packet_1.PacketTypeId.tempEntities
                ];
            case ParseMode.COMPLETE:
                return [];
        }
    }
}
exports.Demo = Demo;
//# sourceMappingURL=Demo.js.map