import {BitStream} from 'bit-buffer';
import {Buffer} from 'buffer';
import {Stream} from 'stream';
import {MessageType, Parser} from './Parser';

export class StreamParser extends Parser {
	public header: any;
	private buffer: Buffer;
	private sourceStream: Stream;

	constructor(stream: Stream) {
		super(new BitStream(new ArrayBuffer(0)));
		this.sourceStream = stream;
		this.on('packet', this.match.handlePacket.bind(this.match));
		this.header = null;
		this.buffer = new Buffer(0);
	}

	public start() {
		this.sourceStream.on('data', this.handleData.bind(this));
		this.sourceStream.on('end', function() {
			this.emit('done', this.match);
		}.bind(this));
	}

	private eatBuffer(length) {
		this.buffer = shrinkBuffer(this.buffer, length);
	}

	private handleData(data) {
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

	private readStreamMessage() {
		if (this.buffer.length < 9) { // 9 byte minimum message header (type, tick, length)
			return;
		}
		const stream = new BitStream(this.buffer);
		const type   = stream.readBits(8);
		if (type === MessageType.Stop) {
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
			return;
		}

		const messageStream = stream.readBitStream(length * 8);
		const message = this.parseMessage(messageStream, type, tick, length, this.match);
		this.handleMessage(message);
	}
}

function shrinkBuffer(buffer, length) {
	if (length < 0) {
		throw new Error('cant shrink by negative length ' + length);
	}
	return buffer.slice(length, buffer.length);
}
