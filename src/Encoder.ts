import {BitStream} from 'bit-buffer';
import {Header} from './Data/Header';
import {Message, MessageType} from './Data/Message';
import {ParserState} from './Data/ParserState';
import {messageHandlers} from './Parser';
import {encodeHeader} from './Parser/Header';

export class Encoder {
	public readonly stream: BitStream;
	public readonly parserState: ParserState;

	constructor(stream: BitStream) {
		this.stream = stream;
		this.parserState = new ParserState();
	}

	public encodeHeader(header: Header) {
		encodeHeader(header, this.stream);
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
