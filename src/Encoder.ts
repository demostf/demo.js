import {BitStream} from 'bit-buffer';
import {Header} from './Data/Header';
import {Message, MessageType} from './Data/Message';
import {ParserState} from './Data/ParserState';
import {messageHandlers} from './Parser';

export class Encoder {
	public readonly stream: BitStream;
	public readonly parserState: ParserState;

	constructor(stream: BitStream) {
		this.stream = stream;
		this.parserState = new ParserState();
	}

	public encodeHeader(header: Header) {
		this.stream.writeASCIIString(header.type, 8);
		this.stream.writeUint32(header.version);
		this.stream.writeUint32(header.protocol);
		this.stream.writeASCIIString(header.server, 260);
		this.stream.writeASCIIString(header.nick, 260);
		this.stream.writeASCIIString(header.map, 260);
		this.stream.writeASCIIString(header.game, 260);
		this.stream.writeFloat32(header.duration);
		this.stream.writeUint32(header.ticks);
		this.stream.writeUint32(header.frames);
		this.stream.writeUint32(header.sigon);
	}

	public writeMessage(message: Message) {
		this.stream.writeUint8(message.type);
		const handler = messageHandlers.get(message.type);
		if (!handler) {
			throw new Error(`No handler for message of type ${MessageType[message.type]}`);
		}
		handler.encodeMessage(message, this.stream, this.parserState);
		this.handleMessage(message);
	}

	protected handleMessage(message: Message) {
		this.parserState.handleMessage(message);
		if (message.type === MessageType.Packet) {
			for (const packet of message.packets) {
				this.parserState.handlePacket(packet);
			}
		}
	}
}
