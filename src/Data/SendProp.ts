import * as clone from 'clone';
import {SendPropDefinition} from "./SendPropDefinition";

export class SendProp {
	definition: SendPropDefinition;
	value: any;

	constructor(definition: SendPropDefinition) {
		this.definition = definition;
		this.value = null;
	}

	clone() {
		const prop = new SendProp(this.definition);
		prop.value = clone(this.value);
		return prop;
	}
}

