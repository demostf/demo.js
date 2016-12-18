import toBuffer =  require('typedarray-to-buffer');
import {Packet} from './Parser/Message/Packet';
import {ConsoleCmd} from './Parser/Message/ConsoleCmd';
import {StringTable} from './Parser/Message/StringTable';
import {DataTable} from './Parser/Message/DataTable';
import {UserCmd} from './Parser/Message/UserCmd';
import {BitStream} from 'bit-buffer';
import {EventEmitter} from 'events';
import {Match} from './Data/Match';
import {Packet as IPacket} from "./Data/Packet";
import {Parser as MessageParser} from './Parser/Message/Parser';

export class Parser extends EventEmitter {
	stream: BitStream;
	packets: IPacket[];
	match: Match;

	constructor(stream: BitStream) {
		super();
		this.stream  = stream;
		this.packets = [];
		this.match   = new Match();
		this.on('packet', this.match.handlePacket.bind(this.match));
		this.on('packet', function (packet) {
			this.packets.push(packet);
		});
	}

	readHeader() {
		return this.parseHeader(this.stream);
	}

	parseHeader(stream) {
		return {
			'type':     stream.readASCIIString(8),
			'version':  stream.readInt32(),
			'protocol': stream.readInt32(),
			'server':   stream.readASCIIString(260),
			'nick':     stream.readASCIIString(260),
			'map':      stream.readASCIIString(260),
			'game':     stream.readASCIIString(260),
			'duration': stream.readFloat32(),
			'ticks':    stream.readInt32(),
			'frames':   stream.readInt32(),
			'sigon':    stream.readInt32()
		}
	}

	parseBody() {
		let message;
		while (message = this.readMessage(this.stream, this.match)) {
			if (message instanceof MessageParser) {
				this.handleMessage(message);
			}
		}
		this.emit('done', this.match);
		return this.match;
	}

	parseMessage(buffer: ArrayBuffer, type: MessageType, tick: number, length: number, match: Match): MessageParser {
		const data = new BitStream(buffer);

		switch (type) {
			case MessageType.Sigon:
			case MessageType.Packet:
				return new Packet(type, tick, data, length, match);
			case MessageType.ConsoleCmd:
				return new ConsoleCmd(type, tick, data, length, match);
			case MessageType.UserCmd:
				return new UserCmd(type, tick, data, length, match);
			case MessageType.DataTables:
				return new DataTable(type, tick, data, length, match);
			case MessageType.StringTables:
				return new StringTable(type, tick, data, length, match);
			default:
				throw new Error("unknown message type");
		}
	}

	handleMessage(message: MessageParser) {
		if (message.parse) {
			const packets = message.parse();
			for (let i = 0; i < packets.length; i++) {
				const packet = packets[i];
				if (packet) {
					this.emit('packet', packet);
				}
			}
		}
	}

	readMessage(stream, match): MessageParser|boolean {
		const type: MessageType = stream.readBits(8);
		if (type === MessageType.Stop) {
			return false;
		}
		const tick = stream.readInt32();
		let start, length, buffer;

		let viewOrigin: number[][] = [];
		let viewAngles: number[][] = [];

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

		length = stream.readInt32();
		start  = stream.byteIndex;
		buffer = toBuffer(stream._view._view.slice(start, start + length));
		stream.byteIndex += length;
		return this.parseMessage(buffer, type, tick, length, match);
	}
}

export enum MessageType {
	Sigon        = 1,
	Packet       = 2,
	SyncTick     = 3,
	ConsoleCmd   = 4,
	UserCmd      = 5,
	DataTables   = 6,
	Stop         = 7,
	StringTables = 8
}
