import {ServerClass} from "./ServerClass";
import {SendTable} from "./SendTable";
import {SendProp} from "./SendProp";
import {SendPropDefinition} from "./SendPropDefinition";
export class Entity {
	serverClass: ServerClass;
	sendTable: SendTable;
	entityIndex: number;
	serialNumber: number;
	props: SendProp[];
	inPVS: boolean;

	constructor(serverClass: ServerClass, sendTable: SendTable, entityIndex: number, serialNumber: number) {
		this.serverClass = serverClass;
		this.sendTable = sendTable;
		this.entityIndex = entityIndex;
		this.serialNumber = serialNumber;
		this.props = [];
		this.inPVS = false;
	}

	getPropByDefinition(definition: SendPropDefinition) {
		for (let i = 0; i < this.props.length; i++) {
			if (this.props[i].definition === definition) {
				return this.props[i];
			}
		}
		return null;
	}
}

