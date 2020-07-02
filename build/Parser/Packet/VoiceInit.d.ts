import { BitStream } from 'bit-buffer';
import { VoiceInitPacket } from '../../Data/Packet';
export declare function ParseVoiceInit(stream: BitStream): VoiceInitPacket;
export declare function EncodeVoiceInit(packet: VoiceInitPacket, stream: BitStream): void;
