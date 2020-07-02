"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendPropDefinition_1 = require("../Data/SendPropDefinition");
const Vector_1 = require("../Data/Vector");
const Math_1 = require("../Math");
const readBitVar_1 = require("./readBitVar");
exports.bitNormalFactor = (1 / ((1 << 11) - 1));
class SendPropParser {
    static decode(propDefinition, stream) {
        switch (propDefinition.type) {
            case SendPropDefinition_1.SendPropType.DPT_Int:
                return SendPropParser.readInt(propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_Vector:
                return SendPropParser.readVector(propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_VectorXY:
                return SendPropParser.readVectorXY(propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_Float:
                return SendPropParser.readFloat(propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_String:
                return SendPropParser.readString(stream);
            case SendPropDefinition_1.SendPropType.DPT_Array:
                return SendPropParser.readArray(propDefinition, stream);
        }
        throw new Error(`Unknown property type ${propDefinition.type}`);
    }
    static readInt(propDefinition, stream) {
        if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_VARINT)) {
            return readBitVar_1.readVarInt(stream, !propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_UNSIGNED));
        }
        else {
            return stream.readBits(propDefinition.bitCount, !propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_UNSIGNED));
        }
    }
    static readArray(propDefinition, stream) {
        const numBits = Math_1.logBase2(propDefinition.numElements) + 1;
        const count = stream.readBits(numBits);
        const values = [];
        if (!propDefinition.arrayProperty) {
            throw new Error('Array of undefined type');
        }
        for (let i = 0; i < count; i++) {
            const value = SendPropParser.decode(propDefinition.arrayProperty, stream);
            if (value instanceof Array) {
                throw new Error('Nested arrays not supported');
            }
            values.push(value);
        }
        return values;
    }
    static readString(stream) {
        const length = stream.readBits(9);
        return stream.readASCIIString(length);
    }
    static readVector(propDefinition, stream) {
        const x = SendPropParser.readFloat(propDefinition, stream);
        const y = SendPropParser.readFloat(propDefinition, stream);
        const z = SendPropParser.readFloat(propDefinition, stream);
        return new Vector_1.Vector(x, y, z);
    }
    static readVectorXY(propDefinition, stream) {
        const x = SendPropParser.readFloat(propDefinition, stream);
        const y = SendPropParser.readFloat(propDefinition, stream);
        return new Vector_1.Vector(x, y, 0);
    }
    static readFloat(propDefinition, stream) {
        if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD)) {
            return SendPropParser.readBitCoord(stream);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP)) {
            return SendPropParser.readBitCoordMP(stream, false, false);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) {
            return SendPropParser.readBitCoordMP(stream, false, true);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP_INTEGRAL)) {
            return SendPropParser.readBitCoordMP(stream, true, false);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NOSCALE)) {
            return stream.readFloat32();
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NORMAL)) {
            return SendPropParser.readBitNormal(stream);
        }
        else {
            const raw = stream.readBits(propDefinition.bitCount);
            const percentage = raw / ((1 << propDefinition.bitCount) - 1);
            return propDefinition.lowValue + (propDefinition.highValue - propDefinition.lowValue) * percentage;
        }
    }
    static readBitNormal(stream) {
        const isNegative = stream.readBoolean();
        const fractVal = stream.readBits(11);
        const value = fractVal * exports.bitNormalFactor;
        return (isNegative) ? -value : value;
    }
    static readBitCoord(stream) {
        const hasIntVal = stream.readBoolean();
        const hasFractVal = stream.readBoolean();
        if (hasIntVal || hasFractVal) {
            const isNegative = stream.readBoolean();
            const intVal = (hasIntVal) ? stream.readBits(14) + 1 : 0;
            const fractVal = (hasFractVal) ? stream.readBits(5) : 0;
            const value = intVal + fractVal * (1 / 32);
            return (isNegative) ? -value : value;
        }
        return 0;
    }
    static readBitCoordMP(stream, isIntegral, isLowPrecision) {
        let value = 0;
        let isNegative = false;
        const inBounds = stream.readBoolean();
        const hasIntVal = stream.readBoolean();
        if (isIntegral) {
            if (hasIntVal) {
                isNegative = stream.readBoolean();
                if (inBounds) {
                    value = stream.readBits(11) + 1;
                }
                else {
                    value = stream.readBits(14) + 1;
                    if (value < (1 << 11)) {
                        throw new Error('Something\'s fishy...');
                    }
                }
            }
        }
        else {
            isNegative = stream.readBoolean();
            if (hasIntVal) {
                if (inBounds) {
                    value = stream.readBits(11) + 1;
                }
                else {
                    value = stream.readBits(14) + 1;
                    if (value < (1 << 11)) {
                        // console.log(propDefinition, value);
                        // throw new Error("Something's fishy...");
                    }
                }
            }
            const fractalVal = stream.readBits(isLowPrecision ? 3 : 5);
            value += fractalVal * (1 / (1 << (isLowPrecision ? 3 : 5)));
        }
        if (isNegative) {
            value = -value;
        }
        return value;
    }
}
exports.SendPropParser = SendPropParser;
//# sourceMappingURL=SendPropParser.js.map