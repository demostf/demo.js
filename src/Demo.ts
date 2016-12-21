import {Stream} from "stream";
import {BitStream} from 'bit-buffer';
import {Parser} from './Parser';
import {StreamParser} from './StreamParser';

export class Demo {
	stream: BitStream;

	constructor(arrayBuffer: ArrayBuffer) {
		this.stream = new BitStream(arrayBuffer);
	}

	getParser() {
		return new Parser(this.stream);
	}

	static fromNodeBuffer(nodeBuffer) {
		const arrayBuffer = new ArrayBuffer(nodeBuffer.length);
		const view        = new Uint8Array(arrayBuffer);
		for (let i = 0; i < nodeBuffer.length; ++i) {
			view[i] = nodeBuffer[i];
		}
		return new Demo(arrayBuffer);
	}

	static fromNodeStream(nodeStream) {
		return new StreamDemo(nodeStream);
	}
}

export class StreamDemo {
	stream: Stream;

	constructor(nodeStream: Stream) {
		this.stream = nodeStream;
	}

	getParser() {
		return new StreamParser(this.stream);
	}
}
