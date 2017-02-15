import {SendPropDefinition} from "./SendPropDefinition";
import {Vector} from "./Vector";

export class SendProp {
	definition: SendPropDefinition;
	value: SendPropValue|null;

	constructor(definition: SendPropDefinition) {
		this.definition = definition;
		this.value = null;
	}

	clone():SendProp {
		const prop = new SendProp(this.definition);
		prop.value = this.value;
		return prop;
	}
}

export type SendPropArrayValue = Vector | number | string;
export type SendPropValue = Vector | number | string | SendPropArrayValue[];
