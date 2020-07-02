import { BitStream } from 'bit-buffer';
import { Packet, VoidPacket } from '../../Data/Packet';
import { ParserState } from '../../Data/ParserState';
export declare type Parser<P extends Packet> = (stream: BitStream, state?: ParserState, skip?: boolean) => P;
export declare type Encoder<P extends Packet> = (packet: P, stream: BitStream, state?: ParserState) => void;
export interface PacketHandler<P extends Packet> {
    parser: Parser<P>;
    encoder: Encoder<P>;
}
export declare const voidEncoder: Encoder<VoidPacket>;
