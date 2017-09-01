import {make} from '../Packet/ParserGenerator';
import {EncodeBSPDecal, ParseBSPDecal} from '../Packet/BSPDecal';
import {EncodeClassInfo, ParseClassInfo} from '../Packet/ClassInfo';
import {EncodeCreateStringTable, ParseCreateStringTable} from '../Packet/CreateStringTable';
import {ParseGameEvent} from '../Packet/GameEvent';
import {EncodeGameEventList, ParseGameEventList} from '../Packet/GameEventList';
import {ParsePacketEntities} from '../Packet/PacketEntities';
import {PacketHandler, voidEncoder} from '../Packet/Parser';
import {EncodeParseSounds, ParseParseSounds} from '../Packet/ParseSounds';
import {EncodeSetConVar, ParseSetConVar} from '../Packet/SetConVar';
import {ParseTempEntities} from '../Packet/TempEntities';
import {EncodeUpdateStringTable, ParseUpdateStringTable} from '../Packet/UpdateStringTable';
import {ParseUserMessage} from '../Packet/UserMessage';
import {EncodeVoiceData, ParseVoiceData} from '../Packet/VoiceData';
import {EncodeVoiceInit, ParseVoiceInit} from '../Packet/VoiceInit';
import {Parser} from './Parser';

import {Packet as IPacket, PacketType} from '../../Data/Packet';

export class Packet extends Parser {
	private static parsers: Map<PacketType, PacketHandler<IPacket>> = new Map([
		[PacketType.file,
			make('file', 'transferId{32}fileName{s}requested{b}')],
		[PacketType.netTick,
			make('netTick', 'tick{32}frameTime{16}stdDev{16}')],
		[PacketType.stringCmd,
			make('stringCmd', 'command{s}')],
		[PacketType.setConVar,
			{parser: ParseSetConVar, encoder: EncodeSetConVar}],
		[PacketType.sigOnState,
			make('sigOnState', 'state{8}count{32}')],
		[PacketType.print,
			make('print', 'value{s}')],
		[PacketType.serverInfo,
			make('serverInfo',
				'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
				'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
				'game{s}map{s}skybox{s}serverName{s}replay{b}')],
		[PacketType.classInfo,
			{parser: ParseClassInfo, encoder: EncodeClassInfo}],
		[PacketType.setPause,
			make('setPause', 'paused{b}')],
		[PacketType.createStringTable,
			{parser: ParseCreateStringTable, encoder: EncodeCreateStringTable}],
		[PacketType.updateStringTable,
			{parser: ParseUpdateStringTable, encoder: EncodeUpdateStringTable}],
		[PacketType.voiceInit,
			{parser: ParseVoiceInit, encoder: EncodeVoiceInit}],
		[PacketType.voiceData,
			{parser: ParseVoiceData, encoder: EncodeVoiceData}],
		[PacketType.parseSounds,
			{parser: ParseParseSounds, encoder: EncodeParseSounds}],
		[PacketType.setView,
			make('setView', 'index{11}')],
		[PacketType.fixAngle,
			make('fixAngle', 'relative{b}x{16}y{16}z{16}')],
		[PacketType.bspDecal,
			{parser: ParseBSPDecal, encoder: EncodeBSPDecal}],
		[PacketType.userMessage,
			{parser: ParseUserMessage, encoder: voidEncoder}],
		[PacketType.entityMessage,
			make('entityMessage', 'index{11}classId{9}length{11}data{$length}')],
		[PacketType.gameEvent,
			{parser: ParseGameEvent, encoder: voidEncoder}],
		[PacketType.packetEntities,
			{parser: ParsePacketEntities, encoder: voidEncoder}],
		[PacketType.tempEntities,
			{parser: ParseTempEntities, encoder: voidEncoder}],
		[PacketType.preFetch,
			make('preFetch', 'index{14}')],
		[PacketType.menu,
			make('menu', 'type{u16}length{u16}data{$length*8}')],
		[PacketType.gameEventList,
			{parser: ParseGameEventList, encoder: EncodeGameEventList}],
		[PacketType.getCvarValue,
			make('getCvarValue', 'cookie{32}value{s}')],
		[PacketType.cmdKeyValues,
			make('cmdKeyValues', 'length{32}data{$length}')],
	]);

	public parse() {
		const packets: IPacket[] = [];
		let lastPacketType = 0;
		while (this.bitsLeft > 6) { // last 6 bits for NOOP
			const type = this.stream.readBits(6) as PacketType;
			if (type !== 0) {
				const parser = Packet.parsers.get(type);
				if (parser) {
					const skip = this.skippedPackets.indexOf(type) !== -1;
					const packet = parser.parser(this.stream, this.match, skip);
					packets.push(packet);
				} else {
					throw new Error(`Unknown packet type ${type} just parsed a ${PacketType[lastPacketType]}`);
				}
				lastPacketType = type;
			}
		}
		return packets;
	}

	get bitsLeft() {
		return (this.length * 8) - this.stream.index;
	}
}
