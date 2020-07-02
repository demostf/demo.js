"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../../Data/Message");
const SendPropDefinition_1 = require("../../Data/SendPropDefinition");
const SendTable_1 = require("../../Data/SendTable");
const ServerClass_1 = require("../../Data/ServerClass");
exports.DataTableHandler = {
    parseMessage: (stream) => {
        const tick = stream.readInt32();
        const length = stream.readInt32();
        const messageStream = stream.readBitStream(length * 8);
        // https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_common_eng.cpp#L356
        // https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_recv_eng.cpp#L310
        // https://github.com/PazerOP/DemoLib/blob/master/DemoLib/Commands/DemoDataTablesCommand.cs
        const tables = [];
        const tableMap = new Map();
        while (messageStream.readBoolean()) {
            const needsDecoder = messageStream.readBoolean();
            const tableName = messageStream.readASCIIString();
            const numProps = messageStream.readBits(10);
            const table = new SendTable_1.SendTable(tableName);
            table.needsDecoder = needsDecoder;
            // get props metadata
            let arrayElementProp;
            for (let i = 0; i < numProps; i++) {
                const propType = messageStream.readBits(5);
                const propName = messageStream.readASCIIString();
                const nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
                const flags = messageStream.readBits(nFlagsBits);
                const prop = new SendPropDefinition_1.SendPropDefinition(propType, propName, flags, tableName);
                if (propType === SendPropDefinition_1.SendPropType.DPT_DataTable) {
                    prop.excludeDTName = messageStream.readASCIIString();
                }
                else {
                    if (prop.isExcludeProp()) {
                        prop.excludeDTName = messageStream.readASCIIString();
                    }
                    else if (prop.type === SendPropDefinition_1.SendPropType.DPT_Array) {
                        prop.numElements = messageStream.readBits(10);
                    }
                    else {
                        prop.lowValue = messageStream.readFloat32();
                        prop.highValue = messageStream.readFloat32();
                        prop.bitCount = messageStream.readBits(7);
                    }
                }
                if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NOSCALE)) {
                    if (prop.type === SendPropDefinition_1.SendPropType.DPT_Float) {
                        prop.originalBitCount = prop.bitCount;
                        prop.bitCount = 32;
                    }
                    else if (prop.type === SendPropDefinition_1.SendPropType.DPT_Vector) {
                        if (!prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NORMAL)) {
                            prop.originalBitCount = prop.bitCount;
                            prop.bitCount = 32 * 3;
                        }
                    }
                }
                if (arrayElementProp) {
                    if (prop.type !== SendPropDefinition_1.SendPropType.DPT_Array) {
                        throw new Error('expected prop of type array');
                    }
                    prop.arrayProperty = arrayElementProp;
                    arrayElementProp = null;
                }
                if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_INSIDEARRAY)) {
                    if (arrayElementProp) {
                        throw new Error('array element already set');
                    }
                    if (prop.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_CHANGES_OFTEN)) {
                        throw new Error('unexpected CHANGES_OFTEN prop in array');
                    }
                    arrayElementProp = prop;
                }
                else {
                    table.addProp(prop);
                }
            }
            tables.push(table);
            tableMap.set(table.name, table);
        }
        // link referenced tables
        for (const table of tables) {
            for (const prop of table.props) {
                if (prop.type === SendPropDefinition_1.SendPropType.DPT_DataTable) {
                    if (prop.excludeDTName) {
                        const referencedTable = tableMap.get(prop.excludeDTName);
                        if (!referencedTable) {
                            throw new Error(`Unknown referenced table ${prop.excludeDTName}`);
                        }
                        prop.table = referencedTable;
                        prop.excludeDTName = null;
                    }
                }
            }
        }
        const numServerClasses = messageStream.readUint16(); // short
        const serverClasses = [];
        if (numServerClasses <= 0) {
            throw new Error('expected one or more serverclasses');
        }
        for (let i = 0; i < numServerClasses; i++) {
            const classId = messageStream.readUint16();
            if (classId > numServerClasses) {
                throw new Error('invalid class id');
            }
            const className = messageStream.readASCIIString();
            const dataTable = messageStream.readASCIIString();
            serverClasses.push(new ServerClass_1.ServerClass(classId, className, dataTable));
        }
        if (messageStream.bitsLeft > 7) {
            throw new Error('unexpected remaining data in datatable (' + messageStream.bitsLeft + ' bits)');
        }
        return {
            type: Message_1.MessageType.DataTables,
            tick,
            rawData: messageStream,
            tables,
            serverClasses
        };
    },
    encodeMessage: (message, stream) => {
        stream.writeUint32(message.tick);
        const lengthStart = stream.index;
        stream.index += 32;
        const dataStart = stream.index;
        for (const table of message.tables) {
            stream.writeBoolean(true);
            stream.writeBoolean(table.needsDecoder);
            stream.writeASCIIString(table.name);
            const numPropsStart = stream.index;
            stream.index += 10;
            let numProps = 0;
            for (const definition of table.props) {
                if (definition.arrayProperty) {
                    encodeSendPropDefinition(stream, definition.arrayProperty);
                    numProps++;
                }
                encodeSendPropDefinition(stream, definition);
                numProps++;
            }
            const propDataEnd = stream.index;
            stream.index = numPropsStart;
            stream.writeBits(numProps, 10);
            stream.index = propDataEnd;
        }
        stream.writeBoolean(false);
        stream.writeUint16(message.serverClasses.length);
        for (const serverClass of message.serverClasses) {
            stream.writeUint16(serverClass.id);
            stream.writeASCIIString(serverClass.name);
            stream.writeASCIIString(serverClass.dataTable);
        }
        const dataEnd = stream.index;
        stream.index = lengthStart;
        const byteLength = Math.ceil((dataEnd - dataStart) / 8);
        stream.writeUint32(byteLength);
        // align to byte;
        stream.index = dataStart + byteLength * 8;
    }
};
function encodeSendPropDefinition(stream, definition) {
    stream.writeBits(definition.type, 5);
    stream.writeASCIIString(definition.name);
    stream.writeBits(definition.flags, 16);
    if (definition.type === SendPropDefinition_1.SendPropType.DPT_DataTable) {
        if (!definition.table) {
            throw new Error('Missing linked table');
        }
        stream.writeASCIIString(definition.table.name);
    }
    else {
        if (definition.isExcludeProp()) {
            if (!definition.excludeDTName) {
                throw new Error('Missing linked table');
            }
            stream.writeASCIIString(definition.excludeDTName);
        }
        else if (definition.type === SendPropDefinition_1.SendPropType.DPT_Array) {
            stream.writeBits(definition.numElements, 10);
        }
        else {
            stream.writeFloat32(definition.lowValue);
            stream.writeFloat32(definition.highValue);
            // if (definition.originalBitCount === null || typeof  definition.originalBitCount === 'undefined') {
            // 	stream.writeBits(definition.bitCount, 7);
            // } else {
            // 	stream.writeBits(definition.originalBitCount, 7);
            // }
            if (definition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NOSCALE) && (definition.type === SendPropDefinition_1.SendPropType.DPT_Float ||
                (definition.type === SendPropDefinition_1.SendPropType.DPT_Vector && !definition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NORMAL)))) {
                if (definition.originalBitCount === null || typeof definition.originalBitCount === 'undefined') {
                    stream.writeBits(definition.bitCount / 3, 7);
                }
                else {
                    stream.writeBits(definition.originalBitCount, 7);
                }
            }
            else {
                stream.writeBits(definition.bitCount, 7);
            }
        }
    }
}
//# sourceMappingURL=DataTable.js.map