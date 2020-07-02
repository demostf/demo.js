import { BitStream } from 'bit-buffer';
import { ClassInfoPacket } from '../../Data/Packet';
export declare function ParseClassInfo(stream: BitStream): ClassInfoPacket;
export declare function EncodeClassInfo(packet: ClassInfoPacket, stream: BitStream): void;
