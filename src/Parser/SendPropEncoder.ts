import {BitStream} from 'bit-buffer';
import {SendPropArrayValue, SendPropValue} from '../Data/SendProp';
import {SendPropDefinition, SendPropFlag, SendPropType} from '../Data/SendPropDefinition';
import {Vector} from '../Data/Vector';
import {logBase2} from '../Math';
import {makeUnsigned, writeVarInt} from './readBitVar';
import {bitNormalFactor} from './SendPropParser';

export class SendPropEncoder {
	public static encode(value: SendPropValue, propDefinition: SendPropDefinition, stream: BitStream) {
		switch (propDefinition.type) {
			case SendPropType.DPT_Int:
				if (typeof value !== 'number') {
					throw new Error(`Invalid value for DPT_Int ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeInt(value, propDefinition, stream);
			case SendPropType.DPT_Vector:
				if (!(value instanceof Vector)) {
					throw new Error(`Invalid value for DPT_Vector ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeVector(value as Vector, propDefinition, stream);
			case SendPropType.DPT_VectorXY:
				if (!(value instanceof Vector)) {
					throw new Error(`Invalid value for DPT_VectorXY ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeVectorXY(value, propDefinition, stream);
			case SendPropType.DPT_Float:
				if (typeof value !== 'number') {
					throw new Error(`Invalid value for DPT_Float ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeFloat(value, propDefinition, stream);
			case SendPropType.DPT_String:
				if (typeof value !== 'string') {
					throw new Error(`Invalid value for DPT_String ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeString(value, stream);
			case SendPropType.DPT_Array:
				if (!Array.isArray(value)) {
					throw new Error(`Invalid value for DPT_Array ${JSON.stringify(value)}`);
				}
				return SendPropEncoder.writeArray(value, propDefinition, stream);
		}
		throw new Error('Unknown property type');
	}

	public static writeInt(value: number, propDefinition: SendPropDefinition, stream: BitStream) {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_VARINT)) {
			return writeVarInt(value, stream, !propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED));
		} else {
			if (propDefinition.hasFlag(SendPropFlag.SPROP_UNSIGNED)) {
				return stream.writeBits(value, propDefinition.bitCount);
			} else {
				return stream.writeBits(makeUnsigned(value), propDefinition.bitCount);
			}
		}
	}

	public static writeArray(value: SendPropArrayValue[], propDefinition: SendPropDefinition, stream: BitStream) {
		const numBits = logBase2(propDefinition.numElements) + 1;

		stream.writeBits(value.length, numBits);
		if (!propDefinition.arrayProperty) {
			throw new Error('Array of undefined type');
		}
		for (const arrayValue of value) {
			SendPropEncoder.encode(arrayValue, propDefinition.arrayProperty, stream);
		}
	}

	public static writeString(value: string, stream: BitStream) {
		// +1 for null
		stream.writeBits(value.length + 1, 9);
		stream.writeASCIIString(value);
	}

	public static writeVector(value: Vector, propDefinition: SendPropDefinition, stream: BitStream) {
		SendPropEncoder.writeFloat(value.x, propDefinition, stream);
		SendPropEncoder.writeFloat(value.y, propDefinition, stream);
		SendPropEncoder.writeFloat(value.z, propDefinition, stream);
	}

	public static writeVectorXY(value: Vector, propDefinition: SendPropDefinition, stream: BitStream) {
		SendPropEncoder.writeFloat(value.x, propDefinition, stream);
		SendPropEncoder.writeFloat(value.y, propDefinition, stream);
	}

	public static writeFloat(value: number, propDefinition: SendPropDefinition, stream: BitStream) {
		if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD)) {
			return SendPropEncoder.writeBitCoord(value, stream);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP)) {
			return SendPropEncoder.writeBitCoordMP(value, stream, false, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_LOWPRECISION)) {
			return SendPropEncoder.writeBitCoordMP(value, stream, false, true);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_COORD_MP_INTEGRAL)) {
			return SendPropEncoder.writeBitCoordMP(value, stream, true, false);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NOSCALE)) {
			return stream.writeFloat32(value);
		} else if (propDefinition.hasFlag(SendPropFlag.SPROP_NORMAL)) {
			return SendPropEncoder.writeBitNormal(value, stream);
		} else {
			const percentage = (value - propDefinition.lowValue) / (propDefinition.highValue - propDefinition.lowValue);
			const raw = Math.round(percentage * ((1 << propDefinition.bitCount) - 1));
			stream.writeBits(raw, propDefinition.bitCount);
		}
	}

	public static writeBitNormal(value: number, stream: BitStream) {
		stream.writeBoolean(value < 0);
		const abs = Math.abs(value);
		const fractPart = abs % 1;
		const fractVal = Math.round(fractPart / bitNormalFactor);
		stream.writeBits(fractVal, 11);
	}

	public static writeBitCoord(value: number, stream: BitStream) {
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

	public static writeBitCoordMP(value: number, stream: BitStream, isIntegral: boolean, isLowPrecision: boolean) {
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
				} else {
					stream.writeBits(intPart - 1, 14);
				}
			}
		} else {
			stream.writeBoolean(value < 0);
			if (intPart) {
				if (inBounds) {
					stream.writeBits(intPart - 1, 11);
				} else {
					stream.writeBits(intPart - 1, 14);
				}
			}
			const fractVal = Math.round(fractPart / (1 / (1 << (isLowPrecision ? 3 : 5))));
			stream.writeBits(fractVal, isLowPrecision ? 3 : 5);
		}
	}
}
