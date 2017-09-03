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
			data.writeBitStream(packet.data);
			packet.data.index = 0;
		}
	};
}

const userMessageParsers: Map<UserMessageType, PacketHandler<UserMessagePacket>> = new Map<UserMessageType, PacketHandler<UserMessagePacket>>([
	[UserMessageType.SayText2, {parser: ParseSayText2, encoder: EncodeSayText2}],
	[UserMessageType.TextMsg, make('textMsg', 'destType{8}text{s}substitute1{s}substitute2{s}substitute3{s}substitute4{s}')],
	[UserMessageType.ResetHUD, make('resetHUD', 'data{8}')],
	[UserMessageType.Train, make('train', 'data{8}')],
	[UserMessageType.VoiceSubtitle, make('voiceSubtitle', 'client{8}menu{8}item{8}')],
	[UserMessageType.BreakModel_Pumpkin, unknownPacketHandler('breakModelPumpkin')],
	[UserMessageType.Shake, make('shake', 'command{8}amplitude{f32}frequency{f32}duration{f32}')]
]);

export function ParseUserMessage(stream: BitStream): UserMessagePacket { // 23: user message
	const s = stream.index;
	const type = stream.readUint8();
	const length = stream.readBits(11);
	const messageData = stream.readBitStream(length);

	const handler = userMessageParsers.get(type);

	if (!handler) {
		return {
			packetType: 'unknownUserMessage',
			type,
			data: messageData,
		};
	} else {
		return handler.parser(messageData);
	}
}

export function EncodeUserMessage(packet: UserMessagePacket, stream: BitStream) {
	if (packet.packetType === 'unknownUserMessage') {
		stream.writeUint8(packet.type);
		stream.writeBits(packet.data.length, 11);
		packet.data.index = 0;
		stream.writeBitStream(packet.data);
		packet.data.index = 0;
	} else {
		const messageType = UserMessagePacketTypeMap.get(packet.packetType);
		if (!messageType) {
			throw new Error(`Unknown userMessage type ${messageType}`);
		}
		stream.writeUint8(messageType);

		const lengthStart = stream.index;
		stream.index += 11;
		const messageDataStart = stream.index;

		const handler = userMessageParsers.get(messageType);
		if (!handler) {
			throw new Error(`No encoder for userMessage ${packet.packetType}(${messageType})`);
		}

		handler.encoder(packet, stream);

		const messageDataEnd = stream.index;
		stream.index = lengthStart;
		stream.writeBits(messageDataEnd - messageDataStart, 11);

		stream.index = messageDataEnd;
	}

}
