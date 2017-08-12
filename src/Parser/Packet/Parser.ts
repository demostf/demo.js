import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet} from '../../Data/Packet';

export type Parser = (stream: BitStream, match?: Match, skip?: boolean) => Packet;
export type Encoder = (packet: Packet, stream: BitStream, match?: Match) => void;

export interface PacketHandler {
	parser: Parser,
	encoder: Encoder
}


export const voidEncoder: Encoder = () => {
};

export interface PacketParserMap {
	[id: number]: PacketHandler;
}
