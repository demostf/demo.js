import {Packet} from "../../Data/Packet";
import {BitStream} from 'bit-buffer';
import {GameEventDefinitionMap} from "../../Data/GameEvent";
import {Match} from "../../Data/Match";
import {Entity} from "../../Data/Entity";

export type Parser = (stream: BitStream, gameEventMap?: GameEventDefinitionMap, entities?: Entity[], match?: Match) => Packet;
export type PacketParserMap = {[id: number]: Parser};
