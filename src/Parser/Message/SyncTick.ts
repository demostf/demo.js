import {MessageHandler, MessageType, SyncTickMessage} from '../../Data/Message';
import {BitStream} from 'bit-buffer';

export const SyncTickHandler: MessageHandler<SyncTickMessage> = {
	parseMessage: (stream: BitStream) => {
		const tick = stream.readInt32();

		return {
			type: MessageType.SyncTick,
			tick,
			rawData: stream.readBitStream(0)
		};
	},
	encodeMessage: (message, stream) => {
		throw new Error('not implemented');
	}
};
