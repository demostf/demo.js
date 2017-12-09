import {BitStream} from 'bit-buffer';
import {Message, MessageType} from './Data/Message';
import {Packet} from './Data/Packet';
import {Encoder} from './Encoder';
import {Parser} from './Parser';

export type PacketTransform = (packet: Packet) => Packet;

export type MessageTransform = (message: Message) => Message;

export function nullTransform<T extends Packet | Message>(input: T): T {
	return input;
}

export class Transformer extends Parser {
	private readonly encoder: Encoder;

	constructor(sourceStream: BitStream, targetStream: BitStream) {
		super(sourceStream);
		this.encoder = new Encoder(targetStream);
	}

	public transform(packetTransform: PacketTransform, messageTransform: MessageTransform) {
		this.encoder.encodeHeader(this.getHeader());

		for (const message of this.iterateMessages()) {
			this.parserState.handleMessage(message);
			if (message.type === MessageType.Packet) {
				for (const packet of message.packets) {
					this.parserState.handlePacket(packet);
				}
				message.packets = message.packets.map(packetTransform);
			}

			this.encoder.writeMessage(messageTransform(message));
		}
	}
}
