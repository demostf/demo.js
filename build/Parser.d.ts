import { BitStream } from 'bit-buffer';
import { Header } from './Data/Header';
import { Message, MessageHandler, MessageType } from './Data/Message';
import { Packet, PacketTypeId } from './Data/Packet';
import { ParserState } from './Data/ParserState';
export declare const messageHandlers: Map<MessageType, MessageHandler<Message>>;
export declare class Parser {
    readonly stream: BitStream;
    readonly parserState: ParserState;
    private header;
    private lastMessage;
    constructor(stream: BitStream, skipPackets?: PacketTypeId[]);
    getHeader(): Header;
    getPackets(): IterableIterator<Packet>;
    getMessages(): IterableIterator<Message>;
    protected iterateMessages(): Iterable<Message>;
    protected handleMessage(message: Message): Iterable<Packet>;
    protected readMessage(stream: BitStream, state: ParserState): Message;
}
