import {PacketEntity} from "../Data/PacketEntity";
import {BitStream} from "bit-buffer";
import {SendProp} from "../Data/SendProp";
import {SendPropParser} from "./SendPropParser";
import {readUBitVar} from "./readBitVar";
import {SendTable} from "../Data/SendTable";

export function applyEntityUpdate(entity: PacketEntity, sendTable: SendTable, stream: BitStream): PacketEntity {
	let index      = -1;
	const allProps = sendTable.flattenedProps;
	let lastProps:SendProp[]  = [];
	while ((index = readFieldIndex(stream, index)) != -1) {
		if (index >= 4096 || index > allProps.length) {
			console.log(lastProps[lastProps.length - 1]);
			throw new Error('prop index out of bounds while applying update for ' + sendTable.name + ' got ' + index
				+ ' property only has ' + allProps.length + ' properties');
		}

		const propDefinition = allProps[index];
		const existingProp   = entity.getPropByDefinition(propDefinition);

		const prop = existingProp ? existingProp : new SendProp(propDefinition);
		prop.value = SendPropParser.decode(propDefinition, stream);
		entity.updatedProps.push(prop);
		lastProps.push(prop);

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
