"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../Data/Message");
exports.StopHandler = {
    parseMessage: (stream) => {
        return {
            type: Message_1.MessageType.Stop,
            rawData: stream.readBitStream(0)
        };
    },
    encodeMessage: (message, stream) => {
        // noop
    }
};
//# sourceMappingURL=Stop.js.map