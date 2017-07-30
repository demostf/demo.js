import {ConsoleCmdPacket} from '../../Data/Packet';
import {Parser} from './Parser';

export class ConsoleCmd extends Parser {
	public parse(): ConsoleCmdPacket[] {
		return [{
			packetType: 'consoleCmd',
			command: this.stream.readUTF8String(),
		}];
	}
}
