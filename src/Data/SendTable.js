import {SendPropDefinition} from './SendPropDefinition';

export class SendTable {
	constructor(name) {
		this.name = name;
		this.props = [];
		this._flattenedProps = [];
	}

	addProp(prop) {
		this.props.push(prop);
	}

	flatten() {
		let excludes = [];
		let props = [];
		this.getAllProps(excludes, props);

		// sort often changed props before the others
		let start = 0;
		for (let i = 0; i < props.length; i++) {
			if (props[i].hasFlag(SendPropDefinition.flags.SPROP_CHANGES_OFTEN)) {
				if (i != start) {
					const temp = props[i];
					props[i] = props[start];
					props[start] = temp;
				}
				start++;
			}
		}
		this._flattenedProps = props;
	}

	getAllProps(excludes, props) {
		let localProps = [];
		this.getAllPropsIteratorProps(excludes, localProps, props);
		for (let i = 0; i < localProps.length; i++) {
			props.push(localProps[i]);
		}
	}

	getAllPropsIteratorProps(excludes, props, childProps) {
		for (let i = 0; i < this.props.length; i++) {
			const prop = this.props[i];
			if (prop.type === SendPropDefinition.types.DPT_DataTable) {
				if (prop.hasFlag(SendPropDefinition.flags.SPROP_EXCLUDE)) {
					excludes.push(prop.table);
				} else if (excludes.indexOf(this) === -1) {
					if (prop.hasFlag(SendPropDefinition.flags.SPROP_COLLAPSIBLE)) {
						prop.table.getAllPropsIteratorProps(excludes, props, childProps);
					} else {
						prop.table.getAllProps(excludes, childProps);
					}
				}
			} else if (!prop.hasFlag(SendPropDefinition.flags.SPROP_EXCLUDE)) {
				props.push(prop);
			}
		}
	}

	get flattenedProps(){
		if (this._flattenedProps.length === 0) {
			this.flatten();
		}
		return this._flattenedProps;
	}
}



