import { BitStream } from 'bit-buffer';
import { Header } from './Data/Header';
import { Message } from './Data/Message';
import { ParserState } from './Data/ParserState';
export declare class Encoder {
    readonly stream: BitStream;
    readonly parserState: ParserState;
    constructor(stream: BitStream);
    encodeHeader(header: Header): void;
    writeMessage(message: Message): void;
    protected handleMessage(message: Message): void;
}
