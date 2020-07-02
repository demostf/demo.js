import { BitStream } from 'bit-buffer';
import { SendPropArrayValue, SendPropValue } from '../Data/SendProp';
import { SendPropDefinition } from '../Data/SendPropDefinition';
import { Vector } from '../Data/Vector';
export declare const bitNormalFactor: number;
export declare class SendPropParser {
    static decode(propDefinition: SendPropDefinition, stream: BitStream): SendPropValue;
    static readInt(propDefinition: SendPropDefinition, stream: BitStream): number;
    static readArray(propDefinition: SendPropDefinition, stream: BitStream): SendPropArrayValue[];
    static readString(stream: BitStream): string;
    static readVector(propDefinition: SendPropDefinition, stream: BitStream): Vector;
    static readVectorXY(propDefinition: SendPropDefinition, stream: BitStream): Vector;
    static readFloat(propDefinition: SendPropDefinition, stream: BitStream): number;
    static readBitNormal(stream: BitStream): number;
    static readBitCoord(stream: BitStream): number;
    static readBitCoordMP(stream: BitStream, isIntegral: boolean, isLowPrecision: boolean): number;
}
