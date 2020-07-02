import { SendPropDefinition } from './SendPropDefinition';
import { Vector } from './Vector';
export declare class SendProp {
    static areEqual(a: SendProp, b: SendProp): boolean;
    private static valuesAreEqual;
    definition: SendPropDefinition;
    value: SendPropValue | null;
    constructor(definition: SendPropDefinition);
    clone(): SendProp;
}
export declare type SendPropArrayValue = Vector | number | string;
export declare type SendPropValue = Vector | number | string | SendPropArrayValue[];
