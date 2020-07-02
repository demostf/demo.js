"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    static areEqual(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map