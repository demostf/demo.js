import {StringTable} from "./StringTable";
import {Vector} from "./Vector";
import {GameEvent, GameEventDefinitionMap} from "./GameEvent";
import {PacketEntity} from "./PacketEntity";
import {SendTable} from "./SendTable";
import {ServerClass} from "./ServerClass";
import {BitStream} from "bit-buffer";

export interface StringTablePacket {
	packetType: 'stringTable';
	tables: StringTable[];
}

export interface ConsoleCmdPacket {
	packetType: 'consoleCmd';
	command: string;
}

export interface DataTablePacket {
	packetType: 'dataTable';
	tables: SendTable[];
	serverClasses: ServerClass[];
}

export interface BSPDecalPacket {
	packetType: 'bspDecal';
	position: Vector;
	textureIndex: number;
	entIndex: number;
	modelIndex: number;
	lowPriority: boolean;
}

export interface ClassInfoPacket {
	packetType: 'classInfo';
	number: number;
	create: boolean;
	entries: {
		classId: number;
		className: string;
		dataTableName: string;
	}[]
}

export interface EntityMessagePacket {
	packetType: 'entityMessage';
	classId: number;
	length: number;
	data: string;
}

export interface GameEventPacket {
	packetType: 'gameEvent';
	event: GameEvent;
}

export interface GameEventListPacket {
	packetType: 'gameEventList';
	eventList: GameEventDefinitionMap;
}

export interface PacketEntitiesPacket {
	packetType: 'packetEntities';
	entities: PacketEntity[];
	removedEntities: number[];
	maxEntries: number;
	isDelta: boolean;
	delta: number;
	baseLine : number;
	updatedEntries: number;
	length: number;
	updatedBaseLine: boolean;
}

export interface ParseSoundsPacket {
	packetType: 'parseSounds';
	reliable: boolean;
	num: number;
	length: number;
}

export interface SetConVarPacket {
	packetType: 'setConVar';
	vars: {[key: string]: string};
}

export interface TempEntitiesPacket {
	packetType: 'tempEntities';
	entities: PacketEntity[];
}

export interface SayText2Packet {
	packetType: 'sayText2';
	client: number;
	raw: number;
	kind: string;
	from: string;
	text: string;
}

export interface TextMessagePacket {
	packetType: 'textMsg';
	destType: number;
	text: string;
}

export interface UnknownUserMessagePacket {
	packetType: 'unknownUserMessage';
	type: number;
}

export interface VoiceInitPacket {
	packetType: 'voiceInit';
	codec: string;
	quality: number;
	extraData: number
}

export interface VoiceDataPacket {
	packetType: 'voiceData';
	client: number;
	proximity: number;
	length: number;
	data: BitStream;
}

export interface MenuPacket {
	packetType: 'menu';
	type: number;
	length: number;
	data: BitStream;
}

export interface CmdKeyValuesPacket {
	packetType: 'cmdKeyValues';
	length: number;
	data: BitStream;
}

export type UserMessagePacket = SayText2Packet | TextMessagePacket | UnknownUserMessagePacket;

export type Packet = BSPDecalPacket |
	StringTablePacket |
	DataTablePacket |
	ClassInfoPacket |
	EntityMessagePacket |
	GameEventPacket |
	GameEventListPacket |
	PacketEntitiesPacket |
	ParseSoundsPacket |
	SetConVarPacket |
	TempEntitiesPacket |
	UserMessagePacket |
	VoiceInitPacket |
	VoiceDataPacket |
	MenuPacket |
	ConsoleCmdPacket |
	CmdKeyValuesPacket;
