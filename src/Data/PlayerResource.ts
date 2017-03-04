export interface PlayerResource {
	ping: number;
	score: number;
	deaths: number;
	connected: boolean;
	team: number;
	alive: boolean;
	health: number;
	totalScore: number;
	maxHealth: number;
	maxBuffedHealth: number;
	playerClass: number;
	arenaSpectator: boolean;
	dominations: number;
	nextRespawn: number;
	chargeLevel: number;
	damage: number;
	damageAssists: number;
	healing: number;
	healingAssist: number;
	damageBlocked: number;
	bonusPoints: number;
	playerLevel: number;
	killStreak: number;
}
