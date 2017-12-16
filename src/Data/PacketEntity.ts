import {SendProp, SendPropValue} from './SendProp';
import {SendPropDefinition} from './SendPropDefinition';
import {ServerClass} from './ServerClass';

export enum PVS {
	PRESERVE = 0,
	ENTER = 1,
	LEAVE = 2,
	DELETE = 4
}

export type EntityId = number;

export class PacketEntity {
	public static getPropByFullName(props: SendProp[], fullName: string): SendProp | null {
		for (const prop of props) {
			if (prop.definition.fullName === fullName) {
				return prop;
			}
		}
		return null;
	}

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
		return PacketEntity.getPropByFullName(this.props, definition.fullName);
	}

	public getProperty(originTable: string, name: string) {
		const prop = PacketEntity.getPropByFullName(this.props, `${originTable}.${name}`);
		if (prop) {
			return prop;
		}
		throw new Error(`Property not found in entity (${originTable}.${name})`);
	}

	public hasProperty(originTable: string, name: string) {
		return PacketEntity.getPropByFullName(this.props, `${originTable}.${name}`) !== null;
	}

	public clone(): PacketEntity {
		const result = new PacketEntity(this.serverClass, this.entityIndex, this.pvs);
		for (const prop of this.props) {
			result.props.push(prop.clone());
		}
		result.serialNumber = this.serialNumber;
		if (this.delay) {
			result.delay = this.delay;
		}
		result.inPVS = this.inPVS;
		return result;
	}

	public applyPropUpdate(props: SendProp[]) {
		for (const prop of props) {
			const existingProp = this.getPropByDefinition(prop.definition);
			if (existingProp) {
				existingProp.value = prop.value;
			} else {
				this.props.push(prop.clone());
			}
		}
	}

	public diffFromBaseLine(baselineProps: SendProp[]): SendProp[] {
		return this.props.filter((prop) => {
			const baseProp = PacketEntity.getPropByFullName(baselineProps, prop.definition.fullName);
			return (!baseProp || !SendProp.areEqual(prop, baseProp));
		});
	}

	public getPropValue(fullName: string): SendPropValue | null {
		const prop = PacketEntity.getPropByFullName(this.props, fullName);
		return prop ? prop.value : null;
	}
}
