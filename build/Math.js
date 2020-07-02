"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logBase2(num) {
    let result = 0;
    num >>= 1;
    while (num !== 0 && result < 32) {
        result++;
        num >>= 1;
    }
    return result;
}
exports.logBase2 = logBase2;
//# sourceMappingURL=Math.js.map