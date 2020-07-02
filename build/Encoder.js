"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Data/Message");
const ParserState_1 = require("./Data/ParserState");
const Parser_1 = require("./Parser");
const Header_1 = require("./Parser/Header");
class Encoder {
    constructor(stream) {
        this.stream = stream;
        this.parserState = new ParserState_1.ParserState();
    }
    encodeHeader(header) {
        Header_1.encodeHeader(header, this.stream);
    }
    writeMessage(message) {
        this.stream.writeUint8(message.type);
        const handler = Parser_1.messageHandlers.get(message.type);
        if (!handler) {
            throw new Error(`No handler for message of type ${Message_1.MessageType[message.type]}`);
        }
        handler.encodeMessage(message, this.stream, this.parserState);
        this.handleMessage(message);
    }
    handleMessage(message) {
        this.parserState.handleMessage(message);
        if (message.type === Message_1.MessageType.Packet) {
            for (const packet of message.packets) {
                this.parserState.handlePacket(packet);
            }
        }
    }
}
exports.Encoder = Encoder;
//# sourceMappingURL=Encoder.js.map