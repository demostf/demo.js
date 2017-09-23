import {BitStream} from 'bit-buffer';
import {Packet, PacketTypeId} from '../../Data/Packet';
import {MessageType} from '../../Data/Message';
import {ParserState} from '../../Data/ParserState';

export abstract class Parser {
	protected type: any;
	protected tick: number;
	protected stream: BitStream;
	protected length: number;
	protected state: ParserState;
	protected skippedPackets: PacketTypeId[];

	constructor(type: MessageType, tick: number, stream: BitStream, length: number, state: ParserState, skippedPacket: PacketTypeId[] = []) {
		this.type = type;
		this.tick = tick;
		this.stream = stream;
		this.length = length; // length in bytes
		this.state = state;
		this.skippedPackets = skippedPacket;
	}

	public abstract parse(): Packet[];
}
