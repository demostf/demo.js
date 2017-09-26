import {BitView} from 'bit-buffer';

export class DynamicBitView extends BitView {
	// tslint:disable-next-line
	protected _view: Uint8Array;

	public setBits(offset: number, value: number, bits: number) {
		const available = (this.byteLength * 8 - offset);

		if (bits > available) {
			this.grow();
		}
		return super.setBits(offset, value, bits);
	}

	public grow() {
		const newView = new Uint8Array(this.byteLength * 2);
		newView.set(this._view);
		this._view = newView;
	}
}
