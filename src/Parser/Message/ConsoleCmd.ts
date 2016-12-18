import {Parser} from './Parser';

export class ConsoleCmd extends Parser {
	parse() {
		return this.stream.readUTF8String();
	}
}
