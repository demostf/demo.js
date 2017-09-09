import {BitStream} from 'bit-buffer';
import {Packet, VoidPacket} from '../../Data/Packet';
import {ParserState} from '../../Data/ParserState';

export type Parser<P extends Packet> = (stream: BitStream, state?: ParserState, skip?: boolean) => P;
export type Encoder<P extends Packet> = (packet: P, stream: BitStream, state?: ParserState) => void;

export interface PacketHandler<P extends Packet> {
	parser: Parser<P>,
	encoder: Encoder<P>
}

export const voidEncoder: Encoder<VoidPacket> = () => {
	return {
		type: 'void'
	};
};
