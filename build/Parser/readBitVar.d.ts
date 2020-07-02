import { BitStream } from 'bit-buffer';
export declare function makeUnsigned(value: number, signed?: boolean): number;
export declare function readBitVar(stream: BitStream, signed?: boolean): number;
export declare function writeBitVar(value: number, stream: BitStream, signed?: boolean): void;
export declare const readUBitVar: typeof readBitVar;
export declare function readVarInt(stream: BitStream, signed?: boolean): number;
export declare function writeVarInt(value: number, stream: BitStream, signed?: boolean): void;
