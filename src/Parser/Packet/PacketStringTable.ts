import {BitStream} from "bit-buffer";
import {Packet} from "../../Data/Packet";

export function PacketStringTable(stream: BitStream):Packet {
	//todo
	// https://coldemoplayer.googlecode.com/svn/branches/2.0/code/plugins/CDP.Source/Messages/SvcCreateStringTable.cs
	stream._index = stream._view._view.byteLength * 8;
	return {
		packetType: 'stringTableTODO'
	};
}
