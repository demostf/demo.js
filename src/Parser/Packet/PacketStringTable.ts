import {BitStream} from "bit-buffer";
import {Packet} from "../../Data/Packet";

export function PacketStringTable(stream: BitStream):Packet {
	//todo
	// https://coldemoplayer.googlecode.com/svn/branches/2.0/code/plugins/CDP.Source/Messages/SvcCreateStringTable.cs
	// throw new Error('packetstringtable not implemented');
	stream.index = stream.length; // no idea, skip to the end of the
	return {
		packetType: 'stringTableTODO'
	};
}
