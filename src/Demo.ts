import {BitStream} from 'bit-buffer';
import {Analyser} from './Analyser';
import {PacketTypeId} from './Data/Packet';
import {Parser} from './Parser';

export class Demo {
	public static fromNodeBuffer(nodeBuffer: Buffer) {
		return new Demo(nodeBuffer.buffer as ArrayBuffer);
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
				PacketTypeId.entityMessage
			] : [];
			this.parser = new Parser(this.stream, skippedPackets);
		}
		return this.parser;
	}

	public getAnalyser(fastMode: boolean = false) {
		return new Analyser(this.getParser(fastMode));
	}
}
