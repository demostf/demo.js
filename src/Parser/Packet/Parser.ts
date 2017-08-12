import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet} from '../../Data/Packet';

export type Parser = (stream: BitStream, match?: Match, skip?: boolean) => Packet;
export type Encoder = (packet: Packet, match: Match, stream: BitStream) => void;

export interface PacketHandler {
	parser: Parser,
	encoder: Encoder
}


export const voidEncoder: Encoder = () => {
};

export interface PacketParserMap {
	[id: number]: PacketHandler;
}
