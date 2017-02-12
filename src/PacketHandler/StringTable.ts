import {StringTablePacket} from "../Data/Packet";
import {Match} from "../Data/Match";

export function handleStringTable(packet: StringTablePacket, match: Match) {
	for (const table of packet.tables) {
		if (table.name === 'userinfo') {
			for (const userData of table.entries) {
				if (userData.extraData) {
					if (userData.extraData.bitsLeft > (32 * 8)) {
						const name    = userData.extraData.readUTF8String(32);
						const userId  = userData.extraData.readUint32();
						const steamId = userData.extraData.readUTF8String();
						if (steamId) {
							const userState    = match.getUserInfo(userId);
							userState.name     = name;
							userState.steamId  = steamId;
							userState.entityId = parseInt(userData.text, 10) + 1;
						}
					}
				}
			}
		}
	}
}
