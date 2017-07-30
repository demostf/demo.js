import {BitStream} from 'bit-buffer';
import {SetConVarPacket} from '../../Data/Packet';

export function SetConVar(stream: BitStream): SetConVarPacket { // 5: setconvar
	const count                       = stream.readBits(8);
	const vars: {[key: string]: string} = {};
	for (let i = 0; i < count; i++) {
		vars[stream.readUTF8String()] = stream.readUTF8String();
	}
	return {
		packetType: 'setConVar',
		vars,
	};
}
