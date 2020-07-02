import { BitStream } from 'bit-buffer';
export interface StringTable {
    name: string;
    entries: StringTableEntry[];
    maxEntries: number;
    fixedUserDataSize?: number;
    fixedUserDataSizeBits?: number;
    clientEntries?: StringTableEntry[];
    compressed: boolean;
}
export interface StringTableEntry {
    text: string;
    extraData?: BitStream;
}
