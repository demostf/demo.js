import {StringTablePacket} from '../../Data/Packet';
import {StringTable as StringTableObject, StringTableEntry} from '../../Data/StringTable';
import {Parser} from './Parser';

export class StringTable extends Parser {
	public parse(): StringTablePacket[] {
		// we get the tables from the packets
		// return [{
		// 	packetType: 'stringTable',
		// 	tables:     []
		// }];
		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount = this.stream.readUint8();
		const tables: StringTableObject[] = [];
		let extraDataLength;
		for (let i = 0; i < tableCount; i++) {
			const entries: StringTableEntry[] = [];
			const tableName = this.stream.readASCIIString();
			const entryCount = this.stream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				let entry: StringTableEntry;
				try {
					entry = {
						text: this.stream.readUTF8String(),
					};
				} catch (e) {
					return [{
						packetType: 'stringTable',
						tables,
					}];
				}
				if (this.stream.readBoolean()) {
					extraDataLength = this.stream.readUint16();
					if ((extraDataLength * 8) > this.stream.bitsLeft) {
						// extradata to long, can't continue parsing the tables
						// seems to happen in POV demos after the MyM update
						return [{
							packetType: 'stringTable',
							tables,
						}];
					}
					entry.extraData = this.stream.readBitStream(extraDataLength * 8);
				}
				entries.push(entry);
			}
			const table: StringTableObject = {
				entries,
				name: tableName,
				maxEntries: entryCount,
			};
			tables.push(table);
			if (this.stream.readBits(1)) {
				this.stream.readASCIIString();
				if (this.stream.readBits(1)) {
					// throw 'more extra data not implemented';
					extraDataLength = this.stream.readBits(16);
					this.stream.readBits(extraDataLength);
				}
			}
		}
		return [{
			packetType: 'stringTable',
			tables,
		}];
	}
}
