"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendProp_1 = require("../Data/SendProp");
const readBitVar_1 = require("./readBitVar");
const SendPropEncoder_1 = require("./SendPropEncoder");
const SendPropParser_1 = require("./SendPropParser");
function getEntityUpdate(sendTable, stream) {
    let index = -1;
    const allProps = sendTable.flattenedProps;
    const props = new Map();
    let lastIndex = -1;
    while (stream.readBoolean()) {
        lastIndex = index;
        index = readFieldIndex(stream, index);
        if (index >= 4096 || index > allProps.length) {
            throw new Error(`prop index out of bounds while applying update for ${sendTable.name}
			got ${index} property only has ${allProps.length} properties (lastProp: ${lastIndex})`);
        }
        const propDefinition = allProps[index];
        const prop = new SendProp_1.SendProp(propDefinition);
        prop.value = SendPropParser_1.SendPropParser.decode(propDefinition, stream);
        props.set(propDefinition.fullName, prop);
    }
    return Array.from(props.values());
}
exports.getEntityUpdate = getEntityUpdate;
function encodeEntityUpdate(props, sendTable, stream) {
    const allProps = sendTable.flattenedProps;
    props.sort((propA, propB) => {
        const indexA = allProps.findIndex((propDef) => propDef.fullName === propA.definition.fullName);
        const indexB = allProps.findIndex((propDef) => propDef.fullName === propB.definition.fullName);
        return indexA - indexB;
    });
    let lastIndex = -1;
    for (const prop of props) {
        stream.writeBoolean(true);
        const index = allProps.findIndex((propDef) => propDef.fullName === prop.definition.fullName);
        if (index === -1) {
            throw new Error(`Unknown definition for property ${prop.definition.fullName} in ${sendTable.name}`);
        }
        if (index < lastIndex) {
            throw new Error(`Property index not incremental while encoding ` +
                `${prop.definition.fullName} after ${allProps[lastIndex].fullName} ` +
                `in ${sendTable.name} (current: ${index}, last: ${lastIndex})`);
        }
        writeFieldIndex(index, stream, lastIndex);
        lastIndex = index;
        if (prop.value !== null) {
            SendPropEncoder_1.SendPropEncoder.encode(prop.value, prop.definition, stream);
        }
    }
    stream.writeBoolean(false);
}
exports.encodeEntityUpdate = encodeEntityUpdate;
function readFieldIndex(stream, lastIndex) {
    const diff = readBitVar_1.readBitVar(stream);
    return lastIndex + diff + 1;
}
function writeFieldIndex(index, stream, lastIndex) {
    const diff = index - lastIndex - 1;
    readBitVar_1.writeBitVar(diff, stream);
}
//# sourceMappingURL=EntityDecoder.js.map