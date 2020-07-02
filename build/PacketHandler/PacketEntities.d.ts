import { Match } from '../Data/Match';
import { PacketMessage } from '../Data/Message';
import { PacketEntitiesPacket } from '../Data/Packet';
import { ParserState } from '../Data/ParserState';
export declare function handlePacketEntities(packet: PacketEntitiesPacket, match: Match, message: PacketMessage): void;
export declare function handlePacketEntitiesForState(packet: PacketEntitiesPacket, state: ParserState): void;
