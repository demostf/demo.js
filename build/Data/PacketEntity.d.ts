import { SendProp, SendPropValue } from './SendProp';
import { SendPropDefinition } from './SendPropDefinition';
import { ServerClass } from './ServerClass';
export declare enum PVS {
    PRESERVE = 0,
    ENTER = 1,
    LEAVE = 2,
    DELETE = 4
}
export declare type EntityId = number;
export declare class PacketEntity {
    static getPropByFullName(props: SendProp[], fullName: string): SendProp | null;
    serverClass: ServerClass;
    entityIndex: EntityId;
    props: SendProp[];
    inPVS: boolean;
    pvs: PVS;
    serialNumber?: number;
    delay?: number;
    constructor(serverClass: ServerClass, entityIndex: number, pvs: PVS);
    getPropByDefinition(definition: SendPropDefinition): SendProp | null;
    getProperty(originTable: string, name: string): SendProp;
    hasProperty(originTable: string, name: string): boolean;
    clone(): PacketEntity;
    applyPropUpdate(props: SendProp[]): void;
    diffFromBaseLine(baselineProps: SendProp[]): SendProp[];
    getPropValue(fullName: string): SendPropValue | null;
}
