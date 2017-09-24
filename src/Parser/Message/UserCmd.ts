import {MessageHandler, MessageType, UserCmdMessage} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const UserCmdHandler: MessageHandler<UserCmdMessage> = {
	parseMessage: (stream: BitStream) => {
		const tick = stream.readInt32();

		const sequenceOut = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		return {
			type: MessageType.UserCmd,
			tick,
			rawData: messageStream,
			sequenceOut
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('not implemented');
	}
};
