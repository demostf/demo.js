"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserMessageType;
(function (UserMessageType) {
    UserMessageType[UserMessageType["Geiger"] = 0] = "Geiger";
    UserMessageType[UserMessageType["Train"] = 1] = "Train";
    UserMessageType[UserMessageType["HudText"] = 2] = "HudText";
    UserMessageType[UserMessageType["SayText"] = 3] = "SayText";
    UserMessageType[UserMessageType["SayText2"] = 4] = "SayText2";
    UserMessageType[UserMessageType["TextMsg"] = 5] = "TextMsg";
    UserMessageType[UserMessageType["ResetHUD"] = 6] = "ResetHUD";
    UserMessageType[UserMessageType["GameTitle"] = 7] = "GameTitle";
    UserMessageType[UserMessageType["ItemPickup"] = 8] = "ItemPickup";
    UserMessageType[UserMessageType["ShowMenu"] = 9] = "ShowMenu";
    UserMessageType[UserMessageType["Shake"] = 10] = "Shake";
    UserMessageType[UserMessageType["Fade"] = 11] = "Fade";
    UserMessageType[UserMessageType["VGUIMenu"] = 12] = "VGUIMenu";
    UserMessageType[UserMessageType["Rumble"] = 13] = "Rumble";
    UserMessageType[UserMessageType["CloseCaption"] = 14] = "CloseCaption";
    UserMessageType[UserMessageType["SendAudio"] = 15] = "SendAudio";
    UserMessageType[UserMessageType["VoiceMask"] = 16] = "VoiceMask";
    UserMessageType[UserMessageType["RequestState"] = 17] = "RequestState";
    UserMessageType[UserMessageType["Damage"] = 18] = "Damage";
    UserMessageType[UserMessageType["HintText"] = 19] = "HintText";
    UserMessageType[UserMessageType["KeyHintText"] = 20] = "KeyHintText";
    UserMessageType[UserMessageType["HudMsg"] = 21] = "HudMsg";
    UserMessageType[UserMessageType["AmmoDenied"] = 22] = "AmmoDenied";
    UserMessageType[UserMessageType["AchievementEvent"] = 23] = "AchievementEvent";
    UserMessageType[UserMessageType["UpdateRadar"] = 24] = "UpdateRadar";
    UserMessageType[UserMessageType["VoiceSubtitle"] = 25] = "VoiceSubtitle";
    UserMessageType[UserMessageType["HudNotify"] = 26] = "HudNotify";
    UserMessageType[UserMessageType["HudNotifyCustom"] = 27] = "HudNotifyCustom";
    UserMessageType[UserMessageType["PlayerStatsUpdate"] = 28] = "PlayerStatsUpdate";
    UserMessageType[UserMessageType["PlayerIgnited"] = 29] = "PlayerIgnited";
    UserMessageType[UserMessageType["PlayerIgnitedInv"] = 30] = "PlayerIgnitedInv";
    UserMessageType[UserMessageType["HudArenaNotify"] = 31] = "HudArenaNotify";
    UserMessageType[UserMessageType["UpdateAchievement"] = 32] = "UpdateAchievement";
    UserMessageType[UserMessageType["TrainingMsg"] = 33] = "TrainingMsg";
    UserMessageType[UserMessageType["TrainingObjective"] = 34] = "TrainingObjective";
    UserMessageType[UserMessageType["DamageDodged"] = 35] = "DamageDodged";
    UserMessageType[UserMessageType["PlayerJarated"] = 36] = "PlayerJarated";
    UserMessageType[UserMessageType["PlayerExtinguished"] = 37] = "PlayerExtinguished";
    UserMessageType[UserMessageType["PlayerJaratedFade"] = 38] = "PlayerJaratedFade";
    UserMessageType[UserMessageType["PlayerShieldBlocked"] = 39] = "PlayerShieldBlocked";
    UserMessageType[UserMessageType["BreakModel"] = 40] = "BreakModel";
    UserMessageType[UserMessageType["CheapBreakModel"] = 41] = "CheapBreakModel";
    UserMessageType[UserMessageType["BreakModel_Pumpkin"] = 42] = "BreakModel_Pumpkin";
    UserMessageType[UserMessageType["BreakModelRocketDud"] = 43] = "BreakModelRocketDud";
    UserMessageType[UserMessageType["CallVoteFailed"] = 44] = "CallVoteFailed";
    UserMessageType[UserMessageType["VoteStart"] = 45] = "VoteStart";
    UserMessageType[UserMessageType["VotePass"] = 46] = "VotePass";
    UserMessageType[UserMessageType["VoteFailed"] = 47] = "VoteFailed";
    UserMessageType[UserMessageType["VoteSetup"] = 48] = "VoteSetup";
    UserMessageType[UserMessageType["PlayerBonusPoints"] = 49] = "PlayerBonusPoints";
    UserMessageType[UserMessageType["SpawnFlyingBird"] = 50] = "SpawnFlyingBird";
    UserMessageType[UserMessageType["PlayerGodRayEffect"] = 51] = "PlayerGodRayEffect";
    UserMessageType[UserMessageType["SPHapWeapEvent"] = 52] = "SPHapWeapEvent";
    UserMessageType[UserMessageType["HapDmg"] = 53] = "HapDmg";
    UserMessageType[UserMessageType["HapPunch"] = 54] = "HapPunch";
    UserMessageType[UserMessageType["HapSetDrag"] = 55] = "HapSetDrag";
    UserMessageType[UserMessageType["HapSet"] = 56] = "HapSet";
    UserMessageType[UserMessageType["HapMeleeContact"] = 57] = "HapMeleeContact";
})(UserMessageType = exports.UserMessageType || (exports.UserMessageType = {}));
var HudTextLocation;
(function (HudTextLocation) {
    HudTextLocation[HudTextLocation["HUD_PRINTNOTIFY"] = 1] = "HUD_PRINTNOTIFY";
    HudTextLocation[HudTextLocation["HUD_PRINTCONSOLE"] = 2] = "HUD_PRINTCONSOLE";
    HudTextLocation[HudTextLocation["HUD_PRINTTALK"] = 3] = "HUD_PRINTTALK";
    HudTextLocation[HudTextLocation["HUD_PRINTCENTER"] = 4] = "HUD_PRINTCENTER";
})(HudTextLocation = exports.HudTextLocation || (exports.HudTextLocation = {}));
exports.UserMessagePacketTypeMap = new Map([
    ['sayText2', UserMessageType.SayText2],
    ['textMsg', UserMessageType.TextMsg],
    ['train', UserMessageType.Train],
    ['voiceSubtitle', UserMessageType.VoiceSubtitle],
    ['breakModelPumpkin', UserMessageType.BreakModel_Pumpkin],
    ['resetHUD', UserMessageType.ResetHUD],
    ['shake', UserMessageType.Shake],
    ['unknownUserMessage', -1]
]);
//# sourceMappingURL=UserMessage.js.map