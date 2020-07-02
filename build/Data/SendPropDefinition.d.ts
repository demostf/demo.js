import { SendTable } from './SendTable';
export declare class SendPropDefinition {
    static formatFlags(flags: number): string[];
    type: SendPropType;
    name: string;
    flags: number;
    excludeDTName: string | null;
    lowValue: number;
    highValue: number;
    bitCount: number;
    originalBitCount: number | null;
    table: SendTable | null;
    numElements: number;
    arrayProperty: SendPropDefinition | null;
    ownerTableName: string;
    constructor(type: SendPropType, name: string, flags: number, ownerTableName: string);
    hasFlag(flag: SendPropFlag): boolean;
    isExcludeProp(): boolean;
    inspect(): any;
    readonly fullName: string;
    readonly allFlags: string[];
}
export declare enum SendPropType {
    DPT_Int = 0,
    DPT_Float = 1,
    DPT_Vector = 2,
    DPT_VectorXY = 3,
    DPT_String = 4,
    DPT_Array = 5,
    DPT_DataTable = 6,
    DPT_NUMSendPropTypes = 7
}
export declare enum SendPropFlag {
    SPROP_UNSIGNED = 1,
    SPROP_COORD = 2,
    SPROP_NOSCALE = 4,
    SPROP_ROUNDDOWN = 8,
    SPROP_ROUNDUP = 16,
    SPROP_NORMAL = 32,
    SPROP_EXCLUDE = 64,
    SPROP_XYZE = 128,
    SPROP_INSIDEARRAY = 256,
    SPROP_PROXY_ALWAYS_YES = 512,
    SPROP_CHANGES_OFTEN = 1024,
    SPROP_IS_A_VECTOR_ELEM = 2048,
    SPROP_COLLAPSIBLE = 4096,
    SPROP_COORD_MP = 8192,
    SPROP_COORD_MP_LOWPRECISION = 16384,
    SPROP_COORD_MP_INTEGRAL = 32768,
    SPROP_VARINT = 32
}
