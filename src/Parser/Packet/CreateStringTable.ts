import {StringTablePacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {logBase2} from "../../Math";
import {readVarInt} from "../readBitVar";

import {uncompress} from "snappyjs";
import {StringTable} from "../../Data/StringTable";
import {parseStringTable} from "../StringTableParser";
import {Match} from "../../Data/Match";

export function CreateStringTable(stream: BitStream, match: Match): StringTablePacket { // 12: createStringTable
	const tableName   = stream.readASCIIString();
	const maxEntries  = stream.readUint16();
	const encodeBits  = logBase2(maxEntries);
	const entityCount = stream.readBits(encodeBits + 1);

	const bitCount = readVarInt(stream);

	let userDataSize     = 0;
	let userDataSizeBits = 0;

	// userdata fixed size
	if (stream.readBoolean()) {
		userDataSize     = stream.readBits(12);
		userDataSizeBits = stream.readBits(4);
	}

	const isCompressed = stream.readBoolean();

	let data = stream.readBitStream(bitCount);

	if (isCompressed) {
		const decompressedByteSize = data.readUint32();
		const compressedByteSize   = data.readUint32();

		const magic = data.readASCIIString(4);

		const compressedData = data.readArrayBuffer(compressedByteSize - 4); // 4 magic bytes

		if (magic !== 'SNAP') {
			throw new Error("Unknown compressed stringtable format");
		}

		const decompressedData = uncompress(compressedData);
		if (decompressedData.byteLength !== decompressedByteSize) {
			throw new Error("Incorrect length of decompressed stringtable");
		}

		data = new BitStream(decompressedData.buffer);
	}

	const table: StringTable = {
		name:                  tableName,
		entries:               [],
		maxEntries:            maxEntries,
		fixedUserDataSize:     userDataSize,
		fixedUserDataSizeBits: userDataSizeBits
	};

	parseStringTable(data, table, entityCount, match);

	match.stringTables.push(table);
	return {
		packetType: 'stringTable',
		tables:      [table]
	};
}
