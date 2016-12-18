import {Match} from "./Data/Match";
import {BitStream} from 'bit-buffer';
import {Parser, MessageType} from './Parser';
import {Stream} from "stream";

export class StreamParser extends Parser {
	buffer: Buffer;
	header: any;
	sourceStream: Stream;

	constructor(stream) {
		super(new BitStream(new ArrayBuffer(0)));
		this.sourceStream = stream;
		this.on('packet', this.match.handlePacket.bind(this.match));
		this.header = null;
		this.buffer = new Buffer(0);
	}

	eatBuffer(length) {
		this.buffer = shrinkBuffer(this.buffer, length);
	}

	start() {
		this.sourceStream.on('data', this.handleData.bind(this));
		this.sourceStream.on('end', function () {
			this.emit('done', this.match);
		}.bind(this));
	}

	handleData(data) {
		this.buffer = Buffer.concat([this.buffer, data]);
		if (this.header === null) {
			if (this.buffer.length > 1072) {
				this.header = this.parseHeader(new BitStream(this.buffer));
				this.eatBuffer(1072);
			}
		} else {
			this.readStreamMessage();
		}
	}

	readStreamMessage() {
		if (this.buffer.length < 9) { // 9 byte minimum message header (type, tick, length)
			return;
		}
		const stream = new BitStream(this.buffer);
		const type   = stream.readBits(8);
		if (type === MessageType.Stop) {
			console.log('stop');
			return;
		}
		const tick = stream.readInt32();

		let headerSize    = 5;
		let extraHeader = 0;

		switch (type) {
			case MessageType.Sigon:
			case MessageType.Packet:
				extraHeader += 0x54; // command/sequence info
				break;
			case MessageType.UserCmd:
				extraHeader += 0x04; // unknown / outgoing sequence
				break;
			case MessageType.Stop:
			case MessageType.SyncTick:
				this.eatBuffer(headerSize);
				return;
		}
		stream.byteIndex += extraHeader;
		const length = stream.readInt32();
		headerSize += extraHeader + 4;

		if (this.buffer.length < (headerSize + length)) {
			console.log('wants ' + length);
			return;
		}

		console.log('got message ' + tick);
		const messageBuffer = this.buffer.slice(headerSize, headerSize + length);
		this.eatBuffer(headerSize + length);
		const message = this.parseMessage(messageBuffer, type, tick, length, this.match);
		this.handleMessage(message);
	}
}

function shrinkBuffer(buffer, length) {
	if (length < 0) {
		throw 'cant shrink by negative length ' + length;
	}
	return buffer.slice(length, buffer.length);
}
