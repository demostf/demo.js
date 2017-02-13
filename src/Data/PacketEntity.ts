import {ServerClass} from "./ServerClass";
import {SendTable} from "./SendTable";
import {SendProp} from "./SendProp";
import {SendPropDefinition} from "./SendPropDefinition";
export class PacketEntity {
	serverClass: ServerClass;
	sendTable: SendTable;
	entityIndex: number;
	serialNumber: number;
	props: SendProp[];
	inPVS: boolean;
	updatedProps: SendProp[];

	constructor(serverClass: ServerClass, sendTable: SendTable, entityIndex: number, serialNumber: number) {
		this.serverClass  = serverClass;
		this.sendTable    = sendTable;
		this.entityIndex  = entityIndex;
		this.serialNumber = serialNumber;
		this.props        = [];
		this.inPVS        = false;
		this.updatedProps = [];
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
}

