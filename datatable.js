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
	while (this.stream.readBoolean()) {
		var needsDecoder = this.stream.readBoolean();
		var tableName = this.stream.readASCIIString();
		var numProps = this.stream.readBits(10);
		var table = new SentTable(tableName);

		// get props metadata
		var arrayElementProp;
		for (var i = 0; i < numProps; i++) {
			var propType = this.stream.readBits(5);
			var propName = this.stream.readASCIIString();
			var nFlagsBits = 16; // might be 11 (old?), 13 (new?), 16(networked) or 17(??)
			var flags = this.stream.readBits(nFlagsBits);
			var prop = new SendProp(propType, propName, flags);
			if (propType === SendProp.types.DPT_DataTable) {
				prop.excludeDTName = this.stream.readASCIIString();
			} else {
				if (prop.isExcludeProp()) {
					prop.excludeDTName = this.stream.readASCIIString();
				} else if (prop.type === SendProp.types.DPT_Array) {
					prop.numElements = this.stream.readBits(10);
				} else {
					prop.lowValue = this.stream.readFloat32();
					prop.highValue = this.stream.readFloat32();
					prop.bitCount = this.stream.readBits(7);
				}
			}

			if (prop.hasFlag(SendProp.flags.SPROP_NOSCALE)) {
				if (prop.type === SendProp.types.DPT_Float) {
					prop.bitCount = 32;
				} else if (prop.type === SendProp.types.DPT_Vector) {
					if (!prop.hasFlag(SendProp.flags.SPROP_NORMAL)) {
						prop.bitCount = 32 * 3;
					}
				}
			}

			if (arrayElementProp) {
				if (!prop.type === SendProp.types.DPT_Array) {
					throw "expected prop of type array";
				}
				prop.arrayProperty = arrayElementProp;
				arrayElementProp = null;
			}

			if (prop.hasFlag(SendProp.flags.SPROP_INSIDEARRAY)) {
				arrayElementProp = prop;
			} else {
				table.addProp(prop);
			}
		}
		tables.push(table);
	}
	this.match.sendTables = tables;
	return tables;
};

var SentTable = function (name) {
	this.name = name;
	this.props = [];
};

SentTable.prototype.addProp = function (prop) {
	this.props.push(prop);
};

var SendProp = function (type, name, flags) {
	this.type = type;
	this.name = name;
	this.flags = flags;
	this.excludeDTName = null;
	this.lowValue = 0;
	this.highValue = 0;
	this.bits = 0;
};

SendProp.prototype.hasFlag = function (flag) {
	return (this.flags & flag) != 0;
};
SendProp.prototype.isExcludeProp = function () {
	return this.hasFlag(SendProp.flags.SPROP_EXCLUDE);
};

SendProp.types = {
	DPT_Int             : 0,
	DPT_Float           : 1,
	DPT_Vector          : 2,
	DPT_VectorXY        : 3,// Only encodes the XY of a vector, ignores Z
	DPT_String          : 4,
	DPT_Array           : 5,
	DPT_DataTable       : 6,
	DPT_NUMSendPropTypes: 7
};

SendProp.flags = {
	SPROP_UNSIGNED             : (1 << 0),// Unsigned integer data.
	SPROP_COORD                : (1 << 1),// If this is set, the float/vector is treated like a world coordinate.
	// Note that the bit count is ignored in this case.
	SPROP_NOSCALE              : (1 << 2),// For floating point, don't scale into range, just take value as is.
	SPROP_ROUNDDOWN            : (1 << 3),// For floating point, limit high value to range minus one bit unit
	SPROP_ROUNDUP              : (1 << 4),// For floating point, limit low value to range minus one bit unit
	SPROP_NORMAL               : (1 << 5),// If this is set, the vector is treated like a normal (only valid for vectors)
	SPROP_EXCLUDE              : (1 << 6),// This is an exclude prop (not excludED, but it points at another prop to be excluded).
	SPROP_XYZE                 : (1 << 7),// Use XYZ/Exponent encoding for vectors.
	SPROP_INSIDEARRAY          : (1 << 8),// This tells us that the property is inside an array, so it shouldn't be put into the
	// flattened property list. Its array will point at it when it needs to.
	SPROP_PROXY_ALWAYS_YES     : (1 << 9),// Set for datatable props using one of the default datatable proxies like
	// SendProxy_DataTableToDataTable that always send the data to all clients.
	SPROP_CHANGES_OFTEN        : (1 << 10),// this is an often changed field, moved to head of sendtable so it gets a small index
	SPROP_IS_A_VECTOR_ELEM     : (1 << 11),// Set automatically if SPROP_VECTORELEM is used.
	SPROP_COLLAPSIBLE          : (1 << 12),// Set automatically if it's a datatable with an offset of 0 that doesn't change the pointer
	// (ie: for all automatically-chained base classes).
	// In this case, it can get rid of this SendPropDataTable altogether and spare the
	// trouble of walking the hierarchy more than necessary.
	SPROP_COORD_MP             : (1 << 13),// Like SPROP_COORD, but special handling for multiplayer games
	SPROP_COORD_MP_LOWPRECISION: (1 << 14),// Like SPROP_COORD, but special handling for multiplayer games where the fractional component only gets a 3 bits instead of 5
	SPROP_COORD_MP_INTEGRAL    : (1 << 15)// SPROP_COORD_MP, but coordinates are rounded to integral boundaries
};

SendProp.formatFlags = function (flags) {
	var names = [];
	for (var name in SendProp.flags) {
		if (SendProp.flags.hasOwnProperty(name)) {
			if (flags & SendProp.flags[name]) {
				names.push(name);
			}
		}
	}
	return names;
};

function recvClassInfos(stream, needsDecoder) {

}

module.exports = DataTableParser;
