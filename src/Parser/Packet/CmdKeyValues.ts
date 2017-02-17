import {CmdKeyValuesPacket} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function CmdKeyValues(stream: BitStream): CmdKeyValuesPacket {
	//'length{32}data{$length}'
	const length = stream.readUint32();
	const data   = stream.readBitStream(length);
	return {
		packetType: 'cmdKeyValues',
		length:     length,
		data:       data
	};
}
