import { BitStream } from 'bit-buffer';
import { GameEventListPacket } from '../../Data/Packet';
export declare function ParseGameEventList(stream: BitStream): GameEventListPacket;
export declare function EncodeGameEventList(packet: GameEventListPacket, stream: BitStream): void;
