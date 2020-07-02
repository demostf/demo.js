import { BitStream } from 'bit-buffer';
import { VoiceDataPacket } from '../../Data/Packet';
export declare function ParseVoiceData(stream: BitStream): VoiceDataPacket;
export declare function EncodeVoiceData(packet: VoiceDataPacket, stream: BitStream): void;
