import { BitStream } from 'bit-buffer';
import { GameEventPacket } from '../../Data/Packet';
import { ParserState } from '../../Data/ParserState';
export declare function ParseGameEvent(stream: BitStream, state: ParserState): GameEventPacket;
export declare function EncodeGameEvent(packet: GameEventPacket, stream: BitStream, state: ParserState): void;
