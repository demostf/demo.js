"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GameEvent_1 = require("../PacketHandler/GameEvent");
const PacketEntities_1 = require("../PacketHandler/PacketEntities");
const SayText2_1 = require("../PacketHandler/SayText2");
class Match {
    constructor(parserState) {
        this.tick = 0;
        this.chat = [];
        this.users = new Map();
        this.deaths = [];
        this.rounds = [];
        this.startTick = 0;
        this.intervalPerTick = 0;
        this.world = {
            boundaryMin: { x: 0, y: 0, z: 0 },
            boundaryMax: { x: 0, y: 0, z: 0 }
        };
        this.playerEntityMap = new Map();
        this.weaponMap = new Map();
        this.outerMap = new Map();
        this.teams = new Map();
        this.teamEntityMap = new Map();
        this.buildings = new Map();
        this.playerResources = [];
        this.parserState = parserState;
    }
    getState() {
        const users = {};
        for (const userEntity of this.parserState.userInfo.values()) {
            this.getUserInfo(userEntity.userId);
        }
        for (const [key, user] of this.users.entries()) {
            users[key] = {
                classes: user.classes,
                name: user.name,
                steamId: user.steamId,
                userId: user.userId
            };
            if (user.team) {
                users[key].team = user.team;
            }
        }
        return {
            chat: this.chat,
            users,
            deaths: this.deaths,
            rounds: this.rounds,
            startTick: this.startTick,
            intervalPerTick: this.intervalPerTick
        };
    }
    handlePacket(packet, message) {
        switch (packet.packetType) {
            case 'packetEntities':
                PacketEntities_1.handlePacketEntities(packet, this, message);
                break;
            case 'netTick':
                if (this.startTick === 0) {
                    this.startTick = packet.tick;
                }
                this.tick = packet.tick;
                break;
            case 'serverInfo':
                this.intervalPerTick = packet.intervalPerTick;
                break;
            case 'userMessage':
                switch (packet.userMessageType) {
                    case 'sayText2':
                        SayText2_1.handleSayText2(packet, this);
                        break;
                }
                break;
            case 'gameEvent':
                GameEvent_1.handleGameEvent(packet, this);
                break;
        }
    }
    getUserInfo(userId) {
        // no clue why it does this
        // only seems to be the case with per user ready
        while (userId > 256) {
            userId -= 256;
        }
        const user = this.users.get(userId);
        if (user && user.userId !== userId) {
            throw new Error(`Invalid user info id`);
        }
        if (!user) {
            const entityInfo = this.parserState.getUserEntityInfo(userId);
            const newUser = Object.assign({ classes: {}, team: '' }, entityInfo);
            this.users.set(userId, newUser);
            return newUser;
        }
        else if (!user.steamId) {
            const entityInfo = this.parserState.getUserEntityInfo(userId);
            if (entityInfo.steamId) {
                user.steamId = entityInfo.steamId;
                user.entityId = entityInfo.entityId;
                user.name = entityInfo.name;
            }
        }
        return user;
    }
    getUserInfoForEntity(entity) {
        for (const userEntity of this.parserState.userInfo.values()) {
            if (userEntity && userEntity.entityId === entity.entityIndex) {
                return this.getUserInfo(userEntity.userId);
            }
        }
        return null;
    }
    getPlayerByUserId(userId) {
        const user = this.getUserInfo(userId);
        const player = this.playerEntityMap.get(user.entityId);
        return player || null;
    }
}
exports.Match = Match;
//# sourceMappingURL=Match.js.map