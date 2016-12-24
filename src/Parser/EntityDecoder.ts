import {Entity} from "../Data/Entity";
import {BitStream} from "bit-buffer";
import {SendProp} from "../Data/SendProp";
import {SendPropParser} from "./SendPropParser";
import {readUBitVar} from "./readBitVar";

export function applyEntityUpdate(entity: Entity, stream: BitStream): Entity {
	let index                    = -1;
	const allProps               = entity.sendTable.flattenedProps;
	while ((index = readFieldIndex(stream, index)) != -1) {
		if (index > 4096) {
			throw new Error('prop index out of bounds while applying update for ' + entity.sendTable.name + ' got ' + index);
		}
		console.log("index: " + index, allProps.length);
		const propDefinition = allProps[index];
		// console.log(propDefinition);
		const existingProp   = entity.getPropByDefinition(propDefinition);
		let prop;
		if (existingProp) {
			prop = existingProp;
		} else {
			prop = new SendProp(propDefinition);
		}
		prop.value = SendPropParser.decode(propDefinition, stream);
		console.log(prop);

		if (!existingProp) {
			entity.props.push(prop);
		}
	}
	return entity;
}

const readFieldIndex = function (stream: BitStream, lastIndex: number): number {
	if (!stream.readBoolean()) {
		return -1;
	}
	const diff = readUBitVar(stream);
	return lastIndex + diff + 1;
};
