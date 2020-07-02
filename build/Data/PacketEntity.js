"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendProp_1 = require("./SendProp");
var PVS;
(function (PVS) {
    PVS[PVS["PRESERVE"] = 0] = "PRESERVE";
    PVS[PVS["ENTER"] = 1] = "ENTER";
    PVS[PVS["LEAVE"] = 2] = "LEAVE";
    PVS[PVS["DELETE"] = 4] = "DELETE";
})(PVS = exports.PVS || (exports.PVS = {}));
class PacketEntity {
    static getPropByFullName(props, fullName) {
        for (const prop of props) {
            if (prop.definition.fullName === fullName) {
                return prop;
            }
        }
        return null;
    }
    constructor(serverClass, entityIndex, pvs) {
        this.serverClass = serverClass;
        this.entityIndex = entityIndex;
        this.props = [];
        this.inPVS = false;
        this.pvs = pvs;
    }
    getPropByDefinition(definition) {
        return PacketEntity.getPropByFullName(this.props, definition.fullName);
    }
    getProperty(originTable, name) {
        const prop = PacketEntity.getPropByFullName(this.props, `${originTable}.${name}`);
        if (prop) {
            return prop;
        }
        throw new Error(`Property not found in entity (${originTable}.${name})`);
    }
    hasProperty(originTable, name) {
        return PacketEntity.getPropByFullName(this.props, `${originTable}.${name}`) !== null;
    }
    clone() {
        const result = new PacketEntity(this.serverClass, this.entityIndex, this.pvs);
        for (const prop of this.props) {
            result.props.push(prop.clone());
        }
        if (this.serialNumber) {
            result.serialNumber = this.serialNumber;
        }
        if (typeof this.delay !== 'undefined') {
            result.delay = this.delay;
        }
        result.inPVS = this.inPVS;
        return result;
    }
    applyPropUpdate(props) {
        for (const prop of props) {
            const existingProp = this.getPropByDefinition(prop.definition);
            if (existingProp) {
                existingProp.value = prop.value;
            }
            else {
                this.props.push(prop.clone());
            }
        }
    }
    diffFromBaseLine(baselineProps) {
        return this.props.filter((prop) => {
            const baseProp = PacketEntity.getPropByFullName(baselineProps, prop.definition.fullName);
            return (!baseProp || !SendProp_1.SendProp.areEqual(prop, baseProp));
        });
    }
    getPropValue(fullName) {
        const prop = PacketEntity.getPropByFullName(this.props, fullName);
        return prop ? prop.value : null;
    }
}
exports.PacketEntity = PacketEntity;
//# sourceMappingURL=PacketEntity.js.map