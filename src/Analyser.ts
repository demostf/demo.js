import {EventEmitter} from 'events';
import {Header} from './Data/Header';
import {Match} from './Data/Match';
import {Packet} from './Data/Packet';
import {Parser} from './Parser';

export class Analyser extends EventEmitter {
	public readonly match: Match;
	private readonly parser: Parser;
	private analysed: boolean = false;

	constructor(parser: Parser) {
		super();
		this.parser = parser;
		this.match = new Match(this.parser.parserState);
	}

	public getHeader(): Header {
		return this.parser.getHeader();
	}

	public getBody(): Match {
		if (!this.analysed) {
			for (const packet of this.getPackets()) {
				this.emit('packet', packet);
			}
			this.emit('done');
		}
		this.analysed = true;
		return this.match;
	}

	public * getPackets(): IterableIterator<Packet> {
		for (const packet of this.parser.getPackets()) {
			this.match.handlePacket(packet);
			yield packet;
		}
	}
}
