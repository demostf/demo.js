"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../Data/Message");
exports.SyncTickHandler = {
    parseMessage: (stream) => {
        const tick = stream.readInt32();
        return {
            type: Message_1.MessageType.SyncTick,
            tick,
            rawData: stream.readBitStream(0)
        };
    },
    encodeMessage: (message, stream) => {
        stream.writeUint32(message.tick);
    }
};
//# sourceMappingURL=SyncTick.js.map