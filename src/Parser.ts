import {BitStream} from 'bit-buffer';
import {Header} from './Data/Header';
import {Message, MessageHandler, MessageType, PacketMessage} from './Data/Message';
import {Packet, PacketTypeId} from './Data/Packet';
import {ParserState} from './Data/ParserState';
import {ConsoleCmdHandler} from './Parser/Message/ConsoleCmd';
import {DataTableHandler} from './Parser/Message/DataTable';
import {PacketMessageHandler} from './Parser/Message/Packet';
import {StopHandler} from './Parser/Message/Stop';
import {StringTableHandler} from './Parser/Message/StringTable';
import {SyncTickHandler} from './Parser/Message/SyncTick';
import {UserCmdHandler} from './Parser/Message/UserCmd';
import {parseHeader} from './Parser/Header';

export const messageHandlers: Map<MessageType, MessageHandler<Message>> = new Map<MessageType, MessageHandler<Message>>([
	[MessageType.Sigon, PacketMessageHandler],
	[MessageType.Packet, PacketMessageHandler],
	[MessageType.ConsoleCmd, ConsoleCmdHandler],
	[MessageType.UserCmd, UserCmdHandler],
	[MessageType.DataTables, DataTableHandler],
	[MessageType.StringTables, StringTableHandler],
	[MessageType.SyncTick, SyncTickHandler],
	[MessageType.Stop, StopHandler]
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
			this.header = parseHeader(this.stream);
		}
		return this.header;
	}

	public * getPackets(): IterableIterator<Packet> {
		// ensure that we are past the header
		this.getHeader();
		for (const message of this.iterateMessages()) {
			yield* this.handleMessage(message);
		}
	}

	protected * iterateMessages(): Iterable<Message> {
		while (true) {
			const message = this.readMessage(this.stream, this.parserState);
			yield message;
			if (message.type === MessageType.Stop) {
				return;
			}
		}
	}

	public * getMessages(): IterableIterator<Message> {
		// ensure that we are past the header
		this.getHeader();
		for (const message of this.iterateMessages()) {
			for (const _ of this.handleMessage(message)) {
				//noop
			}
			// console.log(message.type);
			yield message;
		}
	}

	protected * handleMessage(message: Message): Iterable<Packet> {
		this.parserState.handleMessage(message);
		if (message.type === MessageType.Packet) {
			for (const packet of message.packets) {
				this.parserState.handlePacket(packet);
				yield packet;
			}
		}
	}

	protected readMessage(stream: BitStream, state: ParserState): Message {
		if (stream.bitsLeft < 8) {
			throw new Error('Stream ended without stop packet');
		}
		const type: MessageType = stream.readUint8();
		if (type === 0) {
			return {
				type: MessageType.Stop,
				rawData: stream.readBitStream(0)
			};
		}
		const handler = messageHandlers.get(type);
		if (!handler) {
			throw new Error(`No handler for message of type ${MessageType[type]}(${type})`);
		}
		return handler.parseMessage(this.stream, state);
	}
}
