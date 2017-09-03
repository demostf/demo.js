import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {Packet, VoidPacket} from '../../Data/Packet';

export type Parser<P extends Packet> = (stream: BitStream, match?: Match, skip?: boolean) => P;
export type Encoder<P extends Packet> = (packet: P, stream: BitStream, match?: Match) => void;

export interface PacketHandler<P extends Packet> {
	parser: Parser<P>,
	encoder: Encoder<P>
}

export const voidEncoder: Encoder<VoidPacket> = () => {
	return {
		type: 'void'
	};
};
