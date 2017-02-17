import {ServerClass} from "./ServerClass";
import {SendTable} from "./SendTable";
import {SendProp} from "./SendProp";
import {SendPropDefinition} from "./SendPropDefinition";

export enum PVS {
	PRESERVE = 0,
	ENTER    = 1,
	LEAVE    = 2,
	DELETE   = 4
}

export class PacketEntity {
	pvs: PVS;
	serverClass: ServerClass;
	entityIndex: number;
	props: SendProp[];
	inPVS: boolean;
	serialNumber?: number;

	constructor(serverClass: ServerClass, entityIndex: number, pvs: PVS) {
		this.serverClass = serverClass;
		this.entityIndex = entityIndex;
		this.props       = [];
		this.inPVS       = false;
		this.pvs         = pvs;
	}

	getPropByDefinition(definition: SendPropDefinition) {
		for (let i = 0; i < this.props.length; i++) {
			if (this.props[i].definition === definition) {
				return this.props[i];
			}
		}
		return null;
	}

	getProperty(originTable: string, name: string) {
		for (const prop of this.props) {
			if (prop.definition.ownerTableName === originTable && prop.definition.name === name) {
				return prop;
			}
		}
		throw new Error('Property not found in entity');
	}

	clone(): PacketEntity {
		const result = new PacketEntity(this.serverClass, this.entityIndex, this.pvs);
		for (const prop of this.props) {
			result.props.push(prop.clone());
		}
		return result;
	}
}

