"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Match_1 = require("./Data/Match");
const Message_1 = require("./Data/Message");
class Analyser extends events_1.EventEmitter {
    constructor(parser) {
        super();
        this.analysed = false;
        this.parser = parser;
        this.match = new Match_1.Match(this.parser.parserState);
    }
    getHeader() {
        return this.parser.getHeader();
    }
    getBody() {
        if (!this.analysed) {
            for (const packet of this.getPackets()) {
                this.emit('packet', packet);
            }
            this.emit('done');
        }
        this.analysed = true;
        return this.match;
    }
    *getPackets() {
        for (const message of this.parser.getMessages()) {
            if (message.type === Message_1.MessageType.Packet) {
                for (const packet of message.packets) {
                    this.match.handlePacket(packet, message);
                    yield packet;
                }
            }
        }
    }
    *getMessages() {
        for (const message of this.parser.getMessages()) {
            if (message.type === Message_1.MessageType.Packet) {
                for (const packet of message.packets) {
                    this.match.handlePacket(packet, message);
                }
            }
            yield message;
        }
    }
}
exports.Analyser = Analyser;
//# sourceMappingURL=Analyser.js.map