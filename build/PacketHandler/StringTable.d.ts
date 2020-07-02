import { CreateStringTablePacket, StringTablePacket, UpdateStringTablePacket } from '../Data/Packet';
import { ParserState } from '../Data/ParserState';
import { StringTable } from '../Data/StringTable';
export declare function handleStringTable(packet: CreateStringTablePacket, state: ParserState): void;
export declare function handleStringTables(packet: StringTablePacket, state: ParserState): void;
export declare function handleStringTableUpdate(packet: UpdateStringTablePacket, state: ParserState): void;
export declare function handleTable(table: StringTable, state: ParserState): void;
