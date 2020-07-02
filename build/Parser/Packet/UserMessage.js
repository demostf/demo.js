"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserMessage_1 = require("../../Data/UserMessage");
const SayText2_1 = require("../UserMessage/SayText2");
const ParserGenerator_1 = require("./ParserGenerator");
function unknownPacketHandler(userMessageType) {
    return {
        parser: (data) => {
            return {
                packetType: 'userMessage',
                userMessageType,
                type: UserMessage_1.UserMessagePacketTypeMap.get(userMessageType),
                data
            };
        },
        encoder: (packet, data) => {
            packet.data.index = 0;
            data.writeBitStream(packet.data);
            packet.data.index = 0;
        },
        name: userMessageType
    };
}
const userMessageParsers = new Map([
    [UserMessage_1.UserMessageType.SayText2, { parser: SayText2_1.ParseSayText2, encoder: SayText2_1.EncodeSayText2, name: 'sayText2' }],
    [UserMessage_1.UserMessageType.TextMsg,
        ParserGenerator_1.make('textMsg', 'destType{8}text{s}substitute1{s}substitute2{s}substitute3{s}substitute4{s}', 'userMessageType', {
            packetType: 'userMessage'
        })],
    [UserMessage_1.UserMessageType.ResetHUD,
        ParserGenerator_1.make('resetHUD', 'data{8}', 'userMessageType', {
            packetType: 'userMessage'
        })],
    [UserMessage_1.UserMessageType.Train,
        ParserGenerator_1.make('train', 'data{8}', 'userMessageType', {
            packetType: 'userMessage'
        })],
    [UserMessage_1.UserMessageType.VoiceSubtitle,
        ParserGenerator_1.make('voiceSubtitle', 'client{8}menu{8}item{8}', 'userMessageType', {
            packetType: 'userMessage'
        })],
    [UserMessage_1.UserMessageType.BreakModel_Pumpkin, unknownPacketHandler('breakModelPumpkin')],
    [UserMessage_1.UserMessageType.Shake,
        ParserGenerator_1.make('shake', 'command{8}amplitude{f32}frequency{f32}duration{f32}', 'userMessageType', {
            packetType: 'userMessage'
        })]
]);
function ParseUserMessage(stream) {
    const type = stream.readUint8();
    const length = stream.readBits(11);
    const messageData = stream.readBitStream(length);
    const handler = userMessageParsers.get(type);
    if (!handler) {
        return {
            packetType: 'userMessage',
            userMessageType: 'unknownUserMessage',
            type,
            data: messageData
        };
    }
    else {
        return handler.parser(messageData);
    }
}
exports.ParseUserMessage = ParseUserMessage;
function EncodeUserMessage(packet, stream) {
    if (packet.userMessageType === 'unknownUserMessage') {
        stream.writeUint8(packet.type);
        stream.writeBits(packet.data.length, 11);
        packet.data.index = 0;
        stream.writeBitStream(packet.data);
        packet.data.index = 0;
    }
    else {
        const messageType = UserMessage_1.UserMessagePacketTypeMap.get(packet.userMessageType);
        if (!messageType) {
            throw new Error(`Unknown userMessage type ${messageType}`);
        }
        stream.writeUint8(messageType);
        const lengthStart = stream.index;
        stream.index += 11;
        const messageDataStart = stream.index;
        const handler = userMessageParsers.get(messageType);
        if (!handler) {
            throw new Error(`No encoder for userMessage ${packet.userMessageType}(${messageType})`);
        }
        handler.encoder(packet, stream);
        const messageDataEnd = stream.index;
        stream.index = lengthStart;
        stream.writeBits(messageDataEnd - messageDataStart, 11);
        stream.index = messageDataEnd;
    }
}
exports.EncodeUserMessage = EncodeUserMessage;
//# sourceMappingURL=UserMessage.js.map