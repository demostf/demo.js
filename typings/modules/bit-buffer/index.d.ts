export interface BitView {
	length: number;
}

export interface BitStream {
	byteIndex: number;
	buffer: Buffer;
	_view: BitView;
	_index: number;
	readBits(bits: number, signed?: boolean): number;
	readWrite(value: number, bits: number);

	readBoolean(): boolean;
	readInt8(): number;
	readUint8(): number;
	readInt16(): number;
	readUint16(): number;
	readInt32(): number;
	readUint32(): number;
	readFloat32(): number;
	readFloat64(): number;

	writeBoolean(value: number);
	writeInt8(value: number);
	writeUint8(value: number);
	writeInt16(value: number);
	writeUint16(value: number);
	writeInt32(value: number);
	writeUint32(value: number);
	writeFloat32(value: number);
	writeFloat64(value: number);

	readASCIIString(length?: number): string;
	readUTF8String(length?: number): string;

	writeASCIIString(data: string, length?: number);
	writeUTF8String(data: string, length?: number);

	readBitStream(length: number): BitStream;
}
