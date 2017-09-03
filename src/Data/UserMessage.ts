import {BasePacket} from './Packet';
import {BitStream} from 'bit-buffer';

export enum UserMessageType {
	Geiger = 0,
	Train = 1,
	HudText = 2,
	SayText = 3,
	SayText2 = 4,
	TextMsg = 5,
	ResetHUD = 6,
	GameTitle = 7,
	ItemPickup = 8,
	ShowMenu = 9,
	Shake = 10,
	Fade = 11,
	VGUIMenu = 12,
	Rumble = 13,
	CloseCaption = 14,
	SendAudio = 15,
	VoiceMask = 16,
	RequestState = 17,
	Damage = 18,
	HintText = 19,
	KeyHintText = 20,
	HudMsg = 21,
	AmmoDenied = 22,
	AchievementEvent = 23,
	UpdateRadar = 24,
	VoiceSubtitle = 25,
	HudNotify = 26,
	HudNotifyCustom = 27,
	PlayerStatsUpdate = 28,
	PlayerIgnited = 29,
	PlayerIgnitedInv = 30,
	HudArenaNotify = 31,
	UpdateAchievement = 32,
	TrainingMsg = 33,
	TrainingObjective = 34,
	DamageDodged = 35,
	PlayerJarated = 36,
	PlayerExtinguished = 37,
	PlayerJaratedFade = 38,
	PlayerShieldBlocked = 39,
	BreakModel = 40,
	CheapBreakModel = 41,
	BreakModel_Pumpkin = 42,
	BreakModelRocketDud = 43,
	CallVoteFailed = 44,
	VoteStart = 45,
	VotePass = 46,
	VoteFailed = 47,
	VoteSetup = 48,
	PlayerBonusPoints = 49,
	SpawnFlyingBird = 50,
	PlayerGodRayEffect = 51,
	SPHapWeapEvent = 52,
	HapDmg = 53,
	HapPunch = 54,
	HapSetDrag = 55,
	HapSet = 56,
	HapMeleeContact = 57,
}

export interface BaseDataUserPacket extends BasePacket {
	data: number;
}

export interface SayText2Packet extends BasePacket {
	packetType: 'sayText2';
	client: number;
	raw: number;
	kind: 'TF_Chat_All' | 'TF_Chat_Team' | 'TF_Chat_AllDead';
	from: string;
	text: string;
}

export enum HudTextLocation {
	HUD_PRINTNOTIFY = 1,
	HUD_PRINTCONSOLE = 2,
	HUD_PRINTTALK = 3,
	HUD_PRINTCENTER = 4
}

export interface TextMessagePacket extends BasePacket {
	packetType: 'textMsg';
	destType: HudTextLocation;
	text: string;
}

export interface ResetHUDPacket extends BaseDataUserPacket {
	packetType: 'resetHUD';
}

export interface TrainPacket extends BaseDataUserPacket {
	packetType: 'train';
}

export interface VoiceSubtitlePacket extends BasePacket {
	packetType: 'voiceSubtitle';
	client: number;
	menu: number;
	item: number;
}

export interface ShakePacket extends BasePacket {
	packetType: 'shake';
	command: number;
	amplitude: number;
	frequency: number;
	duration: number;
}

export interface UnknownUserMessageBasePacket extends BasePacket {
	data: BitStream;
	type: number;
}

export interface BreakModelPumpkinPacket extends UnknownUserMessageBasePacket {
	packetType: 'breakModelPumpkin';
}

export interface GenericUnknownUserMessagePacket extends UnknownUserMessageBasePacket {
	packetType: 'unknownUserMessage';
}

export type UnknownUserMessagePacket = GenericUnknownUserMessagePacket |
	BreakModelPumpkinPacket;

export type UserMessagePacket = SayText2Packet
	| TextMessagePacket
	| ResetHUDPacket
	| UnknownUserMessagePacket
	| TrainPacket
	| VoiceSubtitlePacket
	| BreakModelPumpkinPacket
	| ShakePacket;

export type UserMessageTypeMap = {
	sayText2: SayText2Packet;
	textMsg: TextMessagePacket;
	unknownUserMessage: GenericUnknownUserMessagePacket;
	train: TrainPacket;
	voiceSubtitle: VoiceSubtitlePacket;
	breakModelPumpkin: BreakModelPumpkinPacket;
	resetHUD: ResetHUDPacket;
	shake: ShakePacket;
}

export const UserMessagePacketTypeMap: Map<UserMessagePacket['packetType'], UserMessageType> = new Map<UserMessagePacket['packetType'], UserMessageType>([
	['sayText2', UserMessageType.SayText2],
	['textMsg', UserMessageType.TextMsg],
	['train', UserMessageType.Train],
	['voiceSubtitle', UserMessageType.VoiceSubtitle],
	['breakModelPumpkin', UserMessageType.BreakModel_Pumpkin],
	['resetHUD', UserMessageType.ResetHUD],
	['shake', UserMessageType.Shake]
]);
