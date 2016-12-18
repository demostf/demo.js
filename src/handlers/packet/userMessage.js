var ParserGenerator = require('../../parsergenerator');

var userMessageParsers = {
	4: require('../userMessage/SayText2'),
	5: ParserGenerator.make('textMsg', 'destType{8}text{s}')
};

module.exports = function (stream) { // 23: user message
	var type = stream.readBits(8);
	var length = stream.readBits(11);
	var pos = stream._index;
	if (userMessageParsers[type]) {
		var result = userMessageParsers[type](stream);
	} else {
		result = {
			packetType: 'unknownUserMessage',
			type      : type
		}
	}
	stream._index = pos + length;
	return result;
};

var UserMessageType = {
	Geiger             : 0,
	Train              : 1,
	HudText            : 2,
	SayText            : 3,
	SayText2           : 4,
	TextMsg            : 5,
	ResetHUD           : 6,
	GameTitle          : 7,
	ItemPickup         : 8,
	ShowMenu           : 9,
	Shake              : 10,
	Fade               : 11,
	VGUIMenu           : 12,
	Rumble             : 13,
	CloseCaption       : 14,
	SendAudio          : 15,
	VoiceMask          : 16,
	RequestState       : 17,
	Damage             : 18,
	HintText           : 19,
	KeyHintText        : 20,
	HudMsg             : 21,
	AmmoDenied         : 22,
	AchievementEvent   : 23,
	UpdateRadar        : 24,
	VoiceSubtitle      : 25,
	HudNotify          : 26,
	HudNotifyCustom    : 27,
	PlayerStatsUpdate  : 28,
	PlayerIgnited      : 29,
	PlayerIgnitedInv   : 30,
	HudArenaNotify     : 31,
	UpdateAchievement  : 32,
	TrainingMsg        : 33,
	TrainingObjective  : 34,
	DamageDodged       : 35,
	PlayerJarated      : 36,
	PlayerExtinguished : 37,
	PlayerJaratedFade  : 38,
	PlayerShieldBlocked: 39,
	BreakModel         : 40,
	CheapBreakModel    : 41,
	BreakModel_Pumpkin : 42,
	BreakModelRocketDud: 43,
	CallVoteFailed     : 44,
	VoteStart          : 45,
	VotePass           : 46,
	VoteFailed         : 47,
	VoteSetup          : 48,
	PlayerBonusPoints  : 49,
	SpawnFlyingBird    : 50,
	PlayerGodRayEffect : 51,
	SPHapWeapEvent     : 52,
	HapDmg             : 53,
	HapPunch           : 54,
	HapSetDrag         : 55,
	HapSet             : 56,
	HapMeleeContact    : 57
};
