import {BitStream} from 'bit-buffer';
import {MessageHandler, MessageType, StopMessage, SyncTickMessage} from '../../Data/Message';

export const StopHandler: MessageHandler<StopMessage> = {
	parseMessage: (stream: BitStream) => {
		return {
			type: MessageType.Stop,
			rawData: stream.readBitStream(0)
		};
	},
	encodeMessage: (message, stream) => {
		// noop
	}
};
