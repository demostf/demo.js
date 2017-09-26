import {BitStream} from 'bit-buffer';
import {MessageHandler, MessageType, SyncTickMessage} from '../../Data/Message';

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
		stream.writeUint32(message.tick);
	}
};
