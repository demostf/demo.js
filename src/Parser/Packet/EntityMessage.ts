import {make} from './ParserGenerator';

import {EntityMessagePacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {Match} from "../../Data/Match";

const baseParser = make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

export function EntityMessage(stream: BitStream, match: Match): EntityMessagePacket { // 24: entityMessage
	const result = <EntityMessagePacket>baseParser(stream); //todo parse data further?
	return result;
};
