import {Stream} from "stream";
import {BitStream} from 'bit-buffer';
import {Parser} from './Parser';
import {StreamParser} from './StreamParser';
import {PacketType} from "./Parser/Message/Packet";

export class Demo {
	stream: BitStream;
	parser: Parser|null;

	constructor(arrayBuffer: ArrayBuffer) {
		this.stream = new BitStream(arrayBuffer);
	}

	getParser(fastMode: boolean = false) {
		if (!this.parser) {
			const skippedPackets = fastMode ? [
					PacketType.packetEntities,
					PacketType.tempEntities,
					PacketType.entityMessage,
				] : [];
			this.parser          = new Parser(this.stream, skippedPackets);
		}
		return this.parser;
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
