import {Parser} from './Parser';
import {StringTableEntry} from "../../Data/StringTable";

export class StringTable extends Parser {
	parse() {
		// https://github.com/StatsHelix/demoinfo/blob/3d28ea917c3d44d987b98bb8f976f1a3fcc19821/DemoInfo/ST/StringTableParser.cs
		const tableCount = this.stream.readUint8();
		let tables = {};
		let extraDataLength;
		for (let i = 0; i < tableCount; i++) {
			let entries:StringTableEntry[] = [];
			const tableName = this.stream.readASCIIString();
			const entryCount = this.stream.readUint16();
			for (let j = 0; j < entryCount; j++) {
				let entry;
				try {
					entry = {
						text: this.stream.readUTF8String()
					};
				} catch (e) {
					return [{
						packetType: 'stringTable',
						tables: tables
					}];
				}
				if (this.stream.readBits(1)) {
					extraDataLength = this.stream.readUint16();
					if (tableName === 'instancebaseline') {
						this.match.staticBaseLines[parseInt(entry.text, 10)] = this.stream.readBitStream(8 * extraDataLength);
					} else {
						entry.extraData = this.readExtraData(extraDataLength);
					}
				}
				entries.push(entry);
			}
			tables[tableName] = entries;
			this.match.stringTables.push({
				name: tableName,
				entries: entries
			});
			if (this.stream.readBits(1)) {
				this.stream.readASCIIString();
				if (this.stream.readBits(1)) {
					//throw 'more extra data not implemented';
					extraDataLength = this.stream.readBits(16);
					this.stream.readBits(extraDataLength);
				}
			}
		}
		//console.log(tables);
		return [{
			packetType: 'stringTable',
			tables: tables
		}];
	}

	readExtraData(length):string[] {
		const end = this.stream._index + (length * 8);
		let data:string[] = [];
		//console.log(this.stream.readUTF8String());
		data.push(this.stream.readUTF8String());
		while (this.stream._index < end) {
			try {
				let string = this.stream.readUTF8String();
				if (string) {
					data.push(string);
				}
			} catch (e) {
				return data;
			}
		}
		this.stream._index = end;
		return data;
	}
}
