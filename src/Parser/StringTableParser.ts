import {BitStream} from 'bit-buffer';
import {StringTable, StringTableEntry} from '../Data/StringTable';
import {logBase2} from '../Math';

export function parseStringTableEntries(
	stream: BitStream,
	table: StringTable,
	entryCount: number,
	existingEntries: StringTableEntry[] = []
): StringTableEntry[] {
	const entryBits = logBase2(table.maxEntries);
	const entries: StringTableEntry[] = [];
	let lastEntry = -1;

	const history: StringTableEntry[] = [];

	for (let i = 0; i < entryCount; i++) {
		const entryIndex = !stream.readBoolean() ? stream.readBits(entryBits) : lastEntry + 1;

		lastEntry = entryIndex;

		if (entryIndex < 0 || entryIndex > table.maxEntries) {
			throw new Error('Invalid string index for string table');
		}

		let value;

		if (stream.readBoolean()) {
			const subStringCheck = stream.readBoolean();

			if (subStringCheck) {
				const index = stream.readBits(5);
				const bytesToCopy = stream.readBits(5);

				const restOfString = stream.readASCIIString();

				if (!history[index].text) {
					value = restOfString; // best guess, happens in some pov demos but only for unimportant tables it seems
				} else {
					value = history[index].text.substr(0, bytesToCopy) + restOfString;
				}
			} else {
				value = stream.readASCIIString();
			}
		}

		let userData: BitStream | undefined;

		if (stream.readBoolean()) {
			if (table.fixedUserDataSize && table.fixedUserDataSizeBits) {
				userData = stream.readBitStream(table.fixedUserDataSizeBits);
			} else {
				const userDataBytes = stream.readBits(14);
				userData = stream.readBitStream(userDataBytes * 8);
			}
		}

		if (existingEntries[entryIndex]) {
			const existingEntry: StringTableEntry = {...existingEntries[entryIndex]};
			if (userData) {
				existingEntry.extraData = userData;
			}

			if (typeof value !== 'undefined') {
				existingEntry.text = value;
			}
			entries[entryIndex] = existingEntry;
			history.push(existingEntry);
		} else {
			entries[entryIndex] = {
				text: value,
				extraData: userData
			};
			history.push(entries[entryIndex]);
		}
		if (history.length > 32) {
			history.shift();
		}
	}

	return entries;
}

export function guessStringTableEntryLength(table: StringTable, entries: StringTableEntry[]): number {
	// a rough guess of how many bytes are needed to encode the table entries
	const entryBits = Math.ceil(logBase2(table.maxEntries) / 8);
	return entries.reduce((length: number, entry: StringTableEntry) => {
		return length +
			entryBits +
			1 + // new index bit
			1 + // misc boolean
			1 + // substring bit
			(entry.text ? entry.text.length + 1 : 1) + // +1 for null termination
			(entry.extraData ? Math.ceil(entry.extraData.length / 8) : 0);
	}, 1);
}

export function encodeStringTableEntries(
	stream: BitStream,
	table: StringTable,
	entries: StringTableEntry[],
	oldEntries: StringTableEntry[] = []
) {
	const entryBits = logBase2(table.maxEntries);
	let lastIndex = -1;
	const history: StringTableEntry[] = [];
	for (let i = 0; i < entries.length; i++) {
		if (entries[i]) {

			const entry = entries[i];
			if (i !== (lastIndex + 1)) {
				stream.writeBoolean(false);
				stream.writeBits(i, entryBits);
			} else {
				stream.writeBoolean(true);
			}
			lastIndex = i;

			if (typeof entry.text !== 'undefined' && !(oldEntries[i] && entry.text === oldEntries[i].text)) {
				stream.writeBoolean(true);

				const {index, count} = getBestPreviousString(history, entry.text);
				if (index !== -1) {
					stream.writeBoolean(true);
					stream.writeBits(index, 5);
					stream.writeBits(count, 5);
					stream.writeASCIIString(entry.text.substr(count));
				} else {
					stream.writeBoolean(false);
					stream.writeASCIIString(entry.text);
				}
			} else {
				stream.writeBoolean(false);
			}

			if (entry.extraData) {
				stream.writeBoolean(true);

				entry.extraData.index = 0;
				if (table.fixedUserDataSize && table.fixedUserDataSizeBits) {
					stream.writeBitStream(entry.extraData, table.fixedUserDataSizeBits);
				} else {
					const byteLength = Math.ceil(entry.extraData.length / 8);
					stream.writeBits(byteLength, 14);
					stream.writeBitStream(entry.extraData, byteLength * 8);
				}
				entry.extraData.index = 0;
			} else {
				stream.writeBoolean(false);
			}

			history.push(entry);
			if (history.length > 32) {
				history.shift();
			}
		}
	}
}

function getBestPreviousString(history: StringTableEntry[], newString: string): {index: number, count: number} {
	let bestIndex = -1;
	let bestCount = 0;
	for (let i = 0; i < history.length; i++) {
		const prev = history[i].text;
		const similar = countSimilarCharacters(prev, newString);
		if (similar >= 3 && similar > bestCount) {
			bestCount = similar;
			bestIndex = i;
		}
	}
	return {
		index: bestIndex,
		count: bestCount
	};
}

const maxSimLength = 1 << 5;

function countSimilarCharacters(a: string, b: string) {
	const length = Math.min(a.length, b.length, maxSimLength);
	for (let i = 0; i < length; i++) {
		if (a[i] !== b[i]) {
			return i;
		}
	}
	return Math.min(length, maxSimLength - 1);
}
