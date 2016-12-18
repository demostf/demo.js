import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function SetConVar(stream: BitStream): Packet { // 5: setconvar
	const count = stream.readBits(8);
	let vars = {};
	for (let i = 0; i < count; i++) {
		vars[stream.readUTF8String()] = stream.readUTF8String();
	}
	return {
		packetType: 'setConVar',
		vars: vars
	}
}
