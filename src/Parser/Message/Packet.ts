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

import {Packet as IPacket, PacketTypeId} from '../../Data/Packet';

export class Packet extends Parser {
	private static parsers: Map<PacketTypeId, PacketHandler<IPacket>> = new Map([
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
			{parser: ParseUserMessage, encoder: voidEncoder}],
		[PacketTypeId.entityMessage,
			make('entityMessage', 'index{11}classId{9}length{11}data{$length}')],
		[PacketTypeId.gameEvent,
			{parser: ParseGameEvent, encoder: voidEncoder}],
		[PacketTypeId.packetEntities,
			{parser: ParsePacketEntities, encoder: voidEncoder}],
		[PacketTypeId.tempEntities,
			{parser: ParseTempEntities, encoder: voidEncoder}],
		[PacketTypeId.preFetch,
			make('preFetch', 'index{14}')],
		[PacketTypeId.menu,
			make('menu', 'type{u16}length{u16}data{$length*8}')],
		[PacketTypeId.gameEventList,
			{parser: ParseGameEventList, encoder: EncodeGameEventList}],
		[PacketTypeId.getCvarValue,
			make('getCvarValue', 'cookie{32}value{s}')],
		[PacketTypeId.cmdKeyValues,
			make('cmdKeyValues', 'length{32}data{$length}')],
	]);

	public parse() {
		const packets: IPacket[] = [];
		let lastPacketType = 0;
		while (this.bitsLeft > 6) { // last 6 bits for NOOP
			const type = this.stream.readBits(6) as PacketTypeId;
			if (type !== 0) {
				const parser = Packet.parsers.get(type);
				if (parser) {
					const skip = this.skippedPackets.indexOf(type) !== -1;
					const packet = parser.parser(this.stream, this.match, skip);
					packets.push(packet);
				} else {
					throw new Error(`Unknown packet type ${type} just parsed a ${PacketTypeId[lastPacketType]}`);
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
