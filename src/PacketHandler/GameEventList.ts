import {GameEventListPacket} from "../Data/Packet";
import {Match} from "../Data/Match";

export function handleGameEventList(packet: GameEventListPacket, match: Match) {
	match.eventDefinitions = packet.eventList;
}
