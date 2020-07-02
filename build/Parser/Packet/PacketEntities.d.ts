import { BitStream } from 'bit-buffer';
import { PacketEntitiesPacket } from '../../Data/Packet';
import { ParserState } from '../../Data/ParserState';
export declare function ParsePacketEntities(stream: BitStream, state: ParserState, skip?: boolean): PacketEntitiesPacket;
export declare function EncodePacketEntities(packet: PacketEntitiesPacket, stream: BitStream, state: ParserState): void;
