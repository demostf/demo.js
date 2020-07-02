import { SendPropDefinition } from './SendPropDefinition';
export declare type SendTableName = string;
export declare class SendTable {
    name: SendTableName;
    props: SendPropDefinition[];
    needsDecoder: boolean;
    private cachedFlattenedProps;
    constructor(name: any);
    addProp(prop: any): void;
    getAllProps(excludes: SendPropDefinition[], props: SendPropDefinition[]): void;
    getAllPropsIteratorProps(excludes: SendPropDefinition[], props: SendPropDefinition[], childProps: SendPropDefinition[]): void;
    readonly flattenedProps: SendPropDefinition[];
    readonly excludes: SendPropDefinition[];
    private flatten;
}
