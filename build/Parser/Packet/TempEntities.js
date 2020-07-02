"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketEntity_1 = require("../../Data/PacketEntity");
const ParserState_1 = require("../../Data/ParserState");
const DynamicBitStream_1 = require("../../DynamicBitStream");
const EntityDecoder_1 = require("../EntityDecoder");
const readBitVar_1 = require("../readBitVar");
function ParseTempEntities(stream, state, skip = false) {
    const entityCount = stream.readUint8();
    const length = readBitVar_1.readVarInt(stream);
    const entityData = stream.readBitStream(length);
    let entity = null;
    const entities = [];
    if (!skip) {
        for (let i = 0; i < entityCount; i++) {
            const delay = (entityData.readBoolean()) ? entityData.readUint8() / 100 : 0; // unused it seems
            if (entityData.readBoolean()) {
                const classId = entityData.readBits(ParserState_1.getClassBits(state));
                // no clue why the -1 but it works
                const serverClass = state.serverClasses[classId - 1];
                if (!serverClass) {
                    throw new Error(`Unknown serverClass ${classId}`);
                }
                const sendTable = ParserState_1.getSendTable(state, serverClass.dataTable);
                entity = new PacketEntity_1.PacketEntity(serverClass, 0, PacketEntity_1.PVS.ENTER);
                entity.delay = delay;
                entity.props = EntityDecoder_1.getEntityUpdate(sendTable, entityData);
                entities.push(entity);
            }
            else {
                if (entity) {
                    const sendTable = ParserState_1.getSendTable(state, entity.serverClass.dataTable);
                    const updatedProps = EntityDecoder_1.getEntityUpdate(sendTable, entityData);
                    entity = entity.clone();
                    entity.applyPropUpdate(updatedProps);
                    entities.push(entity);
                }
                else {
                    throw new Error('no entity set to update');
                }
            }
        }
        if (entityData.bitsLeft > 8) {
            throw new Error(`unexpected content after TempEntities ${entityData.bitsLeft} bits`);
        }
    }
    return {
        packetType: 'tempEntities',
        entities
    };
}
exports.ParseTempEntities = ParseTempEntities;
function EncodeTempEntities(packet, stream, state) {
    stream.writeUint8(packet.entities.length);
    const entityStream = new DynamicBitStream_1.DynamicBitStream();
    for (const entity of packet.entities) {
        if (entity.delay) {
            entityStream.writeBoolean(true);
            entityStream.writeUint8(Math.round(entity.delay * 100));
        }
        else {
            entityStream.writeBoolean(false);
        }
        entityStream.writeBoolean(true);
        const classId = state.serverClasses.findIndex((serverClass) => serverClass && serverClass.name === entity.serverClass.name) + 1;
        entityStream.writeBits(classId, ParserState_1.getClassBits(state));
        const sendTable = ParserState_1.getSendTable(state, entity.serverClass.dataTable);
        EntityDecoder_1.encodeEntityUpdate(entity.props, sendTable, entityStream);
    }
    const entityDataLength = entityStream.index;
    entityStream.index = 0;
    readBitVar_1.writeVarInt(entityDataLength, stream);
    if (entityDataLength > 0) {
        stream.writeBitStream(entityStream, entityDataLength);
    }
}
exports.EncodeTempEntities = EncodeTempEntities;
//# sourceMappingURL=TempEntities.js.map