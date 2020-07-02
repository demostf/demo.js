import { BitStream } from 'bit-buffer';
import { StringTable, StringTableEntry } from '../Data/StringTable';
export declare function parseStringTableEntries(stream: BitStream, table: StringTable, entryCount: number, existingEntries?: StringTableEntry[]): StringTableEntry[];
export declare function guessStringTableEntryLength(table: StringTable, entries: StringTableEntry[]): number;
export declare function encodeStringTableEntries(stream: BitStream, table: StringTable, entries: StringTableEntry[], oldEntries?: StringTableEntry[]): void;
