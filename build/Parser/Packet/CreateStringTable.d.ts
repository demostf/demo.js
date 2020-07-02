import { BitStream } from 'bit-buffer';
import { CreateStringTablePacket } from '../../Data/Packet';
export declare function ParseCreateStringTable(stream: BitStream): CreateStringTablePacket;
export declare function EncodeCreateStringTable(packet: CreateStringTablePacket, stream: BitStream): void;
