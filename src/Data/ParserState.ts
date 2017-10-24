import {BitStream} from 'bit-buffer';
import {handleGameEventList} from '../PacketHandler/GameEventList';
import {handlePacketEntitiesForState} from '../PacketHandler/PacketEntities';
import {
	handleStringTable, handleStringTables, handleStringTableUpdate,
	handleTable
} from '../PacketHandler/StringTable';
import {GameEventDefinition} from './GameEvent';
import {GameEventType} from './GameEventTypes';
import {DataTablesMessage, Message, MessageType, StringTablesMessage} from './Message';
import {Packet, PacketTypeId} from './Packet';
import {EntityId} from './PacketEntity';
import {SendProp} from './SendProp';
import {SendTable, SendTableName} from './SendTable';
import {ServerClass, ServerClassId} from './ServerClass';
import {StringTable} from './StringTable';

export class ParserState {
	public version: number = 0;
	public staticBaseLines: Map<ServerClassId, BitStream> = new Map();
	public staticBaselineCache: Map<ServerClassId, SendProp[]> = new Map();
	public eventDefinitions: Map<number, GameEventDefinition<GameEventType>> = new Map();
	public eventDefinitionTypes: Map<GameEventType, number> = new Map();
	public entityClasses: Map<EntityId, ServerClass> = new Map();
	public sendTables: Map<SendTableName, SendTable> = new Map();
	public stringTables: StringTable[] = [];
	public serverClasses: ServerClass[] = [];
	public instanceBaselines: [Map<EntityId, SendProp[]>, Map<EntityId, SendProp[]>] = [new Map(), new Map()];
	public skippedPackets: PacketTypeId[] = [];
	public userInfoEntries: Map<string, BitStream> = new Map();
	public tick: number = 0;

	public handlePacket(packet: Packet) {
		switch (packet.packetType) {
			case 'netTick':
				this.tick = packet.tick;
				break;
			case 'serverInfo':
				this.version = packet.version;
				break;
			case 'stringTable':
				handleStringTables(packet, this);
				break;
			case 'createStringTable':
				handleStringTable(packet, this);
				break;
			case 'updateStringTable':
				handleStringTableUpdate(packet, this);
				break;
			case 'gameEventList':
				handleGameEventList(packet, this);
				break;
			case 'packetEntities':
				handlePacketEntitiesForState(packet, this);
				break;
		}
	}

	public handleMessage(message: Message) {
		switch (message.type) {
			case MessageType.DataTables:
				this.handleDataTableMessage(message);
				break;
			case MessageType.StringTables:
				this.handleStringTableMessage(message);
				break;
		}
	}

	public getStringTable(name: string): StringTable | null {
		const table = this.stringTables.find((stringTable) => stringTable.name === name);
		if (!table) {
			return null;
		}
		return table;
	}

	private handleDataTableMessage(message: DataTablesMessage) {
		for (const table of message.tables) {
			this.sendTables.set(table.name, table);
		}
		this.serverClasses = message.serverClasses;
	}

	private handleStringTableMessage(message: StringTablesMessage) {
		for (const table of message.tables) {
			handleTable(table, this);
		}
	}
}

export function getClassBits(state: ParserState) {
	return Math.ceil(Math.log(state.serverClasses.length) * Math.LOG2E);
}

export function getSendTable(state: ParserState, dataTable: string): SendTable {
	const sendTable = state.sendTables.get(dataTable);
	if (!sendTable) {
		throw new Error(`Unknown sendTable ${dataTable}`);
	}
	return sendTable;
}

export function createParserState(): ParserState {
	return new ParserState();
}
