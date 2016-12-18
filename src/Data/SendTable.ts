import {SendPropDefinition, SendPropType, SendPropFlag} from './SendPropDefinition';

export class SendTable {
	name: string;
	props: SendPropDefinition[];
	private _flattenedProps: SendPropDefinition[];

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
		let props: SendPropDefinition[] = [];
		this.getAllProps(excludes, props);

		// sort often changed props before the others
		let start = 0;
		for (let i = 0; i < props.length; i++) {
			if (props[i].hasFlag(SendPropFlag.SPROP_CHANGES_OFTEN)) {
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

	getAllProps(excludes: SendTable[], props: SendPropDefinition[]) {
		let localProps = [];
		this.getAllPropsIteratorProps(excludes, localProps, props);
		for (let i = 0; i < localProps.length; i++) {
			props.push(localProps[i]);
		}
	}

	getAllPropsIteratorProps(excludes: SendTable[], props: SendPropDefinition[], childProps: SendPropDefinition[]) {
		for (let i = 0; i < this.props.length; i++) {
			const prop = this.props[i];
			if (prop.type === SendPropType.DPT_DataTable && prop.table) {
				if (prop.hasFlag(SendPropFlag.SPROP_EXCLUDE)) {
					excludes.push(prop.table);
				} else if (excludes.indexOf(this) === -1) {
					if (prop.hasFlag(SendPropFlag.SPROP_COLLAPSIBLE)) {
						prop.table.getAllPropsIteratorProps(excludes, props, childProps);
					} else {
						prop.table.getAllProps(excludes, childProps);
					}
				}
			} else if (!prop.hasFlag(SendPropFlag.SPROP_EXCLUDE)) {
				props.push(prop);
			}
		}
	}

	get flattenedProps() {
		if (this._flattenedProps.length === 0) {
			this.flatten();
		}
		return this._flattenedProps;
	}
}



