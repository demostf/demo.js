import {make} from './ParserGenerator';

import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {EntityMessagePacket} from '../../Data/Packet';

const baseParser = make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

export function EntityMessage(stream: BitStream, match: Match): EntityMessagePacket { // 24: entityMessage
	return baseParser(stream) as EntityMessagePacket; // todo parse data further?
}
