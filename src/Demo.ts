import {BitStream} from 'bit-buffer';
import {Analyser} from './Analyser';
import {PacketTypeId} from './Data/Packet';
import {Parser} from './Parser';

export enum ParseMode {
	MINIMAL,
	ENTITIES,
	COMPLETE
}

export class Demo {
	public static fromNodeBuffer(nodeBuffer: Buffer) {
		return new Demo(nodeBuffer.buffer as ArrayBuffer);
	}

	public stream: BitStream;

	public parser: Parser | null;

	constructor(arrayBuffer: ArrayBuffer) {
		this.stream = new BitStream(arrayBuffer);
	}

	public getParser(mode: ParseMode = ParseMode.ENTITIES) {
		if (!this.parser) {
			this.parser = new Parser(this.stream, this.getSkippedPackets(mode));
		}
		return this.parser;
	}

	public getAnalyser(mode: ParseMode = ParseMode.ENTITIES) {
		return new Analyser(this.getParser(mode));
	}

	private getSkippedPackets(mode: ParseMode) {
		switch (mode) {
			case ParseMode.MINIMAL:
				return [
					PacketTypeId.packetEntities,
					PacketTypeId.tempEntities,
					PacketTypeId.entityMessage
				];
			case ParseMode.ENTITIES:
				return [
					PacketTypeId.tempEntities
				];
			case ParseMode.COMPLETE:
				return [];
		}
	}
}
