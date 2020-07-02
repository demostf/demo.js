"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameEventList_1 = require("../PacketHandler/GameEventList");
const PacketEntities_1 = require("../PacketHandler/PacketEntities");
const StringTable_1 = require("../PacketHandler/StringTable");
const Message_1 = require("./Message");
class ParserState {
    constructor() {
        this.version = 0;
        this.staticBaseLines = new Map();
        this.staticBaselineCache = new Map();
        this.eventDefinitions = new Map();
        this.eventDefinitionTypes = new Map();
        this.entityClasses = new Map();
        this.sendTables = new Map();
        this.stringTables = [];
        this.serverClasses = [];
        this.instanceBaselines = [new Map(), new Map()];
        this.skippedPackets = [];
        this.userInfo = new Map();
        this.tick = 0;
    }
    handlePacket(packet) {
        switch (packet.packetType) {
            case 'netTick':
                this.tick = packet.tick;
                break;
            case 'serverInfo':
                this.version = packet.version;
                this.game = packet.game;
                break;
            case 'stringTable':
                StringTable_1.handleStringTables(packet, this);
                break;
            case 'createStringTable':
                StringTable_1.handleStringTable(packet, this);
                break;
            case 'updateStringTable':
                StringTable_1.handleStringTableUpdate(packet, this);
                break;
            case 'gameEventList':
                GameEventList_1.handleGameEventList(packet, this);
                break;
            case 'packetEntities':
                PacketEntities_1.handlePacketEntitiesForState(packet, this);
                break;
        }
    }
    handleMessage(message) {
        switch (message.type) {
            case Message_1.MessageType.DataTables:
                this.handleDataTableMessage(message);
                break;
            case Message_1.MessageType.StringTables:
                this.handleStringTableMessage(message);
                break;
        }
    }
    getStringTable(name) {
        const table = this.stringTables.find((stringTable) => stringTable.name === name);
        if (!table) {
            return null;
        }
        return table;
    }
    getUserEntityInfo(userId) {
        const info = this.userInfo.get(JSON.parse(JSON.stringify(userId)));
        if (info) {
            return info;
        }
        return {
            name: '',
            userId,
            steamId: '',
            entityId: 0
        };
    }
    handleDataTableMessage(message) {
        for (const table of message.tables) {
            this.sendTables.set(table.name, table);
        }
        this.serverClasses = message.serverClasses;
    }
    handleStringTableMessage(message) {
        for (const table of message.tables) {
            StringTable_1.handleTable(table, this);
        }
    }
}
exports.ParserState = ParserState;
function getClassBits(state) {
    return Math.ceil(Math.log(state.serverClasses.length) * Math.LOG2E);
}
exports.getClassBits = getClassBits;
function getSendTable(state, dataTable) {
    const sendTable = state.sendTables.get(dataTable);
    if (!sendTable) {
        throw new Error(`Unknown sendTable ${dataTable}`);
    }
    return sendTable;
}
exports.getSendTable = getSendTable;
function createParserState() {
    return new ParserState();
}
exports.createParserState = createParserState;
//# sourceMappingURL=ParserState.js.map