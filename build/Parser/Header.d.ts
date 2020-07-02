import { BitStream } from 'bit-buffer';
import { Header } from '../Data/Header';
export declare function parseHeader(stream: BitStream): Header;
export declare function encodeHeader(header: Header, stream: BitStream): void;
