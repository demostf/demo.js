import {SendPropDefinition} from '../Data/SendPropDefinition';
import {Vector} from "../Data/Vector";


const readBitVar = function (stream, signed) {
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
};

export class SendPropParser {
	static decode(propDefinition, stream) {
		switch (propDefinition.type) {
			case SendPropDefinition.types.DPT_Int:
				return SendPropParser.readInt(propDefinition, stream);
			case SendPropDefinition.types.DPT_Vector:
				return SendPropParser.readVector(propDefinition, stream);
			case SendPropDefinition.types.DPT_VectorXY:
				return SendPropParser.readVectorXY(propDefinition, stream);
			case SendPropDefinition.types.DPT_Float:
				return SendPropParser.readFloat(propDefinition, stream);
			case SendPropDefinition.types.DPT_String:
				return SendPropParser.readString(stream);
			case SendPropDefinition.types.DPT_Array:
				return SendPropParser.readArray(propDefinition, stream);
		}
	}

	static readInt(propDefinition, stream) {
		if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_VARINT)) {
			return readBitVar(stream, !propDefinition.hasFlag(SendPropDefinition.flags.SPROP_UNSIGNED));
		} else {
			return stream.readBits(propDefinition.bitCount, !propDefinition.hasFlag(SendPropDefinition.flags.SPROP_UNSIGNED));
		}
	}

	static readArray(propDefinition, stream) {
		let maxElements = propDefinition.numElements;
		let numBits = 1;
		while ((maxElements >>= 1) != 0)
			numBits++;

		const count = stream.readBits(numBits);
		const values = [];
		for (let i = 0; i < count; i++) {
			values.push(SendPropParser.decode(propDefinition.arrayProperty, stream));
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
		const z = (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_NORMAL)) ? SendPropParser.readFloat(propDefinition, stream) : 0;
		return new Vector(x, y, z);
	}

	static readVectorXY(propDefinition, stream) {
		const x = SendPropParser.readFloat(propDefinition, stream);
		const y = SendPropParser.readFloat(propDefinition, stream);
		return new Vector(x, y, 0);
	}

	static readFloat(propDefinition, stream) {
		if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_COORD)) {
			throw new Error("not implemented");
		} else if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP)) {
			return SendPropParser.readBitCoord(stream, false, false);
		} else if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP_LOWPRECISION)) {
			return SendPropParser.readBitCoord(stream, false, true);
		} else if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP_INTEGRAL)) {
			return SendPropParser.readBitCoord(stream, true, false);
		} else if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_NOSCALE)) {
			return stream.readFloat32();
		} else if (propDefinition.hasFlag(SendPropDefinition.flags.SPROP_NORMAL)) {
			throw new Error("not implemented");
		} else {
			const raw = stream.readBits(propDefinition.bitCount);
			const percentage = raw / ((1 << propDefinition.bitCount) - 1);
			return propDefinition.lowValue + (propDefinition.highValue - propDefinition.lowValue) * percentage;
		}
	}

	static readBitCoord(stream, isIntegral, isLowPrecision) {
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
