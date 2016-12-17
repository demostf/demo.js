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
		var table = new SentTable(tableName);

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

var SentTable = function (name) {
	this.name = name;
	this.props = [];
	this._flattenedProps = [];
};

Object.defineProperty(SentTable.prototype, 'flattenedProps', {
	get: function () {
		if (this._flattenedProps.length === 0) {
			this.flatten();
		}
		return this._flattenedProps;
	}
});

SentTable.prototype.addProp = function (prop) {
	this.props.push(prop);
};
SentTable.prototype.flatten = function () {
	var excludes = [];
	var props = [];
	this.getAllProps(excludes, props);

	// sort often changed props before the others
	var start = 0;
	for (var i = 0; i < props.length; i++) {
		if (props[i].hasFlag(SendPropDefinition.flags.SPROP_CHANGES_OFTEN)) {
			if (i != start) {
				var temp = props[i];
				props[i] = props[start];
				props[start] = temp;
			}
			start++;
		}
	}
	this._flattenedProps = props;
};
SentTable.prototype.getAllProps = function (excludes, props) {
	var localProps = [];
	this.getAllPropsIteratorProps(excludes, localProps, props);
	for (var i = 0; i < localProps.length; i++) {
		props.push(localProps[i]);
	}
};
SentTable.prototype.getAllPropsIteratorProps = function (excludes, props, childProps) {
	for (var i = 0; i < this.props.length; i++) {
		var prop = this.props[i];
		if (prop.type === SendPropDefinition.types.DPT_DataTable) {
			if (prop.hasFlag(SendPropDefinition.flags.SPROP_EXCLUDE)) {
				excludes.push(prop.table);
			} else if (excludes.indexOf(this) === -1) {
				if (prop.hasFlag(SendPropDefinition.flags.SPROP_COLLAPSIBLE)) {
					prop.table.getAllPropsIteratorProps(excludes, props, childProps);
				} else {
					prop.table.getAllProps(excludes, childProps);
				}
			}
		} else if (!prop.hasFlag(SendPropDefinition.flags.SPROP_EXCLUDE)) {
			props.push(prop);
		}
	}
};

var SendPropDefinition = function (type, name, flags) {
	this.type = type;
	this.name = name;
	this.flags = flags;
	this.excludeDTName = null;
	this.lowValue = 0;
	this.highValue = 0;
	this.bitCount = 0;
	this.table = null;
	this.numElements = null;
	this.arrayProperty = null;
};

SendPropDefinition.prototype.hasFlag = function (flag) {
	return (this.flags & flag) != 0;
};
SendPropDefinition.prototype.isExcludeProp = function () {
	return this.hasFlag(SendPropDefinition.flags.SPROP_EXCLUDE);
};

SendPropDefinition.types = {
	DPT_Int             : 0,
	DPT_Float           : 1,
	DPT_Vector          : 2,
	DPT_VectorXY        : 3,// Only encodes the XY of a vector, ignores Z
	DPT_String          : 4,
	DPT_Array           : 5,
	DPT_DataTable       : 6,
	DPT_NUMSendPropTypes: 7
};

SendPropDefinition.flags = {
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
	SPROP_COORD_MP_INTEGRAL    : (1 << 15),// SPROP_COORD_MP, but coordinates are rounded to integral boundaries
	SPROP_VARINT               : (1 << 5) //reuse normal
};

SendPropDefinition.formatFlags = function (flags) {
	var names = [];
	for (var name in SendPropDefinition.flags) {
		if (SendPropDefinition.flags.hasOwnProperty(name)) {
			if (flags & SendPropDefinition.flags[name]) {
				names.push(name);
			}
		}
	}
	return names;
};

SendPropDefinition.prototype.decode = function (stream) {
	switch (this.type) {
		case SendPropDefinition.types.DPT_Int:
			return this.readInt(stream);
		case SendPropDefinition.types.DPT_Vector:
			return this.readVector(stream);
		case SendPropDefinition.types.DPT_VectorXY:
			return this.readVectorXY(stream);
		case SendPropDefinition.types.DPT_Float:
			return this.readFloat(stream);
		case SendPropDefinition.types.DPT_String:
			return this.readString(stream);
		case SendPropDefinition.types.DPT_Array:
			return this.readArray(stream);
	}
};

