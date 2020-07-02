import { Packet, PacketMapType, PacketType } from '../../Data/Packet';
import { UserMessagePacketType } from '../../Data/UserMessage';
import { PacketHandler } from './Parser';
export interface NamedPacketHandler<P extends Packet, N extends PacketType | UserMessagePacketType> extends PacketHandler<P> {
    name: N;
}
export declare function make<T extends PacketType | UserMessagePacketType>(name: T, definition: string, nameKey?: string, extraData?: any): NamedPacketHandler<PacketMapType[T], T>;
