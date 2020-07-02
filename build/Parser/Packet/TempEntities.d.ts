import { BitStream } from 'bit-buffer';
import { TempEntitiesPacket } from '../../Data/Packet';
import { ParserState } from '../../Data/ParserState';
export declare function ParseTempEntities(stream: BitStream, state: ParserState, skip?: boolean): TempEntitiesPacket;
export declare function EncodeTempEntities(packet: TempEntitiesPacket, stream: BitStream, state: ParserState): void;
