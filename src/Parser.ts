import {BitStream} from 'bit-buffer';
import {Header} from './Data/Header';
import {ConsoleCmdHandler} from './Parser/Message/ConsoleCmd';
import {DataTableHandler} from './Parser/Message/DataTable';
import {PacketMessageHandler} from './Parser/Message/Packet';
import {StringTableHandler} from './Parser/Message/StringTable';
import {UserCmdHandler} from './Parser/Message/UserCmd';
import {Packet, PacketTypeId} from './Data/Packet';
import {Message, MessageHandler, MessageType, PacketMessage} from './Data/Message';
import {ParserState} from './Data/ParserState';
import {SyncTickHandler} from './Parser/Message/SyncTick';

const messageHandlers: Map<MessageType, MessageHandler<Message>> = new Map<MessageType, MessageHandler<Message>>([
	[MessageType.Sigon, PacketMessageHandler],
	[MessageType.Packet, PacketMessageHandler],
	[MessageType.ConsoleCmd, ConsoleCmdHandler],
	[MessageType.UserCmd, UserCmdHandler],
	[MessageType.DataTables, DataTableHandler],
	[MessageType.StringTables, StringTableHandler],
	[MessageType.SyncTick, SyncTickHandler]
]);

export class Parser {
	public readonly stream: BitStream;
	public readonly parserState: ParserState;
	private header: Header | null = null;

	constructor(stream: BitStream, skipPackets: PacketTypeId[] = []) {
		this.stream = stream;
		this.parserState = new ParserState();
		this.parserState.skippedPackets = skipPackets;
	}

	public getHeader() {
		if (!this.header) {
			this.header = this.parseHeader(this.stream);
		}
		return this.header;
	}

	public * getPackets(): Iterable<Packet> {
		// ensure that we are past the header
		this.getHeader();
		const messages = this.getMessages();
		for (const message of messages) {
			yield* this.handleMessage(message);
		}
	}

	private * getMessages(): Iterable<Message> {
		let hasNext: boolean = true;
		while (hasNext) {
			const message = this.readMessage(this.stream, this.parserState);
			if (!message) {
				hasNext = false;
			} else {
				yield message;
			}
		}
	}

	protected parseMessage(data: BitStream, type: MessageType, state: ParserState): Message {
		const handler = messageHandlers.get(type);
		if (!handler) {
			throw new Error(`No handler for message of type ${MessageType[type]}`);
		}
		return handler.parseMessage(data, state);
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

	protected * handleMessage(message: Message): Iterable<Packet> {
		this.parserState.handleMessage(message);
		if (message.type === MessageType.Packet) {
			for (const packet of (message as PacketMessage).packets) {
				this.parserState.handlePacket(packet);
				yield packet;
			}
		}
	}

	protected readMessage(stream: BitStream, state: ParserState): Message | false {
		if (stream.bitsLeft < 8) {
			return false;
		}
		const type: MessageType = stream.readUint8();
		if (type === MessageType.Stop) {
			return false;
		}

		return this.parseMessage(stream, type, state);
	}
}
