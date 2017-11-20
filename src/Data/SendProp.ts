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

	public static areEqual(a: SendProp, b: SendProp) {
		return a.definition.fullName !== b.definition.fullName ? false : SendProp.valuesAreEqual(a.value, b.value);
	}

	private static valuesAreEqual(a: SendPropValue | null, b: SendPropValue | null) {
		if (Array.isArray(a) && Array.isArray(b)) {
			if (a.length !== b.length) {
				return false;
			}
			for (let i = 0; i < a.length; i++) {
				if (!SendProp.valuesAreEqual(a[i], b[i])) {
					return false;
				}
			}
			return true;
		} else if (a instanceof Vector && b instanceof Vector) {
			return Vector.areEqual(a, b);
		} else {
			return a === b;
		}
	}
}

export type SendPropArrayValue = Vector | number | string;
export type SendPropValue = Vector | number | string | SendPropArrayValue[];
