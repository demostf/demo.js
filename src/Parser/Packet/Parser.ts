import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet} from '../../Data/Packet';

export type Parser = (stream: BitStream, match?: Match, skip?: boolean) => Packet;

export interface PacketParserMap {
	[id: number]: Parser;
}
