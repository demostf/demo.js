import {ConsoleCmdPacket} from '../../Data/Packet';
import {Parser} from './Parser';
import {BitStream} from 'bit-buffer';
import {ConsoleCmdMessage, MessageHandler, MessageType} from '../../Data/Message';

export class ConsoleCmd extends Parser {
	public parse(): ConsoleCmdPacket[] {
		return [{
			packetType: 'consoleCmd',
			command: this.stream.readUTF8String(),
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
		stream.writeUTF8String(message.command);
	}
};
