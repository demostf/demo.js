import {SendTable} from '../../Data/SendTable';
import {SendPropDefinition, SendPropFlag, SendPropType} from '../../Data/SendPropDefinition';
import {ServerClass} from '../../Data/ServerClass';
import {Parser} from './Parser';

export class DataTable extends Parser {
	parse() {
		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_common_eng.cpp#L356
		// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_recv_eng.cpp#L310
		// https://github.com/PazerOP/DemoLib/blob/master/DemoLib/Commands/DemoDataTablesCommand.cs
		let tables:SendTable[] = [];
		let i, j;
		while (this.stream.readBoolean()) {
			const needsDecoder = this.stream.readBoolean();
			const tableName = this.stream.readASCIIString();
			const numProps = this.stream.readBits(10);
			const table = new SendTable(tableName);

			// get props metadata
			let arrayElementProp;
			for (i = 0; i < numProps; i++) {
				const propType = this.stream.readBits(5);
				const propName = this.stream.readASCIIString();
				const nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
				const flags = this.stream.readBits(nFlagsBits);
				const prop = new SendPropDefinition(propType, propName, flags, tableName);
				if (propType === SendPropType.DPT_DataTable) {
					prop.excludeDTName = this.stream.readASCIIString();
				} else {
					if (prop.isExcludeProp()) {
						prop.excludeDTName = this.stream.readASCIIString();
					} else if (prop.type === SendPropType.DPT_Array) {
						prop.numElements = this.stream.readBits(10);
					} else {
						prop.lowValue = this.stream.readFloat32();
						prop.highValue = this.stream.readFloat32();
						prop.bitCount = this.stream.readBits(7);
					}
				}

				if (prop.hasFlag(SendPropFlag.SPROP_NOSCALE)) {
					if (prop.type === SendPropType.DPT_Float) {
						prop.bitCount = 32;
					} else if (prop.type === SendPropType.DPT_Vector) {
						if (!prop.hasFlag(SendPropFlag.SPROP_NORMAL)) {
							prop.bitCount = 32 * 3;
						}
					}
				}

				if (arrayElementProp) {
					if (prop.type !== SendPropType.DPT_Array) {
						throw "expected prop of type array";
					}
					prop.arrayProperty = arrayElementProp;
					arrayElementProp = null;
				}

				if (prop.hasFlag(SendPropFlag.SPROP_INSIDEARRAY)) {
					if (arrayElementProp) {
						throw new Error("array element already set");
					}
					if (prop.hasFlag(SendPropFlag.SPROP_CHANGES_OFTEN)) {
						throw new Error("unexpected CHANGES_OFTEN prop in array");
					}
					arrayElementProp = prop;
				} else {
					table.addProp(prop);
				}
			}
			tables.push(table);
		}
		this.match.sendTables = tables;

		// link referenced tables
		for (i = 0; i < tables.length; i++) {
			for (j = 0; j < tables[i].props.length; j++) {
				if (tables[i].props[j].type === SendPropType.DPT_DataTable) {
					tables[i].props[j].table = this.match.getSendTable(tables[i].props[j].excludeDTName);
					tables[i].props[j].excludeDTName = null;
				}
			}
		}

		const serverClasses = this.stream.readUint16(); // short
		if (serverClasses <= 0) {
			throw "expected one or more serverclasses";
		}

		for (i = 0; i < serverClasses; i++) {
			const classId = this.stream.readUint16();
			if (classId > serverClasses) {
				throw "invalid class id";
			}
			const className = this.stream.readASCIIString();
			const dataTable = this.stream.readASCIIString();
			this.match.serverClasses.push(new ServerClass(classId, className, dataTable));
		}

		const bitsLeft = (this.length * 8) - this.stream.index;
		if (bitsLeft > 7 || bitsLeft < 0) {
			throw "unexpected remaining data in datatable (" + bitsLeft + " bits)";
		}

		return tables;
	}
}
