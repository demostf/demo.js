import { BitView } from 'bit-buffer';
export declare class DynamicBitView extends BitView {
    protected _view: Uint8Array;
    setBits(offset: number, value: number, bits: number): any;
    grow(): void;
}
