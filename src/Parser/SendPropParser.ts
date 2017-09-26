import {BitStream} from 'bit-buffer';
import {SendPropArrayValue, SendPropValue} from '../Data/SendProp';
import {SendPropDefinition, SendPropFlag, SendPropType} from '../Data/SendPropDefinition';
import {Vector} from '../Data/Vector';
import {logBase2} from '../Math';
import {readVarInt} from './readBitVar';

export const bitNormalFactor = (1 / ((1 << 11) - 1));

export class SendPropParser {
	public static decode(propDefinition: SendPropDefinition, stream: BitStream): SendPropValue {
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
		throw new Error(`Unknown property type ${propDefinition.type}`);
	}

	public static readInt(propDefinition: SendPropDefinition, stream: BitStream) {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_VARINT)) {
			return readVarInt(stream, !propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED));
		} else {
			return stream.readBits(propDefinition.bitCount, !propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED));
		}
	}

	public static readArray(propDefinition: SendPropDefinition, stream: BitStream): SendPropArrayValue[] {
		const numBits = logBase2(propDefinition.numElements) + 1;

		const count = stream.readBits(numBits);
		const values: SendPropArrayValue[] = [];
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

	public static readString(stream: BitStream): string {
		const length = stream.readBits(9);
		return stream.readASCIIString(length);
	}

	public static readVector(propDefinition: SendPropDefinition, stream: BitStream): Vector {
		const x = SendPropParser.readFloat(propDefinition, stream);
		const y = SendPropParser.readFloat(propDefinition, stream);
		const z = SendPropParser.readFloat(propDefinition, stream);
		return new Vector(x, y, z);
	}

	public static readVectorXY(propDefinition: SendPropDefinition, stream: BitStream): Vector {
		const x = SendPropParser.readFloat(propDefinition, stream);
		const y = SendPropParser.readFloat(propDefinition, stream);
		return new Vector(x, y, 0);
	}

	public static readFloat(propDefinition: SendPropDefinition, stream: BitStream): number {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD)) {
			return SendPropParser.readBitCoord(stream);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP)) {
			return SendPropParser.readBitCoordMP(stream, false, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) {
			return SendPropParser.readBitCoordMP(stream, false, true);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_INTEGRAL)) {
			return SendPropParser.readBitCoordMP(stream, true, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NOSCALE)) {
			return stream.readFloat32();
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NORMAL)) {
			return SendPropParser.readBitNormal(stream);
		} else {
			const raw = stream.readBits(propDefinition.bitCount);
			const percentage = raw / ((1 << propDefinition.bitCount) - 1);
			return propDefinition.lowValue + (propDefinition.highValue - propDefinition.lowValue) * percentage;
		}
	}

	public static readBitNormal(stream: BitStream) {
		const isNegative = stream.readBoolean();
		const fractVal = stream.readBits(11);
		const value = fractVal * bitNormalFactor;
		return (isNegative) ? -value : value;
	}

	public static readBitCoord(stream: BitStream) {
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

	public static readBitCoordMP(stream: BitStream, isIntegral: boolean, isLowPrecision: boolean): number {
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
						throw new Error('Something\'s fishy...');
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
