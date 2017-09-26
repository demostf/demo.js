import {EncodeBSPDecal, ParseBSPDecal} from '../Packet/BSPDecal';
import {EncodeClassInfo, ParseClassInfo} from '../Packet/ClassInfo';
import {EncodeCreateStringTable, ParseCreateStringTable} from '../Packet/CreateStringTable';
import {EncodeGameEvent, ParseGameEvent} from '../Packet/GameEvent';
import {EncodeGameEventList, ParseGameEventList} from '../Packet/GameEventList';
import {EncodePacketEntities, ParsePacketEntities} from '../Packet/PacketEntities';
import {PacketHandler} from '../Packet/Parser';
import {make} from '../Packet/ParserGenerator';
import {EncodeParseSounds, ParseParseSounds} from '../Packet/ParseSounds';
import {EncodeSetConVar, ParseSetConVar} from '../Packet/SetConVar';
import {EncodeTempEntities, ParseTempEntities} from '../Packet/TempEntities';
import {EncodeUpdateStringTable, ParseUpdateStringTable} from '../Packet/UpdateStringTable';
import {EncodeUserMessage, ParseUserMessage} from '../Packet/UserMessage';
import {EncodeVoiceData, ParseVoiceData} from '../Packet/VoiceData';
import {EncodeVoiceInit, ParseVoiceInit} from '../Packet/VoiceInit';

import {BitStream} from 'bit-buffer';
import {MessageHandler, MessageType, PacketMessage} from '../../Data/Message';
import {Packet as IPacket, PacketTypeId} from '../../Data/Packet';
import {ParserState} from '../../Data/ParserState';
import {Vector} from '../../Data/Vector';

type PacketHandlerMap = Map<PacketTypeId, PacketHandler<IPacket>>;

const handlers: PacketHandlerMap = new Map<PacketTypeId, PacketHandler<IPacket>>([
	[PacketTypeId.file,
		make('file', 'transferId{32}fileName{s}requested{b}')],
	[PacketTypeId.netTick,
		make('netTick', 'tick{32}frameTime{16}stdDev{16}')],
	[PacketTypeId.stringCmd,
		make('stringCmd', 'command{s}')],
	[PacketTypeId.setConVar,
		{parser: ParseSetConVar, encoder: EncodeSetConVar}],
	[PacketTypeId.sigOnState,
		make('sigOnState', 'state{8}count{32}')],
	[PacketTypeId.print,
		make('print', 'value{s}')],
	[PacketTypeId.serverInfo,
		make('serverInfo',
			'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
			'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
			'game{s}map{s}skybox{s}serverName{s}replay{b}')],
	[PacketTypeId.classInfo,
		{parser: ParseClassInfo, encoder: EncodeClassInfo}],
	[PacketTypeId.setPause,
		make('setPause', 'paused{b}')],
	[PacketTypeId.createStringTable,
		{parser: ParseCreateStringTable, encoder: EncodeCreateStringTable}],
	[PacketTypeId.updateStringTable,
		{parser: ParseUpdateStringTable, encoder: EncodeUpdateStringTable}],
	[PacketTypeId.voiceInit,
		{parser: ParseVoiceInit, encoder: EncodeVoiceInit}],
	[PacketTypeId.voiceData,
		{parser: ParseVoiceData, encoder: EncodeVoiceData}],
	[PacketTypeId.parseSounds,
		{parser: ParseParseSounds, encoder: EncodeParseSounds}],
	[PacketTypeId.setView,
		make('setView', 'index{11}')],
	[PacketTypeId.fixAngle,
		make('fixAngle', 'relative{b}x{16}y{16}z{16}')],
	[PacketTypeId.bspDecal,
		{parser: ParseBSPDecal, encoder: EncodeBSPDecal}],
	[PacketTypeId.userMessage,
		{parser: ParseUserMessage, encoder: EncodeUserMessage}],
	[PacketTypeId.entityMessage,
		make('entityMessage', 'index{11}classId{9}length{11}data{$length}')],
	[PacketTypeId.gameEvent,
		{parser: ParseGameEvent, encoder: EncodeGameEvent}],
	[PacketTypeId.packetEntities,
		{parser: ParsePacketEntities, encoder: EncodePacketEntities}],
	[PacketTypeId.tempEntities,
		{parser: ParseTempEntities, encoder: EncodeTempEntities}],
	[PacketTypeId.preFetch,
		make('preFetch', 'index{14}')],
	[PacketTypeId.menu,
		make('menu', 'type{u16}length{u16}data{$length*8}')],
	[PacketTypeId.gameEventList,
		{parser: ParseGameEventList, encoder: EncodeGameEventList}],
	[PacketTypeId.getCvarValue,
		make('getCvarValue', 'cookie{32}value{s}')],
	[PacketTypeId.cmdKeyValues,
		make('cmdKeyValues', 'length{32}data{$length}')]
]);

