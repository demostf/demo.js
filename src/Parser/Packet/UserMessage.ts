import {BitStream} from 'bit-buffer';
import {
	UnknownUserMessageBasePacket,
	UnknownUserMessagePacket,
	UserMessagePacket, UserMessagePacketType,
	UserMessagePacketTypeMap,
	UserMessageType,
	UserMessageTypeMap
} from '../../Data/UserMessage';
import {EncodeSayText2, ParseSayText2} from '../UserMessage/SayText2';
import {make, NamedPacketHandler} from './ParserGenerator';

function unknownPacketHandler<T extends UnknownUserMessagePacket['userMessageType']>(userMessageType: T): NamedPacketHandler<UserMessageTypeMap[T], UserMessagePacketType> {
	return {
		parser: (data: BitStream) => {
			return {
				packetType: 'userMessage',
				userMessageType,
				type: UserMessagePacketTypeMap.get(userMessageType),
				data
			} as UserMessageTypeMap[T];
		},
		encoder: (packet: UnknownUserMessageBasePacket, data: BitStream) => {
			packet.data.index = 0;
			data.writeBitStream(packet.data);
			packet.data.index = 0;
		},
		name: userMessageType
	};
}

const userMessageParsers: Map<UserMessageType, NamedPacketHandler<UserMessagePacket, UserMessagePacketType>> =
	new Map<UserMessageType, NamedPacketHandler<UserMessagePacket, UserMessagePacketType>>([
		[UserMessageType.SayText2, {parser: ParseSayText2, encoder: EncodeSayText2, name: 'sayText2'}],
		[UserMessageType.TextMsg,
			make('textMsg', 'destType{8}text{s}substitute1{s}substitute2{s}substitute3{s}substitute4{s}', 'userMessageType', {
				packetType: 'userMessage'
			})],
		[UserMessageType.ResetHUD,
			make('resetHUD', 'data{8}', 'userMessageType', {
				packetType: 'userMessage'
			})],
		[UserMessageType.Train,
			make('train', 'data{8}', 'userMessageType', {
				packetType: 'userMessage'
			})],
		[UserMessageType.VoiceSubtitle,
			make('voiceSubtitle', 'client{8}menu{8}item{8}', 'userMessageType', {
				packetType: 'userMessage'
			})],
		[UserMessageType.BreakModel_Pumpkin, unknownPacketHandler('breakModelPumpkin')],
		[UserMessageType.Shake,
			make('shake', 'command{8}amplitude{f32}frequency{f32}duration{f32}', 'userMessageType', {
				packetType: 'userMessage'
			})]
	]);

export function ParseUserMessage(stream: BitStream): UserMessagePacket { // 23: user message
	const type = stream.readUint8();
	const length = stream.readBits(11);
	const messageData = stream.readBitStream(length);

	const handler = userMessageParsers.get(type);

	if (!handler) {
		return {
			packetType: 'userMessage',
			userMessageType: 'unknownUserMessage',
			type,
			data: messageData
		};
	} else {
		return handler.parser(messageData);
	}
}

export function EncodeUserMessage(packet: UserMessagePacket, stream: BitStream) {
	if (packet.userMessageType === 'unknownUserMessage') {
		stream.writeUint8(packet.type);
		stream.writeBits(packet.data.length, 11);
		packet.data.index = 0;
		stream.writeBitStream(packet.data);
		packet.data.index = 0;
	} else {
		const messageType = UserMessagePacketTypeMap.get(packet.userMessageType);
		if (!messageType) {
			throw new Error(`Unknown userMessage type ${messageType}`);
		}
		stream.writeUint8(messageType);

		const lengthStart = stream.index;
		stream.index += 11;
		const messageDataStart = stream.index;

		const handler = userMessageParsers.get(messageType);
		if (!handler) {
			throw new Error(`No encoder for userMessage ${packet.userMessageType}(${messageType})`);
		}

		handler.encoder(packet, stream);

		const messageDataEnd = stream.index;
		stream.index = lengthStart;
		stream.writeBits(messageDataEnd - messageDataStart, 11);

		stream.index = messageDataEnd;
	}

}
