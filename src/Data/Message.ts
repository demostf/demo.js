import {Packet} from './Packet';
import {BitStream} from 'bit-buffer';
import {ServerClass} from './ServerClass';
import {SendTable} from './SendTable';
import {StringTable} from './StringTable';
import {ParserState} from './ParserState';
import {Vector} from './Vector';

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

export interface PacketMessage extends BaseMessage {
	type: MessageType.Packet;
	packets: Packet[];
	viewOrigin: [Vector, Vector];
	viewAngles: [Vector, Vector];
	localViewAngles: [Vector, Vector];
	sequenceIn: number;
	sequenceOut: number;
	flags: number;
}

export interface SigonMessage extends PacketMessage {
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
	sequenceOut: number;
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
	parseMessage: (stream: BitStream, state: ParserState) => M;
	encodeMessage: (message: M, stream: BitStream, state: ParserState) => void;
}
