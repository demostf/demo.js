export interface StringTable {
	name: string;
	entries: StringTableEntry[];
}

export interface StringTableEntry {
	text: string;
	extraData: string[];
}
