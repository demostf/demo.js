import {Match} from '../Data/Match';
import {SayText2Packet} from '../Data/UserMessage';

export function handleSayText2(packet: SayText2Packet, match: Match) {
	if (packet.kind === '#TF_Name_Change') {
		for (const user of match.users.values()) {
			if (user.name === packet.from) {
				user.name = packet.text;
			}
		}
		return;
	}

	match.chat.push({
		kind: packet.kind,
		from: packet.from,
		text: packet.text,
		tick: match.tick
	});
}
