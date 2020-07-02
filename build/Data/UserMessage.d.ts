import { BitStream } from 'bit-buffer';
export declare enum UserMessageType {
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
    HapMeleeContact = 57
}
export interface BaseDataUserPacket {
    data: number;
}
export interface SayText2Packet {
    packetType: 'userMessage';
    userMessageType: 'sayText2';
    client: number;
    raw: number;
    kind: 'TF_Chat_All' | 'TF_Chat_Team' | 'TF_Chat_AllDead' | '#TF_Name_Change';
    from: string;
    text: string;
}
export declare enum HudTextLocation {
    HUD_PRINTNOTIFY = 1,
    HUD_PRINTCONSOLE = 2,
    HUD_PRINTTALK = 3,
    HUD_PRINTCENTER = 4
}
export interface TextMessagePacket {
    packetType: 'userMessage';
    userMessageType: 'textMsg';
    destType: HudTextLocation;
    text: string;
}
export interface ResetHUDPacket extends BaseDataUserPacket {
    packetType: 'userMessage';
    userMessageType: 'resetHUD';
}
export interface TrainPacket extends BaseDataUserPacket {
    packetType: 'userMessage';
    userMessageType: 'train';
}
export interface VoiceSubtitlePacket {
    packetType: 'userMessage';
    userMessageType: 'voiceSubtitle';
    client: number;
    menu: number;
    item: number;
}
export interface ShakePacket {
    packetType: 'userMessage';
    userMessageType: 'shake';
    command: number;
    amplitude: number;
    frequency: number;
    duration: number;
}
export interface UnknownUserMessageBasePacket {
    data: BitStream;
    type: number;
}
export interface BreakModelPumpkinPacket extends UnknownUserMessageBasePacket {
    packetType: 'userMessage';
    userMessageType: 'breakModelPumpkin';
}
export interface GenericUnknownUserMessagePacket extends UnknownUserMessageBasePacket {
    packetType: 'userMessage';
    userMessageType: 'unknownUserMessage';
}
export declare type UnknownUserMessagePacket = GenericUnknownUserMessagePacket | BreakModelPumpkinPacket;
export declare type UserMessagePacket = SayText2Packet | TextMessagePacket | ResetHUDPacket | UnknownUserMessagePacket | TrainPacket | VoiceSubtitlePacket | BreakModelPumpkinPacket | ShakePacket;
export declare type UserMessagePacketType = UserMessagePacket['userMessageType'];
export interface UserMessageTypeMap {
    sayText2: SayText2Packet;
    textMsg: TextMessagePacket;
    unknownUserMessage: GenericUnknownUserMessagePacket;
    train: TrainPacket;
    voiceSubtitle: VoiceSubtitlePacket;
    breakModelPumpkin: BreakModelPumpkinPacket;
    resetHUD: ResetHUDPacket;
    shake: ShakePacket;
}
export declare const UserMessagePacketTypeMap: Map<UserMessagePacketType, UserMessageType>;
