"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("./Vector");
class SendProp {
    static areEqual(a, b) {
        return a.definition.fullName !== b.definition.fullName ? false : SendProp.valuesAreEqual(a.value, b.value);
    }
    static valuesAreEqual(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) {
                return false;
            }
            for (let i = 0; i < a.length; i++) {
                if (!SendProp.valuesAreEqual(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        else if (a instanceof Vector_1.Vector && b instanceof Vector_1.Vector) {
            return Vector_1.Vector.areEqual(a, b);
        }
        else {
            return a === b;
        }
    }
    constructor(definition) {
        this.definition = definition;
        this.value = null;
    }
    clone() {
        const prop = new SendProp(this.definition);
        prop.value = this.value;
        return prop;
    }
}
exports.SendProp = SendProp;
//# sourceMappingURL=SendProp.js.map