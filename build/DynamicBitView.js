"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bit_buffer_1 = require("bit-buffer");
class DynamicBitView extends bit_buffer_1.BitView {
    setBits(offset, value, bits) {
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
exports.DynamicBitView = DynamicBitView;
//# sourceMappingURL=DynamicBitView.js.map