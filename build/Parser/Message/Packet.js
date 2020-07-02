"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BSPDecal_1 = require("../Packet/BSPDecal");
const ClassInfo_1 = require("../Packet/ClassInfo");
const CreateStringTable_1 = require("../Packet/CreateStringTable");
const GameEvent_1 = require("../Packet/GameEvent");
const GameEventList_1 = require("../Packet/GameEventList");
const PacketEntities_1 = require("../Packet/PacketEntities");
const ParserGenerator_1 = require("../Packet/ParserGenerator");
const ParseSounds_1 = require("../Packet/ParseSounds");
const SetConVar_1 = require("../Packet/SetConVar");
const TempEntities_1 = require("../Packet/TempEntities");
const UpdateStringTable_1 = require("../Packet/UpdateStringTable");
const UserMessage_1 = require("../Packet/UserMessage");
const VoiceData_1 = require("../Packet/VoiceData");
const VoiceInit_1 = require("../Packet/VoiceInit");
const Message_1 = require("../../Data/Message");
const Packet_1 = require("../../Data/Packet");
const Vector_1 = require("../../Data/Vector");
const handlers = new Map([
    [Packet_1.PacketTypeId.file,
        ParserGenerator_1.make('file', 'transferId{32}fileName{s}requested{b}')],
    [Packet_1.PacketTypeId.netTick,
        ParserGenerator_1.make('netTick', 'tick{32}frameTime{16}stdDev{16}')],
    [Packet_1.PacketTypeId.stringCmd,
        ParserGenerator_1.make('stringCmd', 'command{s}')],
    [Packet_1.PacketTypeId.setConVar,
        { parser: SetConVar_1.ParseSetConVar, encoder: SetConVar_1.EncodeSetConVar }],
    [Packet_1.PacketTypeId.sigOnState,
        ParserGenerator_1.make('sigOnState', 'state{8}count{32}')],
    [Packet_1.PacketTypeId.print,
        ParserGenerator_1.make('print', 'value{s}')],
    [Packet_1.PacketTypeId.serverInfo,
        ParserGenerator_1.make('serverInfo', 'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
            'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
            'game{s}map{s}skybox{s}serverName{s}replay{b}')],
    [Packet_1.PacketTypeId.classInfo,
        { parser: ClassInfo_1.ParseClassInfo, encoder: ClassInfo_1.EncodeClassInfo }],
    [Packet_1.PacketTypeId.setPause,
        ParserGenerator_1.make('setPause', 'paused{b}')],
    [Packet_1.PacketTypeId.createStringTable,
        { parser: CreateStringTable_1.ParseCreateStringTable, encoder: CreateStringTable_1.EncodeCreateStringTable }],
    [Packet_1.PacketTypeId.updateStringTable,
        { parser: UpdateStringTable_1.ParseUpdateStringTable, encoder: UpdateStringTable_1.EncodeUpdateStringTable }],
    [Packet_1.PacketTypeId.voiceInit,
        { parser: VoiceInit_1.ParseVoiceInit, encoder: VoiceInit_1.EncodeVoiceInit }],
    [Packet_1.PacketTypeId.voiceData,
        { parser: VoiceData_1.ParseVoiceData, encoder: VoiceData_1.EncodeVoiceData }],
    [Packet_1.PacketTypeId.parseSounds,
        { parser: ParseSounds_1.ParseParseSounds, encoder: ParseSounds_1.EncodeParseSounds }],
    [Packet_1.PacketTypeId.setView,
        ParserGenerator_1.make('setView', 'index{11}')],
    [Packet_1.PacketTypeId.fixAngle,
        ParserGenerator_1.make('fixAngle', 'relative{b}x{16}y{16}z{16}')],
    [Packet_1.PacketTypeId.bspDecal,
        { parser: BSPDecal_1.ParseBSPDecal, encoder: BSPDecal_1.EncodeBSPDecal }],
    [Packet_1.PacketTypeId.userMessage,
        { parser: UserMessage_1.ParseUserMessage, encoder: UserMessage_1.EncodeUserMessage }],
    [Packet_1.PacketTypeId.entityMessage,
        ParserGenerator_1.make('entityMessage', 'index{11}classId{9}length{11}data{$length}')],
    [Packet_1.PacketTypeId.gameEvent,
        { parser: GameEvent_1.ParseGameEvent, encoder: GameEvent_1.EncodeGameEvent }],
    [Packet_1.PacketTypeId.packetEntities,
        { parser: PacketEntities_1.ParsePacketEntities, encoder: PacketEntities_1.EncodePacketEntities }],
    [Packet_1.PacketTypeId.tempEntities,
        { parser: TempEntities_1.ParseTempEntities, encoder: TempEntities_1.EncodeTempEntities }],
    [Packet_1.PacketTypeId.preFetch,
        ParserGenerator_1.make('preFetch', 'index{14}')],
    [Packet_1.PacketTypeId.menu,
        ParserGenerator_1.make('menu', 'type{u16}length{u16}data{$length*8}')],
    [Packet_1.PacketTypeId.gameEventList,
        { parser: GameEventList_1.ParseGameEventList, encoder: GameEventList_1.EncodeGameEventList }],
    [Packet_1.PacketTypeId.getCvarValue,
        ParserGenerator_1.make('getCvarValue', 'cookie{32}value{s}')],
    [Packet_1.PacketTypeId.cmdKeyValues,
        ParserGenerator_1.make('cmdKeyValues', 'length{32}data{$length}')]
]);
exports.PacketMessageHandler = {
    parseMessage: (stream, state) => {
        const tick = stream.readInt32();
        const flags = stream.readInt32();
        const viewOrigin = [new Vector_1.Vector(0, 0, 0), new Vector_1.Vector(0, 0, 0)];
        const viewAngles = [new Vector_1.Vector(0, 0, 0), new Vector_1.Vector(0, 0, 0)];
        const localViewAngles = [new Vector_1.Vector(0, 0, 0), new Vector_1.Vector(0, 0, 0)];
        for (let j = 0; j < 2; j++) {
            viewOrigin[j] = new Vector_1.Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
            viewAngles[j] = new Vector_1.Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
            localViewAngles[j] = new Vector_1.Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
        }
        const sequenceIn = stream.readInt32();
        const sequenceOut = stream.readInt32();
        const length = stream.readInt32();
        const messageStream = stream.readBitStream(length * 8);
        const packets = [];
        let lastPacketType = 0;
        while (messageStream.bitsLeft > 6) { // last 6 bits for NOOP
            const type = messageStream.readBits(6);
            if (type !== 0) {
                const handler = handlers.get(type);
                if (handler) {
                    const skip = state.skippedPackets.indexOf(type) !== -1;
                    const packet = handler.parser(messageStream, state, skip);
                    packets.push(packet);
                }
                else {
                    throw new Error(`Unknown packet type ${type} just parsed a ${Packet_1.PacketTypeId[lastPacketType]}`);
                }
                lastPacketType = type;
            }
        }
        return {
            type: Message_1.MessageType.Packet,
            tick,
            rawData: messageStream,
            packets,
            flags,
            viewOrigin,
            viewAngles,
            localViewAngles,
            sequenceIn,
            sequenceOut
        };
    },
    encodeMessage: (message, stream, state) => {
        stream.writeUint32(message.tick);
        stream.writeUint32(message.flags);
        for (let j = 0; j < 2; j++) {
            stream.writeFloat32(message.viewOrigin[j].x);
            stream.writeFloat32(message.viewOrigin[j].y);
            stream.writeFloat32(message.viewOrigin[j].z);
            stream.writeFloat32(message.viewAngles[j].x);
            stream.writeFloat32(message.viewAngles[j].y);
            stream.writeFloat32(message.viewAngles[j].z);
            stream.writeFloat32(message.localViewAngles[j].x);
            stream.writeFloat32(message.localViewAngles[j].y);
            stream.writeFloat32(message.localViewAngles[j].z);
        }
        stream.writeUint32(message.sequenceIn);
        stream.writeUint32(message.sequenceOut);
        const lengthStart = stream.index;
        stream.index += 32;
        const dataStart = stream.index;
        for (const packet of message.packets) {
            const type = Packet_1.PacketTypeId[packet.packetType];
            stream.writeBits(type, 6);
            const handler = handlers.get(type);
            if (handler) {
                handler.encoder(packet, stream, state);
            }
            else {
                throw new Error(`No handler for packet type ${packet.packetType}`);
            }
        }
        stream.writeBits(0, 6);
        const dataEnd = stream.index;
        stream.index = lengthStart;
        const byteLength = Math.ceil((dataEnd - dataStart) / 8);
        stream.writeUint32(byteLength);
        // align to byte;
        stream.index = dataStart + byteLength * 8;
    }
};
//# sourceMappingURL=Packet.js.map