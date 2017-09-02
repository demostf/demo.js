import {Match} from '../Data/Match';
import {DataTablePacket} from '../Data/Packet';

export function handleDataTable(packet: DataTablePacket, match: Match) {
	for (const table of packet.tables) {
		match.sendTables.set(table.name, table);
	}
	match.serverClasses = packet.serverClasses;
}
