export class Entity {
	constructor(serverClass, sentTable, entityIndex, serialNumber) {
		this.serverClass = serverClass;
		this.sendTable = sentTable;
		this.entityIndex = entityIndex;
		this.serialNumber = serialNumber;
		this.props = [];
		this.inPVS = false;
	}

	getPropByDefinition(definition) {
		for (let i = 0; i < this.props; i++) {
			if (this.props[i].definition === definition) {
				return this.props[i];
			}
		}
		return null;
	}
}

