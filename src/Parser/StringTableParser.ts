import {BitStream} from 'bit-buffer';
import {StringTable, StringTableEntry} from "../Data/StringTable";
import {logBase2} from "../Math";
import {Match} from "../Data/Match";

export function parseStringTable(stream: BitStream, table: StringTable, entries: number, match: Match) {
	const entryBits = logBase2(table.maxEntries);
	let lastEntry   = -1;

	const history: StringTableEntry[] = [];

	for (let i = 0; i < entries; i++) {
		let entryIndex = lastEntry + 1;

		if (!stream.readBoolean()) {
			entryIndex = stream.readBits(entryBits);
		}

		lastEntry = entryIndex;

		if (entryIndex < 0 || entryIndex > table.maxEntries) {
			throw new Error("Invalid string index for stringtable");
		}

		let value;

		if (stream.readBoolean()) {
			const subStringCheck = stream.readBoolean();

			if (subStringCheck) {
				const index       = stream.readBits(5);
				const bytesToCopy = stream.readBits(5);

				const restOfString = stream.readASCIIString();

				value = history[index].text.substr(0, bytesToCopy) + restOfString;
			} else {
				value = stream.readASCIIString();
			}
		}

		let userData: BitStream|undefined;

		if (stream.readBoolean()) {
			if (table.fixedUserDataSize && table.fixedUserDataSizeBits) {
				userData = stream.readBitStream(table.fixedUserDataSizeBits);
			} else {
				const userDataBytes = stream.readBits(14);
				userData            = stream.readBitStream(userDataBytes * 8);
			}
		}

		if (table.entries[entryIndex]) {
			const existingEntry = table.entries[entryIndex];
			if (userData) {
				existingEntry.extraData = userData;
			}
			history.push(existingEntry);

			if (value) {
				existingEntry.text = value;
			}
		} else {
			table.entries[entryIndex] = {
				text:      value,
				extraData: userData
			};
			history.push(table.entries[entryIndex]);
		}
		if (history.length > 32) {
			history.shift();
		}
	}
}
