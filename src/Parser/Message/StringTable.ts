import {Parser} from './Parser';
import {StringTableEntry, StringTable as StringTableObject} from "../../Data/StringTable";
import {StringTablePacket} from "../../Data/Packet";

export class StringTable extends Parser {
	parse(): StringTablePacket[] {
		// we get the tables from the packets
		// return [{
		// 	packetType: 'stringTable',
		// 	tables:     []
		// }];
		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount                = this.stream.readUint8();
		let tables: StringTableObject[] = [];
		let extraDataLength;
		for (let i = 0; i < tableCount; i++) {
			let entries: StringTableEntry[] = [];
			const tableName                 = this.stream.readASCIIString();
			const entryCount                = this.stream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				let entry: StringTableEntry;
				try {
					entry = {
						text: this.stream.readUTF8String()
					};
				} catch (e) {
					return [{
						packetType: 'stringTable',
						tables:     tables
					}];
				}
				if (this.stream.readBoolean()) {
					extraDataLength = this.stream.readUint16();
					if ((extraDataLength * 8) > this.stream.bitsLeft) {
						// extradata to long, can't continue parsing the tables
						// seems to happen in POV demos after the MyM update
						return [{
							packetType: 'stringTable',
							tables:     tables
						}];
					}
					entry.extraData = this.stream.readBitStream(extraDataLength * 8);
				}
				entries.push(entry);
			}
			const table: StringTableObject = {
				entries,
				name:       tableName,
				maxEntries: entryCount
			};
			tables.push(table);
			if (this.stream.readBits(1)) {
				this.stream.readASCIIString();
				if (this.stream.readBits(1)) {
					//throw 'more extra data not implemented';
					extraDataLength = this.stream.readBits(16);
					this.stream.readBits(extraDataLength);
				}
			}
		}
		return [{
			packetType: 'stringTable',
			tables:     tables
		}];
	}

	readExtraData(length): string[] {
		const end          = this.stream.index + (length * 8);
		let data: string[] = [];
		//console.log(this.stream.readUTF8String());
		data.push(this.stream.readUTF8String());
		while (this.stream.index < end && this.stream.index < (this.stream.length - 7)) { // -7 because we need a full byte
			try {
				let string = this.stream.readUTF8String();
				if (string) {
					data.push(string);
				}
			} catch (e) {
				return data;
			}
		}
		this.stream.index = end;
		return data;
	}
}
