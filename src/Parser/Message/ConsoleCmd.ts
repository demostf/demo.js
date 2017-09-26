import {BitStream} from 'bit-buffer';
import {TextEncoder} from 'text-encoding-shim';
import {ConsoleCmdMessage, MessageHandler, MessageType} from '../../Data/Message';
import {ConsoleCmdPacket} from '../../Data/Packet';
import {Parser} from './Parser';

export class ConsoleCmd extends Parser {
	public parse(): ConsoleCmdPacket[] {
		return [{
			packetType: 'consoleCmd',
			command: this.stream.readUTF8String()
		}];
	}
}

export const ConsoleCmdHandler: MessageHandler<ConsoleCmdMessage> = {
	parseMessage: (stream: BitStream) => {
		const tick = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		return {
			type: MessageType.ConsoleCmd,
			tick,
			rawData: messageStream,
			command: messageStream.readUTF8String()
		};
	},
	encodeMessage: (message: ConsoleCmdMessage, stream: BitStream) => {
		stream.writeUint32(message.tick);

		const byteLength = (new TextEncoder('utf-8').encode(message.command)).length + 1; // +1 for null termination
		stream.writeUint32(byteLength);

		stream.writeUTF8String(message.command);
	}
};
