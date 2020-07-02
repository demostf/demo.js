"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bit_buffer_1 = require("bit-buffer");
const DynamicBitView_1 = require("./DynamicBitView");
class DynamicBitStream extends bit_buffer_1.BitStream {
    constructor(initialByteSize = 16 * 1024) {
        super(new DynamicBitView_1.DynamicBitView(new ArrayBuffer(initialByteSize)));
    }
    get length() {
        return this.view.byteLength * 8;
    }
}
exports.DynamicBitStream = DynamicBitStream;
//# sourceMappingURL=DynamicBitStream.js.map