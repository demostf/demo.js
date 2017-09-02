import {BitStream} from 'bit-buffer';
import {GameEventDefinition} from './GameEvent';
import {PacketEntity} from './PacketEntity';
import {SendTable} from './SendTable';
import {ServerClass} from './ServerClass';
import {StringTable, StringTableEntry} from './StringTable';
import {Vector} from './Vector';
import {GameEvent, GameEventType} from './GameEventTypes';

export interface BasePacket {
}

export interface StringTablePacket extends BasePacket {
	packetType: 'stringTable';
	tables: StringTable[];
}

export interface CreateStringTablePacket extends BasePacket {
	packetType: 'createStringTable';
	table: StringTable;
}

export interface UpdateStringTablePacket extends BasePacket {
	packetType: 'updateStringTable';
	entries: StringTableEntry[];
	tableId: number;
}

export interface ConsoleCmdPacket extends BasePacket {
	packetType: 'consoleCmd';
	command: string;
}

export interface DataTablePacket extends BasePacket {
	packetType: 'dataTable';
	tables: SendTable[];
	serverClasses: ServerClass[];
}

export interface BSPDecalPacket extends BasePacket {
	packetType: 'bspDecal';
	position: Vector;
	textureIndex: number;
	entIndex: number;
	modelIndex: number;
	lowPriority: boolean;
}

export interface ClassInfoPacket extends BasePacket {
	packetType: 'classInfo';
	number: number;
	create: boolean;
	entries: {
		classId: number;
		className: string;
		dataTableName: string;
	}[];
}

export interface EntityMessagePacket extends BasePacket {
	packetType: 'entityMessage';
	classId: number;
	length: number;
	data: string;
}

export interface GameEventPacket extends BasePacket {
	packetType: 'gameEvent';
	event: GameEvent;
}

export interface GameEventListPacket extends BasePacket {
	packetType: 'gameEventList';
	eventList: Map<number, GameEventDefinition<GameEvent['name']>>;
}

export interface PacketEntitiesPacket extends BasePacket {
	packetType: 'packetEntities';
	entities: PacketEntity[];
	removedEntities: number[];
	maxEntries: number;
	isDelta: boolean;
	delta: number;
	baseLine: number;
	updatedEntries: number;
	length: number;
	updatedBaseLine: boolean;
}

export interface ParseSoundsPacket extends BasePacket {
	packetType: 'parseSounds';
	reliable: boolean;
	num: number;
	length: number;
	data: BitStream;
}

export interface SetConVarPacket extends BasePacket {
	packetType: 'setConVar';
	vars: Map<string, string>;
}

export interface TempEntitiesPacket extends BasePacket {
	packetType: 'tempEntities';
	entities: PacketEntity[];
}

export interface SayText2Packet extends BasePacket {
	packetType: 'sayText2';
	client: number;
	raw: number;
	kind: string;
	from: string;
	text: string;
}

export interface TextMessagePacket extends BasePacket {
	packetType: 'textMsg';
	destType: number;
	text: string;
}

export interface UnknownUserMessagePacket extends BasePacket {
	packetType: 'unknownUserMessage';
	type: number;
	data: BitStream;
}

export interface VoiceInitPacket extends BasePacket {
	packetType: 'voiceInit';
	codec: string;
	quality: number;
	extraData: number;
}

export interface VoiceDataPacket extends BasePacket {
	packetType: 'voiceData';
	client: number;
	proximity: number;
	length: number;
	data: BitStream;
}

export interface MenuPacket extends BasePacket {
	packetType: 'menu';
	type: number;
	length: number;
	data: BitStream;
}

export interface CmdKeyValuesPacket extends BasePacket {
	packetType: 'cmdKeyValues';
	length: number;
	data: BitStream;
}

export interface VoidPacket extends BasePacket {
	packetType: 'void';
}

export interface FilePacket extends BasePacket {
	packetType: 'file';
	transferId: number;
	fileName: string;
	requested: boolean;
}

export interface NetTickPacket extends BasePacket {
	packetType: 'netTick';
	tick: number;
	frameTime: number;
	stdDev: number;
}

export interface StringCmdPacket extends BasePacket {
	packetType: 'stringCmd';
	command: string;
}

export interface SigOnStatePacket extends BasePacket {
	packetType: 'sigOnState';
	state: number;
	count: number;
}

export interface PrintPacket extends BasePacket {
	packetType: 'print';
	value: string;
}

export interface ServerInfoPacket extends BasePacket {
	packetType: 'serverInfo';
	version: number;
	serverCount: number;
	stv: boolean;
	dedicated: boolean;
	maxCrc: number;
	maxClasses: number;
	mapHash: number;
	playerCount: number;
	maxPlayerCount: number;
	intervalPerTick: number;
	platform: string;
	game: string;
	skybox: string;
	serverName: string;
	replay: boolean;
}

export interface SetPausePacket extends BasePacket {
	packetType: 'setPause';
	paused: boolean;
}

export interface SetViewPacket extends BasePacket {
	packetType: 'setView';
	index: number;
}

export interface FixAnglePacket extends BasePacket {
	packetType: 'fixAngle';
	relative: boolean;
	x: number;
	y: number;
	z: number;
}

export interface PreFetchPacket {
	packetType: 'preFetch';
	index: number;
}

export interface GetCvarValuePacket {
	packetType: 'getCvarValue';
	cookie: number;
	value: string;
}

export type UserMessagePacket = SayText2Packet | TextMessagePacket | UnknownUserMessagePacket;

export type Packet = BSPDecalPacket |
	StringTablePacket |
	CreateStringTablePacket |
	UpdateStringTablePacket |
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
	CmdKeyValuesPacket |
	VoidPacket |
	FilePacket |
	NetTickPacket |
	StringCmdPacket |
	SigOnStatePacket |
	PrintPacket |
	ServerInfoPacket |
	SetPausePacket |
	SetViewPacket |
	FixAnglePacket |
	PreFetchPacket |
	GetCvarValuePacket;

export enum PacketType {
	file = 2,
	netTick = 3,
	stringCmd = 4,
	setConVar = 5,
	sigOnState = 6,
	print = 7,
	serverInfo = 8,
	classInfo = 10,
	setPause = 11,
	createStringTable = 12,
	updateStringTable = 13,
	voiceInit = 14,
	voiceData = 15,
	parseSounds = 17,
	setView = 18,
	fixAngle = 19,
	bspDecal = 21,
	userMessage = 23,
	entityMessage = 24,
	gameEvent = 25,
	packetEntities = 26,
	tempEntities = 27,
	preFetch = 28,
	menu = 29,
	gameEventList = 30,
	getCvarValue = 31,
	cmdKeyValues = 32,
}
