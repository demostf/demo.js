import {BitStream} from 'bit-buffer';
import {SetConVarPacket} from '../../Data/Packet';

export function ParseSetConVar(stream: BitStream): SetConVarPacket { // 5: setconvar
	const count = stream.readUint8();
	const vars: Map<string, string> = new Map();
	for (let i = 0; i < count; i++) {
		const key = stream.readUTF8String();
		const value = stream.readUTF8String();
		vars.set(key, value);
	}
	return {
		packetType: 'setConVar',
		vars
	};
}

export function EncodeSetConVar(packet: SetConVarPacket, stream: BitStream) {
	stream.writeUint8(packet.vars.size);
	for (const [key, value] of packet.vars.entries()) {
		stream.writeUTF8String(key);
		stream.writeUTF8String(value);
	}
}
