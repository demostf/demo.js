import {SayText2Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';

export function SayText2(stream: BitStream): SayText2Packet { // 4: SayText2
	var client = stream.readBits(8);
	var raw    = stream.readBits(8);
	var pos    = stream.index;
	var from, text, kind, arg1, arg2;
	if (stream.readBits(8) === 1) {
		var first = stream.readBits(8);
		if (first === 7) {
			var color = stream.readUTF8String(6);
		} else {
			stream.index = pos + 8;
		}
		text = stream.readUTF8String();
		if (text.substr(0, 6) === '*DEAD*') {
			// grave talk is in the format '*DEAD* \u0003$from\u0001:    $text'
			var start = text.indexOf('\u0003');
			var end   = text.indexOf('\u0001');
			from      = text.substr(start + 1, end - start - 1);
			text      = text.substr(end + 5);
			kind      = 'TF_Chat_AllDead';
		}
	} else {
		stream.index = pos;
		kind          = stream.readUTF8String();
		from          = stream.readUTF8String();
		text          = stream.readUTF8String();
		stream.readASCIIString();
		stream.readASCIIString();
	}
	// cleanup color codes
	text = text.replace(/\u0001/g, '');
	text = text.replace(/\u0003/g, '');
	while ((pos = text.indexOf('\u0007')) !== -1) {
		text = text.slice(0, pos) + text.slice(pos + 7);
	}
	return {
		packetType: 'sayText2',
		client:     client,
		raw:        raw,
		kind:       kind,
		from:       from,
		text:       text
	}
};
