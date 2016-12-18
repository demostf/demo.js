import clone from 'clone';

export class SentProp {
	constructor(definition) {
		this.definition = definition;
		this.value = null;
	}

	clone() {
		const prop = new SentProp(this.definition);
		prop.value = clone(this.value);
		return prop;
	}
}

