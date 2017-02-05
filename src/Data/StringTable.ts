import {BitStream} from "bit-buffer";
export interface StringTable {
	name: string;
	entries: StringTableEntry[],
	maxEntries: number;
	fixedUserDataSize?: number;
	fixedUserDataSizeBits?: number;
}

export interface StringTableEntry {
	text: string;
	extraData?: BitStream;
}
