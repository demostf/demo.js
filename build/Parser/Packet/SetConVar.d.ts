import { BitStream } from 'bit-buffer';
import { SetConVarPacket } from '../../Data/Packet';
export declare function ParseSetConVar(stream: BitStream): SetConVarPacket;
export declare function EncodeSetConVar(packet: SetConVarPacket, stream: BitStream): void;
