import {MessageHandler, MessageType, UserCmdMessage} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const UserCmdHandler: MessageHandler<UserCmdMessage> = {
	parseMessage: (stream: BitStream, tick: number) => {
		return {
			type: MessageType.UserCmd,
			tick,
			rawData: stream
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('not implemented');
	}
};
