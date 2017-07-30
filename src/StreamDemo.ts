import {Stream} from 'stream';
import {StreamParser} from './StreamParser';

export class StreamDemo {
	public stream: Stream;

	constructor(nodeStream: Stream) {
		this.stream = nodeStream;
	}

	public getParser() {
		return new StreamParser(this.stream);
	}
}
