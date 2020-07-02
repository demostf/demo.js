import { BitStream } from 'bit-buffer';
import { Message } from './Data/Message';
import { Packet } from './Data/Packet';
import { Parser } from './Parser';
export declare type PacketTransform = (packet: Packet) => Packet;
export declare type MessageTransform = (message: Message) => Message;
export declare function nullTransform<T extends Packet | Message>(input: T): T;
export declare class Transformer extends Parser {
    private readonly encoder;
    constructor(sourceStream: BitStream, targetStream: BitStream);
    transform(packetTransform: PacketTransform, messageTransform: MessageTransform): void;
}
