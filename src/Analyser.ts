import {EventEmitter} from 'events';
import {Header} from './Data/Header';
import {Match} from './Data/Match';
import {Parser} from './Parser';

export class Analyser extends EventEmitter {
	private parser: Parser;
	private match: Match;

	constructor(parser: Parser) {
		super();
		this.parser = parser;
	}

	public getHeader(): Header {
		return this.parser.getHeader();
	}

	public getBody(): Match {
		if (!this.match) {
			this.match = new Match(this.parser.parserState);
			for (const packet of this.parser.getPackets()) {
				this.match.handlePacket(packet);
				this.emit('packet', packet);
			}
			this.emit('done');
		}
		return this.match;
	}
}
