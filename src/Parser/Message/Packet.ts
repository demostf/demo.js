import * as ParserGenerator from '../Packet/ParserGenerator';

import {ParseBSPDecal} from '../Packet/BSPDecal';
import {ParseClassInfo} from '../Packet/ClassInfo';
import {ParseCmdKeyValues} from '../Packet/CmdKeyValues';
import {ParseCreateStringTable} from '../Packet/CreateStringTable';
import {ParseEntityMessage} from '../Packet/EntityMessage';
import {ParseGameEvent} from '../Packet/GameEvent';
import {ParseGameEventList} from '../Packet/GameEventList';
import {ParseMenu} from '../Packet/Menu';
import {ParsePacketEntities} from '../Packet/PacketEntities';
import {PacketParserMap} from '../Packet/Parser';
import {ParseParseSounds} from '../Packet/ParseSounds';
import {ParseSetConVar} from '../Packet/SetConVar';
import {ParseTempEntities} from '../Packet/TempEntities';
import {ParseUpdateStringTable} from '../Packet/UpdateStringTable';
import {ParseUserMessage} from '../Packet/UserMessage';
import {ParseVoiceData} from '../Packet/VoiceData';
import {ParseVoiceInit} from '../Packet/VoiceInit';
import {Parser} from './Parser';

import {GameEventDefinitionMap} from '../../Data/GameEvent';

import {Packet as IPacket} from '../../Data/Packet';

// https://code.google.com/p/coldemoplayer/source/browse/branches/2.0/compLexity+Demo+Player/CDP.Source/Messages/?r=219
// https://github.com/TimePath/hl2-toolkit/tree/master/src/main/java/com/timepath/hl2/io/demo
// https://github.com/stgn/netdecode/blob/master/Packet.cs
// https://github.com/LestaD/SourceEngine2007/blob/master/src_main/common/netmessages.cpp

export class Packet extends Parser {
	private static parsers: PacketParserMap = {
		2:  ParserGenerator.make('file', 'transferId{32}fileName{s}requested{b}'),
		3:  ParserGenerator.make('netTick', 'tick{32}frameTime{16}stdDev{16}'),
		4:  ParserGenerator.make('stringCmd', 'command{s}'),
		5:  ParseSetConVar,
		6:  ParserGenerator.make('sigOnState', 'state{8}count{32}'),
		7:  ParserGenerator.make('print', 'value{s}'),
		8:  ParserGenerator.make('serverInfo',
			'version{16}serverCount{32}stv{b}dedicated{b}maxCrc{32}maxClasses{16}' +
			'mapHash{128}playerCount{8}maxPlayerCount{8}intervalPerTick{f32}platform{s1}' +
			'game{s}map{s}skybox{s}serverName{s}replay{b}'),
		10: ParseClassInfo,
		11: ParserGenerator.make('setPause', 'paused{b}'),
		12: ParseCreateStringTable,
		13: ParseUpdateStringTable,
		14: ParseVoiceInit,
		15: ParseVoiceData,
		17: ParseParseSounds,
		18: ParserGenerator.make('setView', 'index{11}'),
		19: ParserGenerator.make('fixAngle', 'relative{b}x{16}y{16}z{16}'),
		21: ParseBSPDecal,
		23: ParseUserMessage,
		24: ParseEntityMessage,
		25: ParseGameEvent,
		26: ParsePacketEntities,
		27: ParseTempEntities,
		28: ParserGenerator.make('preFetch', 'index{14}'),
		29: ParseMenu,
		30: ParseGameEventList,
		31: ParserGenerator.make('getCvarValue', 'cookie{32}value{s}'),
		32: ParseCmdKeyValues,
	};

	public parse() {
		const packets: IPacket[] = [];
		let lastPacketType     = 0;
		while (this.bitsLeft > 6) { // last 6 bits for NOOP
			const type = this.stream.readBits(6);
			if (type !== 0) {
				if (Packet.parsers[type]) {
					const skip = this.skippedPackets.indexOf(type) !== -1;
					const packet = Packet.parsers[type].call(this, this.stream, this.match, skip);
					packets.push(packet);
				} else {
					throw new Error('Unknown packet type ' + type + ' just parsed a ' + PacketType[lastPacketType]);
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

export enum PacketType {
	file              = 2,
	netTick           = 3,
	stringCmd         = 4,
	setConVar         = 5,
	sigOnState        = 6,
	print             = 7,
	serverInfo        = 8,
	classInfo         = 10,
	setPause          = 11,
	createStringTable = 12,
	updateStringTable = 13,
	voiceInit         = 14,
	voiceData         = 15,
	parseSounds       = 17,
	setView           = 18,
	fixAngle          = 19,
	bspDecal          = 21,
	userMessage       = 23,
	entityMessage     = 24,
	gameEvent         = 25,
	packetEntities    = 26,
	tempEntities      = 27,
	preFetch          = 28,
	menu              = 29,
	gameEventList     = 30,
	getCvarValue      = 30,
	cmdKeyValues      = 32,
}
