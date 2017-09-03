import {BitStream} from 'bit-buffer';
import {SayText2Packet} from '../../Data/Packet';

export function ParseSayText2(stream: BitStream): SayText2Packet { // 4: ParseSayText2
	const client = stream.readUint8();
	const raw = stream.readUint8();
	const pos = stream.index;
	let from;
	let text;
	let kind;
	if (stream.readUint8() === 1) {
		const first = stream.readUint8();
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
		// maybe always 2 null bytes?
		// stream.readASCIIString();
		// stream.readASCIIString();
		stream.readUint16();
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

export function EncodeSayText2(packet: SayText2Packet, stream: BitStream) {
	stream.writeUint8(packet.client);
	stream.writeUint8(packet.raw);

	if (packet.kind === 'TF_Chat_AllDead') {
		const rawText = `*DEAD* \u0003${packet.from}\u0001:    ${packet.text}`;
		stream.writeUTF8String(rawText);
	} else {
		stream.writeUTF8String(packet.kind);
		stream.writeUTF8String(packet.from);
		stream.writeUTF8String(packet.text);
		stream.writeUint16(0);
	}
}
