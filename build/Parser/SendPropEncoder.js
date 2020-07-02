"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendPropDefinition_1 = require("../Data/SendPropDefinition");
const Vector_1 = require("../Data/Vector");
const Math_1 = require("../Math");
const readBitVar_1 = require("./readBitVar");
const SendPropParser_1 = require("./SendPropParser");
class SendPropEncoder {
    static encode(value, propDefinition, stream) {
        switch (propDefinition.type) {
            case SendPropDefinition_1.SendPropType.DPT_Int:
                if (typeof value !== 'number') {
                    throw new Error(`Invalid value for DPT_Int ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeInt(value, propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_Vector:
                if (!(value instanceof Vector_1.Vector)) {
                    throw new Error(`Invalid value for DPT_Vector ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeVector(value, propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_VectorXY:
                if (!(value instanceof Vector_1.Vector)) {
                    throw new Error(`Invalid value for DPT_VectorXY ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeVectorXY(value, propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_Float:
                if (typeof value !== 'number') {
                    throw new Error(`Invalid value for DPT_Float ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeFloat(value, propDefinition, stream);
            case SendPropDefinition_1.SendPropType.DPT_String:
                if (typeof value !== 'string') {
                    throw new Error(`Invalid value for DPT_String ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeString(value, stream);
            case SendPropDefinition_1.SendPropType.DPT_Array:
                if (!Array.isArray(value)) {
                    throw new Error(`Invalid value for DPT_Array ${JSON.stringify(value)}`);
                }
                return SendPropEncoder.writeArray(value, propDefinition, stream);
        }
        throw new Error('Unknown property type');
    }
    static writeInt(value, propDefinition, stream) {
        if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_VARINT)) {
            return readBitVar_1.writeVarInt(value, stream, !propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_UNSIGNED));
        }
        else {
            if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_UNSIGNED)) {
                return stream.writeBits(value, propDefinition.bitCount);
            }
            else {
                return stream.writeBits(readBitVar_1.makeUnsigned(value), propDefinition.bitCount);
            }
        }
    }
    static writeArray(value, propDefinition, stream) {
        const numBits = Math_1.logBase2(propDefinition.numElements) + 1;
        stream.writeBits(value.length, numBits);
        if (!propDefinition.arrayProperty) {
            throw new Error('Array of undefined type');
        }
        for (const arrayValue of value) {
            SendPropEncoder.encode(arrayValue, propDefinition.arrayProperty, stream);
        }
    }
    static writeString(value, stream) {
        stream.writeBits(value.length, 9);
        if (value) {
            // specify the length to exclude the null terminator
            stream.writeASCIIString(value, value.length);
        }
    }
    static writeVector(value, propDefinition, stream) {
        SendPropEncoder.writeFloat(value.x, propDefinition, stream);
        SendPropEncoder.writeFloat(value.y, propDefinition, stream);
        SendPropEncoder.writeFloat(value.z, propDefinition, stream);
    }
    static writeVectorXY(value, propDefinition, stream) {
        SendPropEncoder.writeFloat(value.x, propDefinition, stream);
        SendPropEncoder.writeFloat(value.y, propDefinition, stream);
    }
    static writeFloat(value, propDefinition, stream) {
        if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD)) {
            return SendPropEncoder.writeBitCoord(value, stream);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP)) {
            return SendPropEncoder.writeBitCoordMP(value, stream, false, false);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) {
            return SendPropEncoder.writeBitCoordMP(value, stream, false, true);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_COORD_MP_INTEGRAL)) {
            return SendPropEncoder.writeBitCoordMP(value, stream, true, false);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NOSCALE)) {
            return stream.writeFloat32(value);
        }
        else if (propDefinition.hasFlag(SendPropDefinition_1.SendPropFlag.SPROP_NORMAL)) {
            return SendPropEncoder.writeBitNormal(value, stream);
        }
        else {
            const percentage = (value - propDefinition.lowValue) / (propDefinition.highValue - propDefinition.lowValue);
            const raw = Math.round(percentage * ((1 << propDefinition.bitCount) - 1));
            stream.writeBits(raw, propDefinition.bitCount);
        }
    }
    static writeBitNormal(value, stream) {
        stream.writeBoolean(value < 0);
        const abs = Math.abs(value);
        const fractPart = abs % 1;
        const fractVal = Math.round(fractPart / SendPropParser_1.bitNormalFactor);
        stream.writeBits(fractVal, 11);
    }
    static writeBitCoord(value, stream) {
        const abs = Math.abs(value);
        const intPart = Math.floor(abs);
        const fractPart = abs % 1;
        stream.writeBoolean(intPart !== 0);
        stream.writeBoolean(fractPart !== 0);
        if (intPart || fractPart) {
            stream.writeBoolean(value < 0);
            if (intPart) {
                stream.writeBits(intPart - 1, 14);
            }
            if (fractPart) {
                stream.writeBits(fractPart * 32, 5);
            }
        }
    }
    static writeBitCoordMP(value, stream, isIntegral, isLowPrecision) {
        const abs = Math.abs(value);
        const intPart = Math.floor(abs);
        const fractPart = abs % 1;
        const inBounds = intPart < Math.pow(2, 11);
        stream.writeBoolean(inBounds);
        stream.writeBoolean(intPart > 0);
        if (isIntegral) {
            if (intPart) {
                stream.writeBoolean(value < 0);
                if (inBounds) {
                    stream.writeBits(intPart - 1, 11);
                }
                else {
                    stream.writeBits(intPart - 1, 14);
                }
            }
        }
        else {
            stream.writeBoolean(value < 0);
            if (intPart) {
                if (inBounds) {
                    stream.writeBits(intPart - 1, 11);
                }
                else {
                    stream.writeBits(intPart - 1, 14);
                }
            }
            const fractVal = Math.round(fractPart / (1 / (1 << (isLowPrecision ? 3 : 5))));
            stream.writeBits(fractVal, isLowPrecision ? 3 : 5);
        }
    }
}
exports.SendPropEncoder = SendPropEncoder;
//# sourceMappingURL=SendPropEncoder.js.map