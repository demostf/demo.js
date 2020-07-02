import { BitStream } from 'bit-buffer';
import { SayText2Packet } from '../../Data/UserMessage';
export declare function ParseSayText2(stream: BitStream): SayText2Packet;
export declare function EncodeSayText2(packet: SayText2Packet, stream: BitStream): void;
