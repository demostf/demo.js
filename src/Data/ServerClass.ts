import {SendTable} from "./SendTable";

export class ServerClass {
	id: number;
	name: string;
	dataTable: SendTable;

	constructor(id, name, dataTable) {
		this.id = id;
		this.name = name;
		this.dataTable = dataTable;
	}
}
