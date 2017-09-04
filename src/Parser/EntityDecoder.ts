import {BitStream} from 'bit-buffer';
import {SendProp} from '../Data/SendProp';
import {SendTable} from '../Data/SendTable';
import {readBitVar, writeBitVar} from './readBitVar';
import {SendPropParser} from './SendPropParser';
import {SendPropEncoder} from './SendPropEncoder';

export function getEntityUpdate(sendTable: SendTable, stream: BitStream): SendProp[] {
	let index = -1;
	const allProps = sendTable.flattenedProps;
	const props: SendProp[] = [];
	while (stream.readBoolean()) {
		index = readFieldIndex(stream, index);
		if (index >= 4096 || index > allProps.length) {
			throw new Error('prop index out of bounds while applying update for ' + sendTable.name + ' got ' + index
				+ ' property only has ' + allProps.length + ' properties');
		}

		const propDefinition = allProps[index];
		const prop = new SendProp(propDefinition);
		prop.value = SendPropParser.decode(propDefinition, stream);
		props.push(prop);
	}
	return props;
}

export function encodeEntityUpdate(props: SendProp[], sendTable: SendTable, stream: BitStream) {
	const allProps = sendTable.flattenedProps;
	let lastIndex = -1;
	for (const prop of props) {
		stream.writeBoolean(true);
		const index = allProps.findIndex(propDef => propDef.fullName === prop.definition.fullName);
		if (index === -1) {
			throw new Error('Unknown definition for property');
		}
		writeFieldIndex(index, stream, lastIndex);
		lastIndex = index;

		if (prop.value !== null) {
			SendPropEncoder.encode(prop.value, prop.definition, stream);
		}
	}
	stream.writeBoolean(false);
}

function readFieldIndex(stream: BitStream, lastIndex: number): number {
	const diff = readBitVar(stream);
	return lastIndex + diff + 1;
}

function writeFieldIndex(index: number, stream: BitStream, lastIndex: number) {
	const diff = index - lastIndex - 1;
	writeBitVar(diff, stream);
}
