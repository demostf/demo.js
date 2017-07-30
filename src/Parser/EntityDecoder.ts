import {BitStream} from 'bit-buffer';
import {PacketEntity} from '../Data/PacketEntity';
import {SendProp} from '../Data/SendProp';
import {SendTable} from '../Data/SendTable';
import {readUBitVar} from './readBitVar';
import {SendPropParser} from './SendPropParser';

export function applyEntityUpdate(entity: PacketEntity, sendTable: SendTable, stream: BitStream): PacketEntity {
	let index = -1;
	const allProps = sendTable.flattenedProps;
	index = readFieldIndex(stream, index);
	while (index !== -1) {
		if (index >= 4096 || index > allProps.length) {
			throw new Error('prop index out of bounds while applying update for ' + sendTable.name + ' got ' + index
				+ ' property only has ' + allProps.length + ' properties');
		}

		const propDefinition = allProps[index];
		const existingProp = entity.getPropByDefinition(propDefinition);

		const prop = existingProp ? existingProp : new SendProp(propDefinition);
		prop.value = SendPropParser.decode(propDefinition, stream);

		if (!existingProp) {
			entity.props.push(prop);
		}

		index = readFieldIndex(stream, index);
	}
	return entity;
}

function readFieldIndex(stream: BitStream, lastIndex: number): number {
	if (!stream.readBoolean()) {
		return -1;
	}
	const diff = readUBitVar(stream);
	return lastIndex + diff + 1;
}
