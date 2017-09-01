import {SendPropDefinition} from './SendPropDefinition';
import {Vector} from './Vector';

export class SendProp {
	public definition: SendPropDefinition;
	public value: SendPropValue | null;

	constructor(definition: SendPropDefinition) {
		this.definition = definition;
		this.value = null;
	}

	public clone(): SendProp {
		const prop = new SendProp(this.definition);
		prop.value = this.value;
		return prop;
	}
}

export type SendPropArrayValue = Vector | number | string;
export type SendPropValue = Vector | number | string | SendPropArrayValue[];
