import { BitStream } from 'bit-buffer';
import { BSPDecalPacket } from '../../Data/Packet';
import { Vector } from '../../Data/Vector';
export declare function getVecCoord(stream: BitStream): Vector;
export declare function encodeVecCoord(vector: Vector, stream: BitStream): void;
export declare function ParseBSPDecal(stream: BitStream): BSPDecalPacket;
export declare function EncodeBSPDecal(packet: BSPDecalPacket, stream: BitStream): void;