SendPropDefinition.prototype.readInt = function (stream) {
	if (this.hasFlag(SendPropDefinition.flags.SPROP_VARINT)) {
		return readBitVar(stream, !this.hasFlag(SendPropDefinition.flags.SPROP_UNSIGNED));
	} else {
		return stream.readBits(this.bitCount, !this.hasFlag(SendPropDefinition.flags.SPROP_UNSIGNED));
	}
};

SendPropDefinition.prototype.readArray = function (stream) {
	var maxElements = this.numElements;
	var numBits = 1;
	while ((maxElements >>= 1) != 0)
		numBits++;

	var count = stream.readBits(numBits);
	var values = [];
	for (var i = 0; i < count; i++) {
		values.push(this.arrayProperty.decode(stream));
	}
	return values;
};

SendPropDefinition.prototype.readString = function (stream) {
	var length = stream.readBits(9);
	return stream.readASCIIString(length);
};

SendPropDefinition.prototype.readVector = function (stream) {
	var x = this.readFloat(stream);
	var y = this.readFloat(stream);
	if (this.hasFlag(SendPropDefinition.flags.SPROP_NORMAL)) {
		var z = this.readFloat(stream);
	} else {
		z = 0; //guess
	}
	return new Vector(x, y, z);
};

SendPropDefinition.prototype.readVectorXY = function (stream) {
	var x = this.readFloat(stream);
	var y = this.readFloat(stream);
	return new Vector(x, y, 0);
};

var Vector = function (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

SendPropDefinition.prototype.readFloat = function (stream) {
	if (this.hasFlag(SendPropDefinition.flags.SPROP_COORD)) {
		throw new Error("not implemented");
	} else if (this.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP)) {
		return this.readBitCoord(stream, false, false);
	} else if (this.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP_LOWPRECISION)) {
		return this.readBitCoord(stream, false, true);
	} else if (this.hasFlag(SendPropDefinition.flags.SPROP_COORD_MP_INTEGRAL)) {
		return this.readBitCoord(stream, true, false);
	} else if (this.hasFlag(SendPropDefinition.flags.SPROP_NOSCALE)) {
		return stream.readFloat32();
	} else if (this.hasFlag(SendPropDefinition.flags.SPROP_NORMAL)) {
		throw new Error("not implemented");
	} else {
		var raw = stream.readBits(this.bitCount);
		var percentage = raw / ((1 << this.bitCount) - 1);
		return this.lowValue + (this.highValue - this.lowValue) * percentage;
	}
};

SendPropDefinition.prototype.readBitCoord = function (stream, isIntegral, isLowPercision) {
	var value = 0;
	var isNegative = false;
	var inBounds = stream.readBoolean();

	var hasIntVal = stream.readBoolean();
	if (isIntegral) {
		if (hasIntVal) {
			isNegative = stream.readBoolean();

			if (inBounds) {
				value = stream.readBitVar(11) + 1;
			} else {
				value = stream.readBitVar(14) + 1;
				if (value < (1 << 11)) {
					throw new Error("Something's fishy...");
				}
			}
		}
	} else {
		isNegative = stream.readBoolean();
		if (hasIntVal) {
			if (inBounds) {
				value = stream.readBitVar(11) + 1;
			} else {
				value = stream.readBitVar(14) + 1;
				if (value < (1 << 11)) {
					throw new Error("Something's fishy...");
				}
			}
		}
		var fractalVal = stream.readBits(isLowPercision ? 3 : 5);
		value += fractalVal * (1 / (1 << (isLowPercision ? 3 : 5)));
	}
	if (isNegative) {
		value = -value;
	}
	return value;
};

var ServerClass = function (id, name, dataTable) {
	this.id = id;
	this.name = name;
	this.dataTable = dataTable;
};

var readBitVar = function (stream, signed) {
	switch (stream.readBits(2)) {
		case 0:
			return stream.readBits(4, signed);
		case 1:
			return stream.readBits(8, signed);
		case 2:
			return stream.readBits(12, signed);
		case 3:
			return stream.readBits(32, signed);
	}
};

module.exports = DataTableParser;
