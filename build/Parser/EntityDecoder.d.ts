import { BitStream } from 'bit-buffer';
import { SendProp } from '../Data/SendProp';
import { SendTable } from '../Data/SendTable';
export declare function getEntityUpdate(sendTable: SendTable, stream: BitStream): SendProp[];
export declare function encodeEntityUpdate(props: SendProp[], sendTable: SendTable, stream: BitStream): void;
