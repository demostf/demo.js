"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_encoding_shim_1 = require("text-encoding-shim");
const Message_1 = require("../../Data/Message");
const Parser_1 = require("./Parser");
class ConsoleCmd extends Parser_1.Parser {
    parse() {
        return [{
                packetType: 'consoleCmd',
                command: this.stream.readUTF8String()
            }];
    }
}
exports.ConsoleCmd = ConsoleCmd;
exports.ConsoleCmdHandler = {
    parseMessage: (stream) => {
        const tick = stream.readInt32();
        const length = stream.readInt32();
        const messageStream = stream.readBitStream(length * 8);
        return {
            type: Message_1.MessageType.ConsoleCmd,
            tick,
            rawData: messageStream,
            command: messageStream.readUTF8String()
        };
    },
    encodeMessage: (message, stream) => {
        stream.writeUint32(message.tick);
        const byteLength = (new text_encoding_shim_1.TextEncoder('utf-8').encode(message.command)).length + 1; // +1 for null termination
        stream.writeUint32(byteLength);
        stream.writeUTF8String(message.command);
    }
};
//# sourceMappingURL=ConsoleCmd.js.map