import { BitStream } from 'bit-buffer';
import { UserMessagePacket } from '../../Data/UserMessage';
export declare function ParseUserMessage(stream: BitStream): UserMessagePacket;
export declare function EncodeUserMessage(packet: UserMessagePacket, stream: BitStream): void;
