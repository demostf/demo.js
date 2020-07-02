/// <reference types="node" />
import { BitStream } from 'bit-buffer';
import { Analyser } from './Analyser';
import { Parser } from './Parser';
export declare enum ParseMode {
    MINIMAL = 0,
    ENTITIES = 1,
    COMPLETE = 2
}
export declare class Demo {
    static fromNodeBuffer(nodeBuffer: Buffer): Demo;
    stream: BitStream;
    parser: Parser | null;
    constructor(arrayBuffer: ArrayBuffer);
    getParser(mode?: ParseMode): Parser;
    getAnalyser(mode?: ParseMode): Analyser;
    private getSkippedPackets;
}
