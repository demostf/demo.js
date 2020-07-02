"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketEntity_1 = require("../Data/PacketEntity");
const BaseEntityHandler_1 = require("./BaseEntityHandler");
const HL2DMEntityHandler_1 = require("./HL2DMEntityHandler");
const TFEntityHandler_1 = require("./TFEntityHandler");
function handlePacketEntities(packet, match, message) {
    for (const entity of packet.entities) {
        BaseEntityHandler_1.handleBaseEntity(entity, match, message);
        switch (match.parserState.game) {
            case 'tf':
                TFEntityHandler_1.handleTFEntity(entity, match, message);
                break;
            case 'hl2mp':
                HL2DMEntityHandler_1.handleHL2DMEntity(entity, match, message);
                break;
        }
    }
}
exports.handlePacketEntities = handlePacketEntities;
function handlePacketEntitiesForState(packet, state) {
    for (const removedEntityId of packet.removedEntities) {
        state.entityClasses.delete(removedEntityId);
    }
    for (const entity of packet.entities) {
        saveEntity(entity, state);
    }
}
exports.handlePacketEntitiesForState = handlePacketEntitiesForState;
function saveEntity(packetEntity, state) {
    if (packetEntity.pvs === PacketEntity_1.PVS.DELETE) {
        state.entityClasses.delete(packetEntity.entityIndex);
    }
    state.entityClasses.set(packetEntity.entityIndex, packetEntity.serverClass);
}
//# sourceMappingURL=PacketEntities.js.map