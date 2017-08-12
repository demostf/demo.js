import {make} from './ParserGenerator';

import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';
import {EntityMessagePacket} from '../../Data/Packet';

const baseParser = make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

export function ParseEntityMessage(stream: BitStream, match: Match): EntityMessagePacket { // 24: entityMessage
	// entity messages seem pretty unimportant, they are unreliable messages and from testing only the "clear decals"
	// message seems to be used in practice, probably safe to just leave as is
	return baseParser.parser(stream) as EntityMessagePacket;
}
