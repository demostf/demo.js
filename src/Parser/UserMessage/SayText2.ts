import {BitStream} from 'bit-buffer';
import {SayText2Packet} from '../../Data/Packet';

export function SayText2(stream: BitStream): SayText2Packet { // 4: SayText2
	const client = stream.readBits(8);
	const raw = stream.readBits(8);
	const pos = stream.index;
	let from;
	let text;
	let kind;
	if (stream.readBits(8) === 1) {
		const first = stream.readBits(8);
		if (first === 7) {
			const color = stream.readUTF8String(6);
		} else {
			stream.index = pos + 8;
		}
		text = stream.readUTF8String();
		if (text.substr(0, 6) === '*DEAD*') {
			// grave talk is in the format '*DEAD* \u0003$from\u0001:    $text'
			const start = text.indexOf('\u0003');
			const end = text.indexOf('\u0001');
			from = text.substr(start + 1, end - start - 1);
			text = text.substr(end + 5);
			kind = 'TF_Chat_AllDead';
		}
	} else {
		stream.index = pos;
		kind = stream.readUTF8String();
		from = stream.readUTF8String();
		text = stream.readUTF8String();
		stream.readASCIIString();
		stream.readASCIIString();
	}
	// cleanup color codes
	text = text.replace(/\u0001/g, '');
	text = text.replace(/\u0003/g, '');
	let stringPos = text.indexOf('\u0007');
	while (stringPos !== -1) {
		text = text.slice(0, stringPos) + text.slice(stringPos + 7);
		stringPos = text.indexOf('\u0007');
	}
	return {
		packetType: 'sayText2',
		client,
		raw,
		kind,
		from,
		text,
	};
}
