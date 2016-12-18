import {BitStream} from 'bit-buffer';
import {Match} from '../../Data/Match';

export abstract class Parser {
	type: any;
	tick: number;
	stream: BitStream;
	length: number;
	match: Match;

	constructor(type, tick, stream, length, match) {
		this.type = type;
		this.tick = tick;
		this.stream = stream;
		this.length = length;//length in bytes
		this.match = match;
	}

	abstract parse();
}
