"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Data/Message");
const Encoder_1 = require("./Encoder");
const Parser_1 = require("./Parser");
function nullTransform(input) {
    return input;
}
exports.nullTransform = nullTransform;
class Transformer extends Parser_1.Parser {
    constructor(sourceStream, targetStream) {
        super(sourceStream);
        this.encoder = new Encoder_1.Encoder(targetStream);
    }
    transform(packetTransform, messageTransform) {
        this.encoder.encodeHeader(this.getHeader());
        for (const message of this.iterateMessages()) {
            this.parserState.handleMessage(message);
            if (message.type === Message_1.MessageType.Packet) {
                for (const packet of message.packets) {
                    this.parserState.handlePacket(packet);
                }
                message.packets = message.packets.map(packetTransform);
            }
            this.encoder.writeMessage(messageTransform(message));
        }
    }
}
exports.Transformer = Transformer;
//# sourceMappingURL=Transformer.js.map