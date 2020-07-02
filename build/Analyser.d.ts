/// <reference types="node" />
import { EventEmitter } from 'events';
import { Header } from './Data/Header';
import { Match } from './Data/Match';
import { Message } from './Data/Message';
import { Packet } from './Data/Packet';
import { Parser } from './Parser';
export declare class Analyser extends EventEmitter {
    readonly match: Match;
    private readonly parser;
    private analysed;
    constructor(parser: Parser);
    getHeader(): Header;
    getBody(): Match;
    getPackets(): IterableIterator<Packet>;
    getMessages(): IterableIterator<Message>;
}
