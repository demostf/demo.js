import {Match} from '../Data/Match';
import {DataTablePacket} from '../Data/Packet';

export function handleDataTable(packet: DataTablePacket, match: Match) {
	match.sendTables    = packet.tables;
	match.serverClasses = packet.serverClasses;
}
