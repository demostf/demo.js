import { BitStream } from 'bit-buffer';
import { SendPropArrayValue, SendPropValue } from '../Data/SendProp';
import { SendPropDefinition } from '../Data/SendPropDefinition';
import { Vector } from '../Data/Vector';
export declare class SendPropEncoder {
    static encode(value: SendPropValue, propDefinition: SendPropDefinition, stream: BitStream): any;
    static writeInt(value: number, propDefinition: SendPropDefinition, stream: BitStream): any;
    static writeArray(value: SendPropArrayValue[], propDefinition: SendPropDefinition, stream: BitStream): void;
    static writeString(value: string, stream: BitStream): void;
    static writeVector(value: Vector, propDefinition: SendPropDefinition, stream: BitStream): void;
    static writeVectorXY(value: Vector, propDefinition: SendPropDefinition, stream: BitStream): void;
    static writeFloat(value: number, propDefinition: SendPropDefinition, stream: BitStream): any;
    static writeBitNormal(value: number, stream: BitStream): void;
    static writeBitCoord(value: number, stream: BitStream): void;
    static writeBitCoordMP(value: number, stream: BitStream, isIntegral: boolean, isLowPrecision: boolean): void;
}
