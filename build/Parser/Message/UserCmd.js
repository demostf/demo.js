"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../Data/Message");
exports.UserCmdHandler = {
    parseMessage: (stream) => {
        const tick = stream.readInt32();
        const sequenceOut = stream.readInt32();
        const length = stream.readInt32();
        const messageStream = stream.readBitStream(length * 8);
        return {
            type: Message_1.MessageType.UserCmd,
            tick,
            rawData: messageStream,
            sequenceOut
        };
    },
    encodeMessage: (message, stream) => {
        throw new Error('not implemented');
    }
};
//# sourceMappingURL=UserCmd.js.map