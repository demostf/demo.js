import {BitStream} from 'bit-buffer';
import {GameEventDefinition} from './GameEvent';
import {EntityId} from './PacketEntity';
import {SendTable, SendTableName} from './SendTable';
import {ServerClass, ServerClassId} from './ServerClass';
import {StringTable} from './StringTable';
import {GameEventType} from './GameEventTypes';
import {SendProp} from './SendProp';
import {Packet, PacketTypeId} from './Packet';
import {
	handleStringTable, handleStringTables, handleStringTableUpdate,
	handleTable
} from '../PacketHandler/StringTable';
import {handleGameEventList} from '../PacketHandler/GameEventList';
import {DataTablesMessage, Message, MessageType, StringTablesMessage} from './Message';

export class ParserState {
	public version: number = 0;
	public staticBaseLines: Map<ServerClassId, BitStream> = new Map();
	public staticBaselineCache: Map<ServerClassId, SendProp[]> = new Map();
	public eventDefinitions: Map<number, GameEventDefinition<GameEventType>> = new Map();
	public entityClasses: Map<EntityId, ServerClass> = new Map();
	public sendTables: Map<SendTableName, SendTable> = new Map();
	public stringTables: StringTable[] = [];
	public serverClasses: ServerClass[] = [];
	public instanceBaselines: [Map<EntityId, SendProp[]>, Map<EntityId, SendProp[]>] = [new Map(), new Map()];
	public skippedPackets: PacketTypeId[] = [];
	public userInfoEntries: Map<string, BitStream> = new Map();

	public handlePacket(packet: Packet) {
		switch (packet.packetType) {
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

	public getStringTable(name: string): StringTable | null {
		const table = this.stringTables.find(table => table.name === name);
		if (!table) {
			return null;
		}
		return table;
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
