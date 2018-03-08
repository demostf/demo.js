import {BitStream} from 'bit-buffer';
import {GameEventDefinition} from './GameEvent';
import {GameEvent, GameEventType} from './GameEventTypes';
import {EntityId, PacketEntity} from './PacketEntity';
import {Game} from './ParserState';
import {SendTable} from './SendTable';
import {ServerClass} from './ServerClass';
import {StringTable, StringTableEntry} from './StringTable';
import {
	BreakModelPumpkinPacket, ResetHUDPacket, SayText2Packet, TextMessagePacket, TrainPacket,
	UnknownUserMessagePacket, UserMessagePacket,
	UserMessageType, UserMessageTypeMap, VoiceSubtitlePacket
} from './UserMessage';
import {Vector} from './Vector';

export interface StringTablePacket {
	packetType: 'stringTable';
	tables: StringTable[];
}

export interface CreateStringTablePacket {
	packetType: 'createStringTable';
	table: StringTable;
}

export interface UpdateStringTablePacket {
	packetType: 'updateStringTable';
	entries: StringTableEntry[];
	tableId: number;
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
	entries: Array<{
		classId: number;
		className: string;
		dataTableName: string;
	}>;
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
	eventList: Map<number, GameEventDefinition<GameEvent['name']>>;
}

export interface PacketEntitiesPacket {
	packetType: 'packetEntities';
	entities: PacketEntity[];
	removedEntities: EntityId[];
	maxEntries: number;
	delta: number;
	baseLine: number;
	updatedBaseLine: boolean;
}

export interface ParseSoundsPacket {
	packetType: 'parseSounds';
	reliable: boolean;
	num: number;
	length: number;
	data: BitStream;
}

export interface SetConVarPacket {
	packetType: 'setConVar';
	vars: Map<string, string>;
}

export interface TempEntitiesPacket {
	packetType: 'tempEntities';
	entities: PacketEntity[];
}

export interface VoiceInitPacket {
	packetType: 'voiceInit';
	codec: string;
	quality: number;
	extraData: number;
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

export interface VoidPacket {
	packetType: 'void';
}

export interface FilePacket {
	packetType: 'file';
	transferId: number;
	fileName: string;
	requested: boolean;
}

export interface NetTickPacket {
	packetType: 'netTick';
	tick: number;
	frameTime: number;
	stdDev: number;
}

export interface StringCmdPacket {
	packetType: 'stringCmd';
	command: string;
}

export interface SigOnStatePacket {
	packetType: 'sigOnState';
	state: number;
	count: number;
}

export interface PrintPacket {
	packetType: 'print';
	value: string;
}

export interface ServerInfoPacket {
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
	game: Game;
	skybox: string;
	serverName: string;
	replay: boolean;
}

export interface SetPausePacket {
	packetType: 'setPause';
	paused: boolean;
}

export interface SetViewPacket {
	packetType: 'setView';
	index: number;
}

export interface FixAnglePacket {
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

export type PacketType = Packet['packetType'];

export type PacketMapType = {
	bspDecal: BSPDecalPacket;
	stringTable: StringTablePacket;
	createStringTable: CreateStringTablePacket;
	updateStringTable: UpdateStringTablePacket;
	dataTable: DataTablePacket;
	classInfo: ClassInfoPacket;
	entityMessage: EntityMessagePacket;
	gameEvent: GameEventPacket;
	gameEventList: GameEventListPacket;
	packetEntities: PacketEntitiesPacket;
	parseSounds: ParseSoundsPacket;
	setConVar: SetConVarPacket;
	tempEntities: TempEntitiesPacket;
	userMessage: UserMessagePacket;
	voiceInit: VoiceInitPacket;
	voiceData: VoiceDataPacket;
	menu: MenuPacket;
	consoleCmd: ConsoleCmdPacket;
	cmdKeyValues: CmdKeyValuesPacket;
	'void': VoidPacket;
	file: FilePacket;
	netTick: NetTickPacket;
	stringCmd: StringCmdPacket;
	sigOnState: SigOnStatePacket;
	print: PrintPacket;
	serverInfo: ServerInfoPacket;
	setPause: SetPausePacket;
	setView: SetViewPacket;
	fixAngle: FixAnglePacket;
	preFetch: PreFetchPacket;
	getCvarValue: GetCvarValuePacket;
} & UserMessageTypeMap;

export enum PacketTypeId {
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
	cmdKeyValues = 32
}
