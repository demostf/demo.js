import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet} from "../../Data/Packet";
import {MessageType} from "../../Parser";
import {PacketType} from "./Packet";

export abstract class Parser {
	type: any;
	tick: number;
	stream: BitStream;
	length: number;
	match: Match;
	skippedPackets: PacketType[];

	constructor(type: MessageType, tick: number, stream: BitStream, length: number, match: Match, skippedPacket: PacketType[] = []) {
		this.type           = type;
		this.tick           = tick;
		this.stream         = stream;
		this.length         = length;//length in bytes
		this.match          = match;
		this.skippedPackets = skippedPacket;
	}

	abstract parse(): Packet[]|string;
}
