import {SendTable} from './Data/SendTable';
import {SendPropDefinition} from './Data/SendPropDefinition';

var DataTableParser = function (type, tick, stream, length, match) {
	this.type = type;
	this.tick = tick;
	this.stream = stream;
	this.length = length;//length in bytes
	this.match = match;
};

DataTableParser.prototype.parse = function () {
	// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_common_eng.cpp#L356
	// https://github.com/LestaD/SourceEngine2007/blob/43a5c90a5ada1e69ca044595383be67f40b33c61/src_main/engine/dt_recv_eng.cpp#L310
	// https://github.com/PazerOP/DemoLib/blob/master/DemoLib/Commands/DemoDataTablesCommand.cs
	var tables = [];
	var i, j;
	while (this.stream.readBoolean()) {
		var needsDecoder = this.stream.readBoolean();
		var tableName = this.stream.readASCIIString();
		var numProps = this.stream.readBits(10);
		var table = new SendTable(tableName);

		// get props metadata
		var arrayElementProp;
		for (i = 0; i < numProps; i++) {
			var propType = this.stream.readBits(5);
			var propName = this.stream.readASCIIString();
			var nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
			var flags = this.stream.readBits(nFlagsBits);
			var prop = new SendPropDefinition(propType, propName, flags);
			if (propType === SendPropDefinition.types.DPT_DataTable) {
				prop.excludeDTName = this.stream.readASCIIString();
			} else {
				if (prop.isExcludeProp()) {
					prop.excludeDTName = this.stream.readASCIIString();
				} else if (prop.type === SendPropDefinition.types.DPT_Array) {
					prop.numElements = this.stream.readBits(10);
				} else {
					prop.lowValue = this.stream.readFloat32();
					prop.highValue = this.stream.readFloat32();
					prop.bitCount = this.stream.readBits(7);
				}
			}

			if (prop.hasFlag(SendPropDefinition.flags.SPROP_NOSCALE)) {
				if (prop.type === SendPropDefinition.types.DPT_Float) {
					prop.bitCount = 32;
				} else if (prop.type === SendPropDefinition.types.DPT_Vector) {
					if (!prop.hasFlag(SendPropDefinition.flags.SPROP_NORMAL)) {
						prop.bitCount = 32 * 3;
					}
				}
			}

			if (arrayElementProp) {
				if (!prop.type === SendPropDefinition.types.DPT_Array) {
					throw "expected prop of type array";
				}
				prop.arrayProperty = arrayElementProp;
				arrayElementProp = null;
			}

			if (prop.hasFlag(SendPropDefinition.flags.SPROP_INSIDEARRAY)) {
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
			if (tables[i].props[j].type === SendPropDefinition.types.DPT_DataTable) {
				tables[i].props[j].table = this.match.getSendTable(tables[i].props[j].excludeDTName);
				tables[i].props[j].excludeDTName = null;
			}
		}
	}

	var serverClasses = this.stream.readUint16(); // short
	if (serverClasses <= 0) {
		throw "expected one or more serverclasses";
	}

	for (i = 0; i < serverClasses; i++) {
		var classId = this.stream.readUint16();
		if (classId > serverClasses) {
			throw "invalid class id";
		}
		var className = this.stream.readASCIIString();
		var dataTable = this.stream.readASCIIString();
		this.match.serverClasses.push(new ServerClass(classId, className, dataTable));
	}

	var bitsLeft = (this.length * 8) - this.stream._index;
	if (bitsLeft > 7) {
		throw "unexpected remaining data in datatable (" + bitsLeft + " bits)";
	}

	return tables;
};

var ServerClass = function (id, name, dataTable) {
	this.id = id;
	this.name = name;
	this.dataTable = dataTable;
};

module.exports = DataTableParser;
