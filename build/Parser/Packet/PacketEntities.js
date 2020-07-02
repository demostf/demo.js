"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketEntity_1 = require("../../Data/PacketEntity");
const ParserState_1 = require("../../Data/ParserState");
const EntityDecoder_1 = require("../EntityDecoder");
const readBitVar_1 = require("../readBitVar");
const pvsMap = new Map([
    [0, PacketEntity_1.PVS.PRESERVE],
    [2, PacketEntity_1.PVS.ENTER],
    [1, PacketEntity_1.PVS.LEAVE],
    [3, PacketEntity_1.PVS.LEAVE + PacketEntity_1.PVS.DELETE]
]);
const pvsReverseMap = new Map([
    [PacketEntity_1.PVS.PRESERVE, 0],
    [PacketEntity_1.PVS.ENTER, 2],
    [PacketEntity_1.PVS.LEAVE, 1],
    [PacketEntity_1.PVS.LEAVE + PacketEntity_1.PVS.DELETE, 3]
]);
function readPVSType(stream) {
    const pvs = stream.readBits(2);
    return pvsMap.get(pvs);
}
function writePVSType(pvs, stream) {
    const raw = pvsReverseMap.get(pvs);
    if (typeof raw === 'undefined') {
        throw new Error(`Unknown pvs ${pvs}`);
    }
    stream.writeBits(raw, 2);
}
function readEnterPVS(stream, entityId, state, baseLineIndex) {
    // https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs#L198
    const classBits = ParserState_1.getClassBits(state);
    const serverClass = state.serverClasses[stream.readBits(classBits)];
    const serial = stream.readBits(10); // unused serial number
    const sendTable = ParserState_1.getSendTable(state, serverClass.dataTable);
    const instanceBaseline = state.instanceBaselines[baseLineIndex].get(entityId);
    const entity = new PacketEntity_1.PacketEntity(serverClass, entityId, PacketEntity_1.PVS.ENTER);
    entity.serialNumber = serial;
    if (instanceBaseline) {
        entity.props = instanceBaseline.map((prop) => prop.clone());
        return entity;
    }
    else {
        const staticBaseLine = state.staticBaseLines.get(serverClass.id);
        if (staticBaseLine) {
            let parsedBaseLine = state.staticBaselineCache.get(serverClass.id);
            if (!parsedBaseLine) {
                staticBaseLine.index = 0;
                parsedBaseLine = EntityDecoder_1.getEntityUpdate(sendTable, staticBaseLine);
                state.staticBaselineCache.set(serverClass.id, parsedBaseLine);
            }
            entity.props = parsedBaseLine.map((prop) => prop.clone());
            // entity.applyPropUpdate(parsedBaseLine);
            // if (staticBaseLine.bitsLeft > 7) {
            // console.log(staticBaseLine.length, staticBaseLine.index);
            // throw new Error('Unexpected data left at the end of staticBaseline, ' + staticBaseLine.bitsLeft + ' bits left');
            // }
        }
        return entity;
    }
}
function writeEnterPVS(entity, stream, state, baseLineIndex) {
    const serverClassId = state.serverClasses.findIndex((existingServerClass) => existingServerClass && entity.serverClass.id === existingServerClass.id);
    if (serverClassId === -1) {
        throw new Error(`Unknown server class ${entity.serverClass.name}(${entity.serverClass.id})`);
    }
    // get the instance from the match, not the entity
    const serverClass = state.serverClasses[serverClassId];
    stream.writeBits(serverClassId, ParserState_1.getClassBits(state));
    stream.writeBits(entity.serialNumber || 0, 10);
    const sendTable = ParserState_1.getSendTable(state, serverClass.dataTable);
    let instanceBaseLine = state.instanceBaselines[baseLineIndex].get(entity.entityIndex);
    if (!instanceBaseLine) {
        const staticBaseLine = state.staticBaseLines.get(serverClass.id);
        if (staticBaseLine) {
            instanceBaseLine = state.staticBaselineCache.get(serverClass.id);
            if (!instanceBaseLine) {
                staticBaseLine.index = 0;
                instanceBaseLine = EntityDecoder_1.getEntityUpdate(sendTable, staticBaseLine);
                state.staticBaselineCache.set(serverClass.id, instanceBaseLine);
            }
        }
    }
    const propsToEncode = instanceBaseLine ? entity.diffFromBaseLine(instanceBaseLine) : entity.props;
    EntityDecoder_1.encodeEntityUpdate(propsToEncode, sendTable, stream);
}
function getPacketEntityForExisting(entityId, state, pvs) {
    const serverClass = state.entityClasses.get(entityId);
    if (!serverClass) {
        throw new Error(`"unknown entity ${entityId} for ${PacketEntity_1.PVS[pvs]}(${pvs})`);
    }
    return new PacketEntity_1.PacketEntity(serverClass, entityId, pvs);
}
function ParsePacketEntities(stream, state, skip = false) {
    // https://github.com/skadistats/smoke/blob/master/smoke/replay/handler/svc_packetentities.pyx
    // https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Handler/PacketEntitesHandler.cs
    // https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/DP/Entity.cs
    // https://github.com/PazerOP/DemoLib/blob/5f9467650f942a4a70f9ec689eadcd3e0a051956/TF2Net/NetMessages/NetPacketEntitiesMessage.cs
    const maxEntries = stream.readBits(11);
    const isDelta = stream.readBoolean();
    const delta = (isDelta) ? stream.readInt32() : 0;
    const baseLine = stream.readBits(1);
    const updatedEntries = stream.readBits(11);
    const length = stream.readBits(20);
    const updatedBaseLine = stream.readBoolean();
    const start = stream.index;
    const end = stream.index + length;
    let entityId = -1;
    const receivedEntities = [];
    const removedEntityIds = [];
    if (!skip) {
        if (updatedBaseLine) {
            state.instanceBaselines[1 - baseLine] = new Map(state.instanceBaselines[baseLine]);
            // state.instanceBaselines[baseLine] = new Map();
        }
        for (let i = 0; i < updatedEntries; i++) {
            const diff = readBitVar_1.readUBitVar(stream);
            entityId += 1 + diff;
            const pvs = readPVSType(stream);
            if (pvs === PacketEntity_1.PVS.ENTER) {
                const packetEntity = readEnterPVS(stream, entityId, state, baseLine);
                const sendTable = ParserState_1.getSendTable(state, packetEntity.serverClass.dataTable);
                const updatedProps = EntityDecoder_1.getEntityUpdate(sendTable, stream);
                packetEntity.applyPropUpdate(updatedProps);
                if (updatedBaseLine) {
                    state.instanceBaselines[1 - baseLine].set(entityId, packetEntity.clone().props);
                }
                packetEntity.inPVS = true;
                receivedEntities.push(packetEntity);
            }
            else if (pvs === PacketEntity_1.PVS.PRESERVE) {
                const packetEntity = getPacketEntityForExisting(entityId, state, pvs);
                const sendTable = state.sendTables.get(packetEntity.serverClass.dataTable);
                if (!sendTable) {
                    throw new Error(`Unknown sendTable ${packetEntity.serverClass.dataTable}`);
                }
                const updatedProps = EntityDecoder_1.getEntityUpdate(sendTable, stream);
                packetEntity.applyPropUpdate(updatedProps);
                receivedEntities.push(packetEntity);
            }
            else if (state.entityClasses.has(entityId)) {
                const packetEntity = getPacketEntityForExisting(entityId, state, pvs);
                receivedEntities.push(packetEntity);
            }
            else {
                // throw new Error(`No existing entity to update with id ${entityId}`);
            }
        }
        if (isDelta) {
            while (stream.readBoolean()) {
                removedEntityIds.push(stream.readBits(11));
            }
        }
    }
    stream.index = end;
    return {
        packetType: 'packetEntities',
        entities: receivedEntities,
        removedEntities: removedEntityIds,
        maxEntries,
        delta,
        baseLine,
        updatedBaseLine
    };
}
exports.ParsePacketEntities = ParsePacketEntities;
function EncodePacketEntities(packet, stream, state) {
    stream.writeBits(packet.maxEntries, 11);
    const isDelta = packet.delta > 0;
    stream.writeBoolean(isDelta);
    if (isDelta) {
        stream.writeInt32(packet.delta);
    }
    stream.writeBits(packet.baseLine, 1);
    stream.writeBits(packet.entities.length, 11);
    const lengthStart = stream.index;
    stream.index += 20;
    stream.writeBoolean(packet.updatedBaseLine);
    const packetDataStart = stream.index;
    let lastEntityId = -1;
    if (packet.updatedBaseLine) {
        state.instanceBaselines[1 - packet.baseLine] = new Map(state.instanceBaselines[packet.baseLine]);
        // state.instanceBaselines[baseLine] = new Map();
    }
    for (const entity of packet.entities) {
        const diff = entity.entityIndex - lastEntityId;
        lastEntityId = entity.entityIndex;
        readBitVar_1.writeBitVar(diff - 1, stream);
        writePVSType(entity.pvs, stream);
        if (entity.pvs === PacketEntity_1.PVS.ENTER) {
            if (packet.updatedBaseLine) {
                state.instanceBaselines[1 - packet.baseLine].set(entity.entityIndex, entity.clone().props);
            }
            writeEnterPVS(entity, stream, state, packet.baseLine);
        }
        else if (entity.pvs === PacketEntity_1.PVS.PRESERVE) {
            const sendTable = ParserState_1.getSendTable(state, entity.serverClass.dataTable);
            EntityDecoder_1.encodeEntityUpdate(entity.props, sendTable, stream);
        }
    }
    if (isDelta) {
        for (const removedEntity of packet.removedEntities) {
            stream.writeBoolean(true);
            stream.writeBits(removedEntity, 11);
        }
        stream.writeBoolean(false);
    }
    const packetDataEnd = stream.index;
    stream.index = lengthStart;
    stream.writeBits(packetDataEnd - packetDataStart, 20);
    stream.index = packetDataEnd;
}
exports.EncodePacketEntities = EncodePacketEntities;
//# sourceMappingURL=PacketEntities.js.map