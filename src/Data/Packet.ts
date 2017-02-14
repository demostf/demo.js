import {StringTable} from "./StringTable";
import {Vector} from "./Vector";
import {GameEvent, GameEventDefinitionMap} from "./GameEvent";
import {PacketEntity} from "./PacketEntity";

export interface StringTablePacket {
	packetType: 'stringTable';
	tables: StringTable[];
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

export type UserMessagePacket = SayText2Packet | TextMessagePacket | UnknownUserMessagePacket;

export type Packet = BSPDecalPacket |
	StringTablePacket |
	ClassInfoPacket |
	EntityMessagePacket |
	GameEventPacket |
	GameEventListPacket |
	PacketEntitiesPacket |
	ParseSoundsPacket |
	SetConVarPacket |
	TempEntitiesPacket |
	UserMessagePacket;
