import {BitStream} from 'bit-buffer';
import {CmdKeyValuesPacket} from '../../Data/Packet';

export function ParseCmdKeyValues(stream: BitStream): CmdKeyValuesPacket {
	const length = stream.readUint32();
	const data   = stream.readBitStream(length);
	// 'length{32}data{$length}'
	return {
		packetType: 'cmdKeyValues',
		length,
		data,
	};
}
