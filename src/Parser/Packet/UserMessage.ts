import {BitStream} from 'bit-buffer';
import {EncodeSayText2, ParseSayText2} from '../UserMessage/SayText2';
import {make} from './ParserGenerator';
import {PacketHandler} from './Parser';
import {
	UserMessageType,
	UserMessagePacket,
	UnknownUserMessagePacket,
	UnknownUserMessageBasePacket,
	UserMessageTypeMap,
	UserMessagePacketTypeMap
} from '../../Data/UserMessage';

function unknownPacketHandler<T extends UnknownUserMessagePacket['packetType']>(packetType: T): PacketHandler<UserMessageTypeMap[T]> {
	return {
		parser: (data: BitStream) => {
			return {
				packetType,
				type: UserMessagePacketTypeMap.get(packetType),
				data
			} as UserMessageTypeMap[T];
		},
		encoder: (packet: UnknownUserMessageBasePacket, data: BitStream) => {
			packet.data.index = 0;
			data.writeUint8(packet.type);
			data.writeBits(packet.data.length, 11);
			data.writeBitStream(packet.data);
			packet.data.index = 0;
		}
	};
}

const userMessageParsers: Map<UserMessageType, PacketHandler<UserMessagePacket>> = new Map<UserMessageType, PacketHandler<UserMessagePacket>>([
	[UserMessageType.SayText2, {parser: ParseSayText2, encoder: EncodeSayText2}],
	[UserMessageType.TextMsg, make('textMsg', 'destType{8}text{s}')],
	[UserMessageType.ResetHUD, make('resetHUD', 'data{8}')],
	[UserMessageType.Train, make('train', 'data{8}')],
	[UserMessageType.VoiceSubtitle, make('voiceSubtitle', 'client{8}menu{8}item{8}')],
	[UserMessageType.BreakModel_Pumpkin, unknownPacketHandler('breakModelPumpkin')]
]);

export function ParseUserMessage(stream: BitStream): UserMessagePacket { // 23: user message
	const type = stream.readUint8();
	const length = stream.readBits(11);
	const messageData = stream.readBitStream(length);

	const handler = userMessageParsers.get(type);

	if (!handler) {
		// throw new Error(`packet ${UserMessageType[type]} length:${length} data: ${messageData.readASCIIString()}`);
		return {
			packetType: 'unknownUserMessage',
			type,
			data: messageData,
		};
	} else {
		return handler.parser(messageData);
	}
}
