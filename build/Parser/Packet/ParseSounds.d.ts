import { BitStream } from 'bit-buffer';
import { ParseSoundsPacket } from '../../Data/Packet';
export declare function ParseParseSounds(stream: BitStream): ParseSoundsPacket;
export declare function EncodeParseSounds(packet: ParseSoundsPacket, stream: BitStream): void;
