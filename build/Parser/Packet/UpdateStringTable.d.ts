import { BitStream } from 'bit-buffer';
import { UpdateStringTablePacket } from '../../Data/Packet';
import { ParserState } from '../../Data/ParserState';
export declare function ParseUpdateStringTable(stream: BitStream, state: ParserState): UpdateStringTablePacket;
export declare function EncodeUpdateStringTable(packet: UpdateStringTablePacket, stream: BitStream, state: ParserState): void;
