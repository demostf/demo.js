"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Math_1 = require("../Math");
function makeUnsigned(value, signed) {
    if (signed) {
        const signBit = value < 0 ? 1 : 0;
        return ((value ^ -signBit) << 1) + signBit;
    }
    else {
        return value;
    }
}
exports.makeUnsigned = makeUnsigned;
function readBitVar(stream, signed) {
    const type = stream.readBits(2);
    switch (type) {
        case 0:
            return stream.readBits(4, signed);
        case 1:
            return stream.readBits(8, signed);
        case 2:
            return stream.readBits(12, signed);
        case 3:
            return stream.readBits(32, signed);
    }
    throw new Error('Invalid var bit');
}
exports.readBitVar = readBitVar;
function writeBitVar(value, stream, signed) {
    const bitsNeeded = (signed) ? Math_1.logBase2(Math.abs(value)) + 2 : Math_1.logBase2(value) + 1;
    if (signed) {
        const signBit = value < 0 ? 1 : 0;
        value = value ^ (-signBit << (bitsNeeded - 1)) + (signBit << (bitsNeeded - 1));
    }
    if (bitsNeeded > 12) {
        stream.writeBits(3, 2);
        stream.writeBits(value, 32);
    }
    else if (bitsNeeded > 8) {
        stream.writeBits(2, 2);
        stream.writeBits(value, 12);
    }
    else if (bitsNeeded > 4) {
        stream.writeBits(1, 2);
        stream.writeBits(value, 8);
    }
    else {
        stream.writeBits(0, 2);
        stream.writeBits(value, 4);
    }
}
exports.writeBitVar = writeBitVar;
exports.readUBitVar = readBitVar;
function readVarInt(stream, signed = false) {
    let result = 0;
    for (let i = 0; i < 35; i += 7) {
        const byte = stream.readUint8();
        result |= ((byte & 0x7F) << i);
        if ((byte >> 7) === 0) {
            break;
        }
    }
    if (signed) {
        return ((result >> 1) ^ -(result & 1));
    }
    else {
        return result;
    }
}
exports.readVarInt = readVarInt;
function writeVarInt(value, stream, signed = false) {
    value = makeUnsigned(value, signed);
    do {
        const byte = value & 0x7F;
        const resumeBit = (value >= 128) ? 0x80 : 0;
        stream.writeUint8(byte | resumeBit);
        value = value >> 7;
    } while (value > 0);
}
exports.writeVarInt = writeVarInt;
//# sourceMappingURL=readBitVar.js.map