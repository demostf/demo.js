import {BitStream} from 'bit-buffer';
import {EventEmitter} from 'events';
import {Header} from './Data/Header';
import {Match} from './Data/Match';
import {ConsoleCmd} from './Parser/Message/ConsoleCmd';
import {DataTable} from './Parser/Message/DataTable';
import {Packet} from './Parser/Message/Packet';
import {Parser as MessageParser} from './Parser/Message/Parser';
import {StringTable} from './Parser/Message/StringTable';
import {UserCmd} from './Parser/Message/UserCmd';
import {PacketTypeId} from './Data/Packet';

export class Parser extends EventEmitter {
	public stream: BitStream;
	public match: Match;
	protected skipPackets: PacketTypeId[];

	constructor(stream: BitStream, skipPackets: PacketTypeId[] = []) {
		super();
		this.stream = stream;
		this.match = new Match();
		this.on('packet', this.match.handlePacket.bind(this.match));
		this.skipPackets = skipPackets;
	}

	public readHeader() {
		return this.parseHeader(this.stream);
	}

	public parseBody() {
		let hasNext = true;
		while (hasNext) {
			hasNext = this.tick();
		}
		this.emit('done', this.match);
		return this.match;
	}

	public tick() {
		const message = this.readMessage(this.stream, this.match);
		if (message instanceof MessageParser) {
			this.handleMessage(message);
		}
		return !!message;
	}

	protected parseMessage(data: BitStream, type: MessageType, tick: number, length: number, match: Match): MessageParser {

		switch (type) {
			case MessageType.Sigon:
			case MessageType.Packet:
				return new Packet(type, tick, data, length, match, this.skipPackets);
			case MessageType.ConsoleCmd:
				return new ConsoleCmd(type, tick, data, length, match, this.skipPackets);
			case MessageType.UserCmd:
				return new UserCmd(type, tick, data, length, match, this.skipPackets);
			case MessageType.DataTables:
				return new DataTable(type, tick, data, length, match, this.skipPackets);
			case MessageType.StringTables:
				return new StringTable(type, tick, data, length, match, this.skipPackets);
			default:
				throw new Error('unknown message type');
		}
	}

	protected parseHeader(stream): Header {
		return {
			type: stream.readASCIIString(8),
			version: stream.readInt32(),
			protocol: stream.readInt32(),
			server: stream.readASCIIString(260),
			nick: stream.readASCIIString(260),
			map: stream.readASCIIString(260),
			game: stream.readASCIIString(260),
			duration: stream.readFloat32(),
			ticks: stream.readInt32(),
			frames: stream.readInt32(),
			sigon: stream.readInt32(),
		};
	}

	protected handleMessage(message: MessageParser) {
		if (message.parse) {
			const packets = message.parse();
			for (const packet of packets) {
				if (packet) {
					this.emit('packet', packet);
				}
			}
		}
	}

	protected readMessage(stream: BitStream, match: Match): MessageParser | boolean {
		if (stream.bitsLeft < 8) {
			return false;
		}
		const type: MessageType = stream.readBits(8);
		if (type === MessageType.Stop) {
			return false;
		}
		const tick = stream.readInt32();

		const viewOrigin: number[][] = [];
		const viewAngles: number[][] = [];

		switch (type) {
			case MessageType.Sigon:
			case MessageType.Packet:
				this.stream.readInt32(); // flags
				for (let j = 0; j < 2; j++) {
					viewOrigin[j] = [];
					viewAngles[j] = [];
					for (let i = 0; i < 3; i++) {
						viewOrigin[j][i] = this.stream.readInt32();
					}
					for (let i = 0; i < 3; i++) {
						viewAngles[j][i] = this.stream.readInt32();
					}
					for (let i = 0; i < 3; i++) {
						this.stream.readInt32(); // local viewAngles
					}
				}
				this.stream.readInt32(); // sequence in
				this.stream.readInt32(); // sequence out
				break;
			case MessageType.UserCmd:
				stream.byteIndex += 0x04; // unknown / outgoing sequence
				break;
			case MessageType.SyncTick:
				return true;
		}

		const length = stream.readInt32();
		const buffer = stream.readBitStream(length * 8);
		return this.parseMessage(buffer, type, tick, length, match);
	}
}

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
