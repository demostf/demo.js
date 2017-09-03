import {BitStream} from 'bit-buffer';
import {Parser} from './Parser';
import {StreamDemo} from './StreamDemo';
import {PacketTypeId} from './Data/Packet';

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
				PacketTypeId.packetEntities,
				PacketTypeId.tempEntities,
				PacketTypeId.entityMessage,
			] : [];
			this.parser = new Parser(this.stream, skippedPackets);
		}
		return this.parser;
	}
}
