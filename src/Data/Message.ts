import {Packet} from './Packet';
import {BitStream} from 'bit-buffer';
import {ServerClass} from './ServerClass';
import {SendTable} from './SendTable';
import {StringTable} from './StringTable';
import {ParserState} from './ParserState';

export enum MessageType {
	Sigon = 1,
	Packet = 2,
	SyncTick = 3,
	ConsoleCmd = 4,
	UserCmd = 5,
	DataTables = 6,
	Stop = 7,
	StringTables = 8,
}

export interface BaseMessage {
	tick: number;
	rawData: BitStream;
}

export interface SigonMessage extends BaseMessage {
	type: MessageType.Sigon;
	packets: Packet[];
}

export interface PacketMessage extends BaseMessage {
	type: MessageType.Packet;
	packets: Packet[];
}

export interface SyncTickMessage extends BaseMessage {
	type: MessageType.SyncTick;
}

export interface ConsoleCmdMessage extends BaseMessage {
	type: MessageType.ConsoleCmd;
	command: string;
}

export interface UserCmdMessage extends BaseMessage {
	type: MessageType.UserCmd;
}

export interface DataTablesMessage extends BaseMessage {
	type: MessageType.DataTables;
	tables: SendTable[];
	serverClasses: ServerClass[]
}

export interface StopMessage extends BaseMessage {
	type: MessageType.Stop;
}

export interface StringTablesMessage extends BaseMessage {
	type: MessageType.StringTables;
	tables: StringTable[]
}

export type Message = SigonMessage |
	PacketMessage |
	SyncTickMessage |
	ConsoleCmdMessage |
	UserCmdMessage |
	DataTablesMessage |
	StopMessage |
	StringTablesMessage;

export interface MessageHandler<M extends Message> {
	parseMessage: (stream: BitStream, tick: number, state: ParserState) => M;
	encodeMessage: (message: M, stream: BitStream, state: ParserState) => void;
}
