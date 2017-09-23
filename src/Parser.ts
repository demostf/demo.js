import {BitStream} from 'bit-buffer';
import {EventEmitter} from 'events';
import {Header} from './Data/Header';
import {Match} from './Data/Match';
import {ConsoleCmdHandler} from './Parser/Message/ConsoleCmd';
import {DataTableHandler} from './Parser/Message/DataTable';
import {PacketMessageHandler} from './Parser/Message/Packet';
import {StringTableHandler} from './Parser/Message/StringTable';
import {UserCmdHandler} from './Parser/Message/UserCmd';
import {PacketTypeId} from './Data/Packet';
import {Message, MessageHandler, MessageType, PacketMessage} from './Data/Message';

const messageHandlers: Map<MessageType, MessageHandler<Message>> = new Map<MessageType, MessageHandler<Message>>([
	[MessageType.Sigon, PacketMessageHandler],
	[MessageType.Packet, PacketMessageHandler],
	[MessageType.ConsoleCmd, ConsoleCmdHandler],
	[MessageType.UserCmd, UserCmdHandler],
	[MessageType.DataTables, DataTableHandler],
	[MessageType.StringTables, StringTableHandler],
]);

export class Parser extends EventEmitter {
	public stream: BitStream;
	public match: Match;
	protected skipPackets: PacketTypeId[];

	public viewOrigin: number[][] = [[], []];
	public viewAngles: number[][] = [[], []];

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
		const messages = this.getMessages();
		for (const message of messages) {
			this.handleMessage(message);
		}
		this.emit('done', this.match);
		return this.match;
	}

	private * getMessages(): Iterable<Message> {
		let hasNext: boolean = true;
		while (hasNext) {
			const message = this.readMessage(this.stream, this.match);
			if (!message) {
				hasNext = false;
			} else {
				yield message;
			}
		}
	}

	public tick() {
		const message = this.readMessage(this.stream, this.match);
		if (message) {
			this.handleMessage(message);
		}
		return !!message;
	}

	protected parseMessage(data: BitStream, type: MessageType, tick: number, match: Match): Message {
		const handler = messageHandlers.get(type);
		if (!handler) {
			throw new Error(`No handler for message of type ${MessageType[type]}`);
		}
		return handler.parseMessage(data, tick, match.parserState);
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

	protected handleMessage(message: Message) {
		this.match.parserState.handleMessage(message);
		if (message.type === MessageType.Packet) {
			for (const packet of (message as PacketMessage).packets) {
				this.match.parserState.handlePacket(packet);
				this.emit('packet', packet);
			}
		}
	}

	protected readMessage(stream: BitStream, match: Match): Message | false {
		if (stream.bitsLeft < 8) {
			return false;
		}
		const type: MessageType = stream.readBits(8);
		if (type === MessageType.Stop) {
			return false;
		}
		const tick = stream.readInt32();

		switch (type) {
			case MessageType.Sigon:
			case MessageType.Packet:
				this.stream.readInt32(); // flags
				for (let j = 0; j < 2; j++) {
					for (let i = 0; i < 3; i++) {
						this.viewOrigin[j][i] = this.stream.readFloat32();
					}
					for (let i = 0; i < 3; i++) {
						this.viewAngles[j][i] = this.stream.readFloat32();
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
				return {
					type: MessageType.SyncTick,
					tick,
					rawData: stream.readBitStream(0)
				};
		}

		const length = stream.readInt32();
		const buffer = stream.readBitStream(length * 8);
		return this.parseMessage(buffer, type, tick, match);
	}
}
