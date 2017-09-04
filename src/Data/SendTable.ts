import {SendPropDefinition, SendPropFlag, SendPropType} from './SendPropDefinition';

export type SendTableName = string;

export class SendTable {
	public name: SendTableName;
	public props: SendPropDefinition[];
	private cachedFlattenedProps: SendPropDefinition[];

	constructor(name) {
		this.name = name;
		this.props = [];
		this.cachedFlattenedProps = [];
	}

	public addProp(prop) {
		this.props.push(prop);
	}

	public getAllProps(excludes: SendPropDefinition[], props: SendPropDefinition[]) {
		const localProps = [];
		this.getAllPropsIteratorProps(excludes, localProps, props);
		for (const localProp of localProps) {
			props.push(localProp);
		}
	}

	public getAllPropsIteratorProps(excludes: SendPropDefinition[], props: SendPropDefinition[], childProps: SendPropDefinition[]) {
		for (const prop of this.props) {
			if (prop.hasFlag(SendPropFlag.SPROP_EXCLUDE) || excludes.indexOf(prop) !== -1) {
				continue;
			}
			if (excludes.filter((exclude) => {
					return exclude.name === prop.name && exclude.excludeDTName === prop.ownerTableName;
				}).length > 0) {
				continue;
			}

			if (prop.type === SendPropType.DPT_DataTable && prop.table) {
				if (prop.hasFlag(SendPropFlag.SPROP_COLLAPSIBLE)) {
					prop.table.getAllPropsIteratorProps(excludes, props, childProps);
				} else {
					prop.table.getAllProps(excludes, childProps);
				}
			} else {
				props.push(prop);
			}
		}
	}

	get flattenedProps(): SendPropDefinition[] {
		if (this.cachedFlattenedProps.length === 0) {
			this.flatten();
		}
		return this.cachedFlattenedProps;
	}

	get excludes() {
		let result: SendPropDefinition[] = [];
		for (const prop of this.props) {
			if (prop.hasFlag(SendPropFlag.SPROP_EXCLUDE)) {
				result.push(prop);
			} else if (prop.type === SendPropType.DPT_DataTable && prop.table) {
				result = result.concat(prop.table.excludes);
			}
		}
		return result;
	}

	private flatten() {
		const excludes: SendPropDefinition[] = this.excludes;
		const props: SendPropDefinition[] = [];
		this.getAllProps(excludes, props);

		// sort often changed props before the others
		let start = 0;
		for (let i = 0; i < props.length; i++) {
			if (props[i].hasFlag(SendPropFlag.SPROP_CHANGES_OFTEN)) {
				if (i !== start) {
					const temp = props[i];
					props[i] = props[start];
					props[start] = temp;
				}
				start++;
			}
		}
		this.cachedFlattenedProps = props;
	}
}
