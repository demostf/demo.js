import {Building, Dispenser, Sentry, Teleporter} from '../Data/Building';
import {Match} from '../Data/Match';
import {PacketMessage} from '../Data/Message';
import {PacketEntitiesPacket} from '../Data/Packet';
import {PacketEntity, PVS} from '../Data/PacketEntity';
import {ParserState} from '../Data/ParserState';
import {LifeState, Player} from '../Data/Player';
import {SendProp} from '../Data/SendProp';
import {TeamNumber} from '../Data/Team';
import {Vector} from '../Data/Vector';
import {CWeaponMedigun, Weapon} from '../Data/Weapon';
import {handleBaseEntity} from './BaseEntityHandler';
import {handleHL2DMEntity} from './HL2DMEntityHandler';
import {handleTFEntity} from './TFEntityHandler';

export function handlePacketEntities(packet: PacketEntitiesPacket, match: Match, message: PacketMessage) {
	for (const entity of packet.entities) {
		handleBaseEntity(entity, match, message);
		switch (match.parserState.game) {
			case 'tf':
				handleTFEntity(entity, match, message);
				break;
			case 'hl2mp':
				handleHL2DMEntity(entity, match, message);
				break;
		}
	}
}

export function handlePacketEntitiesForState(packet: PacketEntitiesPacket, state: ParserState) {
	for (const removedEntityId of packet.removedEntities) {
		state.entityClasses.delete(removedEntityId);
	}

	for (const entity of packet.entities) {
		saveEntity(entity, state);
	}
}

function saveEntity(packetEntity: PacketEntity, state: ParserState) {
	if (packetEntity.pvs === PVS.DELETE) {
		state.entityClasses.delete(packetEntity.entityIndex);
	}

	state.entityClasses.set(packetEntity.entityIndex, packetEntity.serverClass);
}