export const PacketMessageHandler: MessageHandler<PacketMessage> = {
	parseMessage: (stream: BitStream, state: ParserState) => {
		const tick = stream.readInt32();
		const flags = stream.readInt32();

		const viewOrigin: [Vector, Vector] = [new Vector(0, 0, 0), new Vector(0, 0, 0)];
		const viewAngles: [Vector, Vector] = [new Vector(0, 0, 0), new Vector(0, 0, 0)];
		const localViewAngles: [Vector, Vector] = [new Vector(0, 0, 0), new Vector(0, 0, 0)];

		for (let j = 0; j < 2; j++) {
			viewOrigin[j] = new Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
			viewAngles[j] = new Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
			localViewAngles[j] = new Vector(stream.readFloat32(), stream.readFloat32(), stream.readFloat32());
		}
		const sequenceIn = stream.readInt32();
		const sequenceOut = stream.readInt32();

		const length = stream.readInt32();
		const messageStream = stream.readBitStream(length * 8);

		const packets: IPacket[] = [];
		let lastPacketType = 0;
		while (messageStream.bitsLeft > 6) { // last 6 bits for NOOP
			const type = messageStream.readBits(6) as PacketTypeId;
			if (type !== 0) {
				const handler = handlers.get(type);
				if (handler) {
					const skip = state.skippedPackets.indexOf(type) !== -1;
					const packet = handler.parser(messageStream, state, skip);
					packets.push(packet);
				} else {
					throw new Error(`Unknown packet type ${type} just parsed a ${PacketTypeId[lastPacketType]}`);
				}
				lastPacketType = type;
			}
		}
		return {
			type: MessageType.Packet,
			tick,
			rawData: messageStream,
			packets,
			flags,
			viewOrigin,
			viewAngles,
			localViewAngles,
			sequenceIn,
			sequenceOut
		};
	},
	encodeMessage: (message: PacketMessage, stream: BitStream, state: ParserState) => {
		stream.writeUint32(message.tick);
		stream.writeUint32(message.flags);

		for (let j = 0; j < 2; j++) {
			stream.writeFloat32(message.viewOrigin[j].x);
			stream.writeFloat32(message.viewOrigin[j].y);
			stream.writeFloat32(message.viewOrigin[j].z);

			stream.writeFloat32(message.viewAngles[j].x);
			stream.writeFloat32(message.viewAngles[j].y);
			stream.writeFloat32(message.viewAngles[j].z);

			stream.writeFloat32(message.localViewAngles[j].x);
			stream.writeFloat32(message.localViewAngles[j].y);
			stream.writeFloat32(message.localViewAngles[j].z);
		}

		stream.writeUint32(message.sequenceIn);
		stream.writeUint32(message.sequenceOut);

		const lengthStart = stream.index;

		stream.index += 32;

		const dataStart = stream.index;

		for (const packet of message.packets) {
			const type = PacketTypeId[packet.packetType];
			stream.writeBits(type, 6);

			const handler = handlers.get(type);
			if (handler) {
				handler.encoder(packet, stream, state);
			} else {
				throw new Error(`No handler for packet type ${packet.packetType}`);
			}
		}

		stream.writeBits(0, 6);

		const dataEnd = stream.index;

		stream.index = lengthStart;

		const byteLength = Math.ceil((dataEnd - dataStart) / 8);
		stream.writeUint32(byteLength);

		// align to byte;
		stream.index = dataStart + byteLength * 8;
	}
};
