import {BitStream} from 'bit-buffer';
import {DynamicBitView} from './DynamicBitView';

export class DynamicBitStream extends BitStream {
	constructor(initialByteSize: number = 16 * 1024) {
		super(new DynamicBitView(new ArrayBuffer(initialByteSize)));
	}

	get length() {
		return this.view.byteLength * 8;
	}
}
