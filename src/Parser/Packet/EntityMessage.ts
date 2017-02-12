import {make} from './ParserGenerator';

import {EntityMessagePacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

const baseParser = make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

export function EntityMessage(stream: BitStream): EntityMessagePacket { // 24: entityMessage
	return <EntityMessagePacket>baseParser(stream); //todo parse data further?
};
