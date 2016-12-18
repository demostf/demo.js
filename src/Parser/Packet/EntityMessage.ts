import {make} from './ParserGenerator';

import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

const baseParser = make('entityMessage', 'index{11}classId{9}length{11}data{$length}');

export function EntityMessage(stream:BitStream):Packet { // 24: entityMessage
	return baseParser(stream); //todo parse data further?
};
