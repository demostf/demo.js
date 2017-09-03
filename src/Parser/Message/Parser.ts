import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet, PacketTypeId} from '../../Data/Packet';
import {MessageType} from '../../Parser';

export abstract class Parser {
	protected type: any;
	protected tick: number;
	protected stream: BitStream;
	protected length: number;
	protected match: Match;
	protected skippedPackets: PacketTypeId[];

	constructor(type: MessageType, tick: number, stream: BitStream, length: number, match: Match, skippedPacket: PacketTypeId[] = []) {
		this.type = type;
		this.tick = tick;
		this.stream = stream;
		this.length = length; // length in bytes
		this.match = match;
		this.skippedPackets = skippedPacket;
	}

	public abstract parse(): Packet[];
}
