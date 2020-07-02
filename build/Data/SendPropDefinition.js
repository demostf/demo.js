"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SendPropDefinition {
    constructor(type, name, flags, ownerTableName) {
        this.originalBitCount = null;
        this.type = type;
        this.name = name;
        this.flags = flags;
        this.excludeDTName = null;
        this.lowValue = 0;
        this.highValue = 0;
        this.bitCount = 0;
        this.table = null;
        this.numElements = 0;
        this.arrayProperty = null;
        this.ownerTableName = ownerTableName;
    }
    static formatFlags(flags) {
        const names = [];
        for (const name in SendPropFlag) {
            if (SendPropFlag.hasOwnProperty(name)) {
                const flagValue = SendPropFlag[name];
                if (typeof flagValue === 'number') {
                    if (flags & flagValue) {
                        names.push(name);
                    }
                }
            }
        }
        return names;
    }
    hasFlag(flag) {
        return (this.flags & flag) !== 0;
    }
    isExcludeProp() {
        return this.hasFlag(SendPropFlag.SPROP_EXCLUDE);
    }
    inspect() {
        const data = {
            ownerTableName: this.ownerTableName,
            name: this.name,
            type: SendPropType[this.type],
            flags: this.flags,
            bitCount: this.bitCount
        };
        if (this.type === SendPropType.DPT_Float) {
            data.lowValue = this.lowValue;
            data.highValue = this.highValue;
        }
        if (this.type === SendPropType.DPT_DataTable && this.table) {
            data.excludeDTName = this.table.name;
        }
        return data;
    }
    get fullName() {
        return `${this.ownerTableName}.${this.name}`;
    }
    get allFlags() {
        return SendPropDefinition.formatFlags(this.flags);
    }
}
exports.SendPropDefinition = SendPropDefinition;
var SendPropType;
(function (SendPropType) {
    SendPropType[SendPropType["DPT_Int"] = 0] = "DPT_Int";
    SendPropType[SendPropType["DPT_Float"] = 1] = "DPT_Float";
    SendPropType[SendPropType["DPT_Vector"] = 2] = "DPT_Vector";
    SendPropType[SendPropType["DPT_VectorXY"] = 3] = "DPT_VectorXY";
    SendPropType[SendPropType["DPT_String"] = 4] = "DPT_String";
    SendPropType[SendPropType["DPT_Array"] = 5] = "DPT_Array";
    SendPropType[SendPropType["DPT_DataTable"] = 6] = "DPT_DataTable";
    SendPropType[SendPropType["DPT_NUMSendPropTypes"] = 7] = "DPT_NUMSendPropTypes";
})(SendPropType = exports.SendPropType || (exports.SendPropType = {}));
var SendPropFlag;
(function (SendPropFlag) {
    SendPropFlag[SendPropFlag["SPROP_UNSIGNED"] = 1] = "SPROP_UNSIGNED";
    SendPropFlag[SendPropFlag["SPROP_COORD"] = 2] = "SPROP_COORD";
    // Note that the bit count is ignored in this case.
    SendPropFlag[SendPropFlag["SPROP_NOSCALE"] = 4] = "SPROP_NOSCALE";
    SendPropFlag[SendPropFlag["SPROP_ROUNDDOWN"] = 8] = "SPROP_ROUNDDOWN";
    SendPropFlag[SendPropFlag["SPROP_ROUNDUP"] = 16] = "SPROP_ROUNDUP";
    SendPropFlag[SendPropFlag["SPROP_NORMAL"] = 32] = "SPROP_NORMAL";
    SendPropFlag[SendPropFlag["SPROP_EXCLUDE"] = 64] = "SPROP_EXCLUDE";
    SendPropFlag[SendPropFlag["SPROP_XYZE"] = 128] = "SPROP_XYZE";
    SendPropFlag[SendPropFlag["SPROP_INSIDEARRAY"] = 256] = "SPROP_INSIDEARRAY";
    // flattened property list. Its array will point at it when it needs to.
    SendPropFlag[SendPropFlag["SPROP_PROXY_ALWAYS_YES"] = 512] = "SPROP_PROXY_ALWAYS_YES";
    // SendProxy_DataTableToDataTable that always send the data to all clients.
    SendPropFlag[SendPropFlag["SPROP_CHANGES_OFTEN"] = 1024] = "SPROP_CHANGES_OFTEN";
    SendPropFlag[SendPropFlag["SPROP_IS_A_VECTOR_ELEM"] = 2048] = "SPROP_IS_A_VECTOR_ELEM";
    SendPropFlag[SendPropFlag["SPROP_COLLAPSIBLE"] = 4096] = "SPROP_COLLAPSIBLE";
    // (ie: for all automatically-chained base classes).
    // In this case, it can get rid of this SendPropDataTable altogether and spare the
    // trouble of walking the hierarchy more than necessary.
    SendPropFlag[SendPropFlag["SPROP_COORD_MP"] = 8192] = "SPROP_COORD_MP";
    SendPropFlag[SendPropFlag["SPROP_COORD_MP_LOWPRECISION"] = 16384] = "SPROP_COORD_MP_LOWPRECISION";
    // where the fractional component only gets a 3 bits instead of 5
    SendPropFlag[SendPropFlag["SPROP_COORD_MP_INTEGRAL"] = 32768] = "SPROP_COORD_MP_INTEGRAL";
    SendPropFlag[SendPropFlag["SPROP_VARINT"] = 32] = "SPROP_VARINT";
})(SendPropFlag = exports.SendPropFlag || (exports.SendPropFlag = {}));
//# sourceMappingURL=SendPropDefinition.js.map