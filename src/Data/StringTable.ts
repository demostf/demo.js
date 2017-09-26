import {BitStream} from 'bit-buffer';

export interface StringTable {
	name: string;
	entries: StringTableEntry[];
	maxEntries: number;
	fixedUserDataSize?: number;
	fixedUserDataSizeBits?: number;
	clientEntries?: StringTableEntry[];
}

export interface StringTableEntry {
	text: string;
	extraData?: BitStream;
}
