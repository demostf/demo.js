import {BitStream} from 'bit-buffer';
import {Parser} from './Parser';
import {StreamDemo} from './StreamDemo';
import {PacketType} from './Data/Packet';

export {StreamDemo} from './StreamDemo';

export class Demo {
	public static fromNodeBuffer(nodeBuffer) {
		const arrayBuffer = new ArrayBuffer(nodeBuffer.length);
		const view = new Uint8Array(arrayBuffer);
		for (let i = 0; i < nodeBuffer.length; ++i) {
			view[i] = nodeBuffer[i];
		}
		return new Demo(arrayBuffer);
	}

	public static fromNodeStream(nodeStream) {
		return new StreamDemo(nodeStream);
	}

	public stream: BitStream;

	public parser: Parser | null;

	constructor(arrayBuffer: ArrayBuffer) {
		this.stream = new BitStream(arrayBuffer);
	}

	public getParser(fastMode: boolean = false) {
		if (!this.parser) {
			const skippedPackets = fastMode ? [
				PacketType.packetEntities,
				PacketType.tempEntities,
				PacketType.entityMessage,
			] : [];
			this.parser = new Parser(this.stream, skippedPackets);
		}
		return this.parser;
	}
}
