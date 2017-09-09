export type ServerClassId = number;

export class ServerClass {
	public id: ServerClassId;
	public name: string;
	public dataTable: string;

	constructor(id: ServerClassId, name: string, dataTable: string) {
		this.id = id;
		this.name = name;
		this.dataTable = dataTable;
	}
}
