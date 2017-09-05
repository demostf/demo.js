import {BitStream, BitView} from 'bit-buffer';

class DynamicBitView extends BitView {
	protected _view: Uint8Array;

	setBits(offset: number, value: number, bits: number) {
		const available = (this.byteLength * 8 - offset);

		if (bits > available) {
			this.grow();
		}
		return super.setBits(offset, value, bits);
	}

	grow() {
		const newView = new Uint8Array(this.byteLength * 2);
		newView.set(this._view);
		this._view = newView;
	}
}

export class DynamicBitStream extends BitStream {
	constructor(initialByteSize: number = 16 * 1024) {
		super(new DynamicBitView(new ArrayBuffer(initialByteSize)));
	}

	get length() {
		return this.view.byteLength * 8;
	}
}
