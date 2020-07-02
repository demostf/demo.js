import { BitStream } from 'bit-buffer';
export declare class DynamicBitStream extends BitStream {
    constructor(initialByteSize?: number);
    readonly length: number;
}
