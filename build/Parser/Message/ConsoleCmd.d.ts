import { ConsoleCmdMessage, MessageHandler } from '../../Data/Message';
import { ConsoleCmdPacket } from '../../Data/Packet';
import { Parser } from './Parser';
export declare class ConsoleCmd extends Parser {
    parse(): ConsoleCmdPacket[];
}
export declare const ConsoleCmdHandler: MessageHandler<ConsoleCmdMessage>;
