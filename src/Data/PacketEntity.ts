import {SendProp} from './SendProp';
import {SendPropDefinition} from './SendPropDefinition';
import {ServerClass} from './ServerClass';

export enum PVS {
	PRESERVE = 0,
	ENTER = 1,
	LEAVE = 2,
	DELETE = 4,
}

export type EntityId = number;

export class PacketEntity {
	public serverClass: ServerClass;
	public entityIndex: EntityId;
	public props: SendProp[];
	public inPVS: boolean;
	public pvs: PVS;
	public serialNumber?: number;
	public delay?: number;

	constructor(serverClass: ServerClass, entityIndex: number, pvs: PVS) {
		this.serverClass = serverClass;
		this.entityIndex = entityIndex;
		this.props = [];
		this.inPVS = false;
		this.pvs = pvs;
	}

	public getPropByDefinition(definition: SendPropDefinition) {
		for (const prop of this.props) {
			if (prop.definition.fullName === definition.fullName) {
				return prop;
			}
		}
		return null;
	}

	public getProperty(originTable: string, name: string) {
		for (const prop of this.props) {
			if (prop.definition.ownerTableName === originTable && prop.definition.name === name) {
				return prop;
			}
		}
		throw new Error(`Property not found in entity (${originTable}.${name})`);
	}

	public clone(): PacketEntity {
		const result = new PacketEntity(this.serverClass, this.entityIndex, this.pvs);
		for (const prop of this.props) {
			result.props.push(prop.clone());
		}
		return result;
	}

	public applyPropUpdate(props: SendProp[]) {
		for (const prop of props) {
			const existingProp = this.getPropByDefinition(prop.definition);
			if (existingProp) {
				existingProp.value = prop.value;
			} else {
				this.props.push(prop);
			}
		}
	}

	public diffFromBaseLine(baseline: PacketEntity): SendProp[] {
		return this.props.filter(prop => {
			const baseProp = baseline.getPropByDefinition(prop.definition);
			return (!baseProp || prop.value !== baseProp.value);
		});
	}
}
