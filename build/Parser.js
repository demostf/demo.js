"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Data/Message");
const Packet_1 = require("./Data/Packet");
const ParserState_1 = require("./Data/ParserState");
const Header_1 = require("./Parser/Header");
const ConsoleCmd_1 = require("./Parser/Message/ConsoleCmd");
const DataTable_1 = require("./Parser/Message/DataTable");
const Packet_2 = require("./Parser/Message/Packet");
const Stop_1 = require("./Parser/Message/Stop");
const StringTable_1 = require("./Parser/Message/StringTable");
const SyncTick_1 = require("./Parser/Message/SyncTick");
const UserCmd_1 = require("./Parser/Message/UserCmd");
exports.messageHandlers = new Map([
    [Message_1.MessageType.Sigon, Packet_2.PacketMessageHandler],
    [Message_1.MessageType.Packet, Packet_2.PacketMessageHandler],
    [Message_1.MessageType.ConsoleCmd, ConsoleCmd_1.ConsoleCmdHandler],
    [Message_1.MessageType.UserCmd, UserCmd_1.UserCmdHandler],
    [Message_1.MessageType.DataTables, DataTable_1.DataTableHandler],
    [Message_1.MessageType.StringTables, StringTable_1.StringTableHandler],
    [Message_1.MessageType.SyncTick, SyncTick_1.SyncTickHandler],
    [Message_1.MessageType.Stop, Stop_1.StopHandler]
]);
class Parser {
    constructor(stream, skipPackets = []) {
        this.header = null;
        this.lastMessage = -1;
        this.stream = stream;
        this.parserState = new ParserState_1.ParserState();
        if (this.getHeader().game === 'hl2mp') {
            // for hl2dm we always need packet entities for team info and never tempEntities since it crashes the parser
            this.parserState.skippedPackets = [Packet_1.PacketTypeId.tempEntities];
        }
        else {
            this.parserState.skippedPackets = skipPackets;
        }
    }
    getHeader() {
        if (!this.header) {
            this.header = Header_1.parseHeader(this.stream);
        }
        return this.header;
    }
    *getPackets() {
        // ensure that we are past the header
        this.getHeader();
        for (const message of this.iterateMessages()) {
            yield* this.handleMessage(message);
        }
    }
    *getMessages() {
        // ensure that we are past the header
        this.getHeader();
        for (const message of this.iterateMessages()) {
            for (const _ of this.handleMessage(message)) {
                // noop, loop needed to "drain" iterator
            }
            yield message;
        }
    }
    *iterateMessages() {
        while (true) {
            const message = this.readMessage(this.stream, this.parserState);
            yield message;
            if (message.type === Message_1.MessageType.Stop) {
                return;
            }
        }
    }
    *handleMessage(message) {
        this.parserState.handleMessage(message);
        if (message.type === Message_1.MessageType.Packet) {
            for (const packet of message.packets) {
                this.parserState.handlePacket(packet);
                yield packet;
            }
        }
    }
    readMessage(stream, state) {
        if (stream.bitsLeft < 8) {
            throw new Error('Stream ended without stop packet');
        }
        const type = stream.readUint8();
        if (type === 0) {
            return {
                type: Message_1.MessageType.Stop,
                rawData: stream.readBitStream(0)
            };
        }
        const handler = exports.messageHandlers.get(type);
        if (!handler) {
            throw new Error(`No handler for message of type ${Message_1.MessageType[type]}(${type}),
			last message: ${Message_1.MessageType[this.lastMessage]}(${this.lastMessage})`);
        }
        this.lastMessage = type;
        return handler.parseMessage(this.stream, state);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map