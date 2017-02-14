import {DataTablePacket} from "../Data/Packet";
import {Match} from "../Data/Match";

export function handleDataTable(packet: DataTablePacket, match: Match) {
	match.sendTables    = packet.tables;
	match.serverClasses = packet.serverClasses;
}
