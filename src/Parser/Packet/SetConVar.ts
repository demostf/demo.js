import {BitStream} from 'bit-buffer';
import {SetConVarPacket} from '../../Data/Packet';

export function ParseSetConVar(stream: BitStream): SetConVarPacket { // 5: setconvar
	const count = stream.readUint8();
	const vars: { [key: string]: string } = {};
	for (let i = 0; i < count; i++) {
		vars[stream.readUTF8String()] = stream.readUTF8String();
	}
	return {
		packetType: 'setConVar',
		vars,
	};
}

export function EncodeSetConVar(packet: SetConVarPacket, stream: BitStream) {
	const keys = Object.keys(packet.vars);
	stream.writeUint8(keys.length);
	for (const key of keys) {
		stream.writeUTF8String(key);
		stream.writeUTF8String(packet.vars[key]);
	}
}
