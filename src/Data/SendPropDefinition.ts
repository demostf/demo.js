import {SendTable} from './SendTable';

export class SendPropDefinition {
	public type: SendPropType;
	public name: string;
	public flags: number;
	public excludeDTName: string | null;
	public lowValue: number;
	public highValue: number;
	public bitCount: number;
	public table: SendTable | null;
	public numElements: number;
	public arrayProperty: SendPropDefinition | null;
	public ownerTableName: string;

	constructor(type: SendPropType, name: string, flags: number, ownerTableName: string) {
		this.type = type;
		this.name = name;
		this.flags = flags;
		this.excludeDTName = null;
		this.lowValue = 0;
		this.highValue = 0;
		this.bitCount = 0;
		this.table = null;
		this.numElements = 0;
		this.arrayProperty = null;
		this.ownerTableName = ownerTableName;
	}

	public hasFlag(flag: SendPropFlag) {
		return (this.flags & flag) !== 0;
	}

	public isExcludeProp() {
		return this.hasFlag(SendPropFlag.SPROP_EXCLUDE);
	}

	public inspect() {
		const data: any = {
			ownerTableName: this.ownerTableName,
			name: this.name,
			type: SendPropType[this.type],
			flags: this.flags,
			bitCount: this.bitCount,
		};
		if (this.type === SendPropType.DPT_Float) {
			data.lowValue = this.lowValue;
			data.highValue = this.highValue;
		}
		if (this.type === SendPropType.DPT_DataTable && this.table) {
			data.tableName = this.table.name;
		}

		return data;
	}

	get fullName() {
		return `${this.ownerTableName}.${this.name}`;
	}

	get allFlags() {
		return SendPropDefinition.formatFlags(this.flags);
	}

	static formatFlags(flags: number) {
		let names: string[] = [];
		for (const name in SendPropFlag) {
			const flagValue = <SendPropFlag | string>SendPropFlag[name];
			if (typeof flagValue === 'number') {
				if (flags & flagValue) {
					names.push(name);
				}
			}
		}
		return names;
	}
}

export enum SendPropType {
	DPT_Int,
	DPT_Float,
	DPT_Vector,
	DPT_VectorXY,
	DPT_String,
	DPT_Array,
	DPT_DataTable,
	DPT_NUMSendPropTypes,
}

export enum SendPropFlag {
	SPROP_UNSIGNED = (1 << 0), // Unsigned integer data.
	SPROP_COORD = (1 << 1), // If this is set, the float/vector is treated like a world coordinate.
	// Note that the bit count is ignored in this case.
	SPROP_NOSCALE = (1 << 2), // For floating point, don't scale into range, just take value as is.
	SPROP_ROUNDDOWN = (1 << 3), // For floating point, limit high value to range minus one bit unit
	SPROP_ROUNDUP = (1 << 4), // For floating point, limit low value to range minus one bit unit
	SPROP_NORMAL = (1 << 5), // If this is set, the vector is treated like a normal (only valid for vectors)
	SPROP_EXCLUDE = (1 << 6), // This is an exclude prop (not excludED, but it points at another prop to be excluded).
	SPROP_XYZE = (1 << 7), // Use XYZ/Exponent encoding for vectors.
	SPROP_INSIDEARRAY = (1 << 8), // This tells us that the property is inside an array, so it shouldn't be put into the
	// flattened property list. Its array will point at it when it needs to.
	SPROP_PROXY_ALWAYS_YES = (1 << 9), // Set for datatable props using one of the default datatable proxies like
	// SendProxy_DataTableToDataTable that always send the data to all clients.
	SPROP_CHANGES_OFTEN = (1 << 10), // this is an often changed field, moved to head of sendtable so it gets a small index
	SPROP_IS_A_VECTOR_ELEM = (1 << 11), // Set automatically if SPROP_VECTORELEM is used.
	SPROP_COLLAPSIBLE = (1 << 12), // Set automatically if it's a datatable with an offset of 0 that doesn't change the pointer
	// (ie: for all automatically-chained base classes).
	// In this case, it can get rid of this SendPropDataTable altogether and spare the
	// trouble of walking the hierarchy more than necessary.
	SPROP_COORD_MP = (1 << 13), // Like SPROP_COORD, but special handling for multiplayer games
	SPROP_COORD_MP_LOWPRECISION = (1 << 14), // Like SPROP_COORD, but special handling for multiplayer games
	// where the fractional component only gets a 3 bits instead of 5
	SPROP_COORD_MP_INTEGRAL = (1 << 15), // SPROP_COORD_MP, but coordinates are rounded to integral boundaries
	SPROP_VARINT = (1 << 5),
}
