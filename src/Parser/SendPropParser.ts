import {SendPropDefinition, SendPropType, SendPropFlag} from '../Data/SendPropDefinition';
import {Vector} from "../Data/Vector";
import {BitStream} from "bit-buffer";
import {SendPropValue, SendPropArrayValue} from "../Data/SendProp";


const readBitVar = function (stream: BitStream, signed: boolean): number {
	switch (stream.readBits(2)) {
		case 0:
			return stream.readBits(4, signed);
		case 1:
			return stream.readBits(8, signed);
		case 2:
			return stream.readBits(12, signed);
		case 3:
			return stream.readBits(32, signed);
	}
	return 0;
};

export class SendPropParser {
	static decode(propDefinition: SendPropDefinition, stream: BitStream): SendPropValue {
		switch (propDefinition.type) {
			case SendPropType.DPT_Int:
				return SendPropParser.readInt(propDefinition, stream);
			case SendPropType.DPT_Vector:
				return SendPropParser.readVector(propDefinition, stream);
			case SendPropType.DPT_VectorXY:
				return SendPropParser.readVectorXY(propDefinition, stream);
			case SendPropType.DPT_Float:
				return SendPropParser.readFloat(propDefinition, stream);
			case SendPropType.DPT_String:
				return SendPropParser.readString(stream);
			case SendPropType.DPT_Array:
				return SendPropParser.readArray(propDefinition, stream);
		}
		throw new Error('Unknown property type');
	}

	static readInt(propDefinition: SendPropDefinition, stream: BitStream) {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_VARINT)) {
			return readBitVar(stream, !propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED));
		} else {
			return stream.readBits(propDefinition.bitCount, !propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED));
		}
	}

	static readArray(propDefinition: SendPropDefinition, stream: BitStream): SendPropArrayValue[] {
		let maxElements = propDefinition.numElements;
		let numBits = 1;
		while ((maxElements >>= 1) != 0)
			numBits++;

		const count = stream.readBits(numBits);
		const values: SendPropArrayValue[] = [];
		if (!propDefinition.arrayProperty) {
			throw new Error('Array of undefniend type');
		}
		for (let i = 0; i < count; i++) {
			const value = SendPropParser.decode(propDefinition.arrayProperty, stream);
			if (value instanceof Array) {
				throw new Error('Nested arrays not supported');
			}
			values.push();
		}
		return values;
	}

	static readString(stream: BitStream): string {
		const length = stream.readBits(9);
		return stream.readASCIIString(length);
	}

	static readVector(propDefinition: SendPropDefinition, stream: BitStream): Vector {
		const x = SendPropParser.readFloat(propDefinition, stream);
		const y = SendPropParser.readFloat(propDefinition, stream);
		const z = (propDefinition.hasFlag(SendPropFlag.SPROP_NORMAL)) ? SendPropParser.readFloat(propDefinition, stream) : 0;
		return new Vector(x, y, z);
	}

	static readVectorXY(propDefinition: SendPropDefinition, stream: BitStream): Vector {
		const x = SendPropParser.readFloat(propDefinition, stream);
		const y = SendPropParser.readFloat(propDefinition, stream);
		return new Vector(x, y, 0);
	}

	static readFloat(propDefinition: SendPropDefinition, stream: BitStream): number {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD)) {
			throw new Error("not implemented");
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP)) {
			return SendPropParser.readBitCoord(stream, false, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) {
			return SendPropParser.readBitCoord(stream, false, true);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_INTEGRAL)) {
			return SendPropParser.readBitCoord(stream, true, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NOSCALE)) {
			return stream.readFloat32();
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NORMAL)) {
			throw new Error("not implemented");
		} else {
			const raw = stream.readBits(propDefinition.bitCount);
			const percentage = raw / ((1 << propDefinition.bitCount) - 1);
			return propDefinition.lowValue + (propDefinition.highValue - propDefinition.lowValue) * percentage;
		}
	}

	static readBitCoord(stream: BitStream, isIntegral: boolean, isLowPrecision: boolean): number {
		let value = 0;
		let isNegative = false;
		const inBounds = stream.readBoolean();

		const hasIntVal = stream.readBoolean();
		if (isIntegral) {
			if (hasIntVal) {
				isNegative = stream.readBoolean();

				if (inBounds) {
					value = stream.readBits(11) + 1;
				} else {
					value = stream.readBits(14) + 1;
					if (value < (1 << 11)) {
						throw new Error("Something's fishy...");
					}
				}
			}
		} else {
			isNegative = stream.readBoolean();
			if (hasIntVal) {
				if (inBounds) {
					value = stream.readBits(11) + 1;
				} else {
					value = stream.readBits(14) + 1;
					if (value < (1 << 11)) {
						throw new Error("Something's fishy...");
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
