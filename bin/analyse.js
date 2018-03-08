const Demo = require('../index');
const ParseMode = require('../build/Demo').ParseMode;
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2), {boolean: true});

if (argv._.length !== 1) {
    console.log('Usage: "node analyse [--strings] [--slow] [--dump] [--head] [--event-list] [--create-event-definitions] FILE"');
    process.exit(1);
}

const echo = function (data) {
    const string = JSON.stringify(data, null, 2);
    console.log(string);
};

fs.readFile(argv._[0], function (err, data) {
    if (err) throw err;
    const demo = Demo.fromNodeBuffer(data);
    const analyser = demo.getAnalyser(argv.slow ? 1 : 0);
    const head = analyser.getHeader();
    if (argv.head) {
        echo(head);
        return;
    }
    const match = analyser.getBody();
    if (argv['create-event-definitions']) {
        const definitions = Array.from(match.eventDefinitions.values());
        const definition = definitions
                .map(createEventDefinition)
                .join('\n\n')
            + '\n\n' + createEventDefinitionUnion(definitions) + '\n\n'
            + 'export type GameEventType = GameEvent[\'name\'];\n\n'
            + createEventTypeMap(definitions) + '\n\n'
            + createEventTypeIdMap(match.eventDefinitions) + '\n';
        console.log(definition);
    } else if (argv['event-list']) {
        echo(Array.from(match.eventDefinitions.values()));
    } else if (argv.dump) {
        echo(match.packets);
    } else if (argv.strings) {
        echo(match.strings);
    } else {
        echo(match.getState());
    }
});

function getEventTypeName(s) {
    const name = s.replace(/(\_\w)/g, function (m) {
        return m[1].toUpperCase();
    }).replace(/\b[a-z]/g, function (letter) {
        return letter.toUpperCase();
    });
    if (EventNameReplace.has(name)) {
        return EventNameReplace.get(name);
    } else {
        return name
            .replace('Teamplay', 'TeamPlay')
            .replace('death', 'Death')
            .replace('panel', 'Panel')
            .replace('object', 'Object')
            .replace('update', 'Update')
            .replace('ready', 'Ready')
            .replace('Gameui', 'GameUI')
            .replace('onhit', 'OnHit')
            .replace('bymedic', 'ByMedic')
            .replace('Controlpoint', 'ControlPoint')
            .replace('Pipebomb', 'PipeBomb')
            .replace('Scorestats', 'ScoreStats')
            .replace('Creditbonus', 'CreditBonus')
            .replace('Sentrybuster', 'SentryBuster')
            .replace('Questlog', 'QuestLog')
            .replace('Localplayer', 'LocalPlayer')
            .replace('Minigame', 'MiniGame')
            .replace('Winlimit', 'WinLimit')
            .replace('Hltv', 'HLTV');
    }
}

function getEntryTypeDefinition(typeId) {
    switch (typeId) {
        case 1:
            return 'string';
        case 2:
        case 3:
        case 4:
        case 5:
            return 'number';
        case 6:
            return 'boolean';
        case 7:
            return 'null';
    }
}

function createEventDefinition(definition) {
    return `
export interface ${getEventTypeName(definition.name)}Event {
	name: '${definition.name}';
	values: {
${definition.entries.map(entry => `		${entry.name}: ${getEntryTypeDefinition(entry.type)};`).join('\n')}
	};
}`.trim()
}

function createEventDefinitionUnion(definitions) {
    return `export type GameEvent = ` +
        definitions.map(definition => '\t' + getEventTypeName(definition.name) + 'Event')
            .join(' |\n').trim()
        + ';';
}

function createEventTypeMap(definitions) {
    return `export type GameEventTypeMap = {
${definitions.map(definition => `	${definition.name}: ${getEventTypeName(definition.name)}Event;`).join('\n')}
};`;
}

function createEventTypeIdMap(definitionMap) {
    const definitionEntries = Array.from(definitionMap.entries());
    return `export type GameEventTypeId = number;

export const GameEventTypeIdMap: Map<GameEventType, GameEventTypeId> = new Map<GameEventType, GameEventTypeId>([
${definitionEntries.map(([typeId, definition]) => `	['${definition.name}', ${typeId}],`).join('\n')}
]);`;
}

const EventNameReplace = new Map([
    ['ReplayReplaysavailable', 'ReplayReplaysAvailable'],
    ['ServerAddban', 'ServerAddBan'],
    ['ServerRemoveban', 'ServerRemoveBan'],
    ['ClientBeginconnect', 'ClientBeginConnect'],
    ['ClientFullconnect', 'ClientFullConnect'],
    ['PlayerChangename', 'PlayerChangeName'],
    ['PlayerHintmessage', 'PlayerHintMessage'],
    ['GameNewmap', 'GameNewMap'],
    ['IntroNextcamera', 'IntroNextCamera'],
    ['PlayerChangeclass', 'PlayerChangeClass'],
    ['ControlpointInitialized', 'ControlPointInitialized'],
    ['ControlpointUpdateimages', 'ControlPointUpdateImages'],
    ['ControlpointUpdatelayout', 'ControlPointUpdateLayout'],
    ['ControlpointUpdatecapping', 'ControlPointUpdateCapping'],
    ['ControlpointUpdateowner', 'ControlPointUpdateOwner'],
    ['ControlpointStarttouch', 'ControlPointStartTouch'],
    ['ControlpointEndtouch', 'ControlPointEndTouch'],
    ['ControlpointPulseElement', 'ControlPointPulseElement'],
    ['ControlpointFakeCapture', 'ControlPointFakeCapture'],
    ['ControlpointFakeCaptureMult', 'ControlPointFakeCaptureMult'],
    ['TeamplayWaitingAbouttoend', 'TeamPlayWaitingAboutToEnd'],
    ['TeamplayPointStartcapture', 'TeamPlayPointStartCapture'],
    ['FreezecamStarted', 'FreezeCamStarted'],
    ['LocalplayerChangeteam', 'LocalPlayerChangeTeam'],
    ['LocalplayerChangeclass', 'LocalPlayerChangeClass'],
    ['LocalplayerChangedisguise', 'LocalPlayerChangeDisguise'],
    ['FlagstatusUpdate', 'FlagStatusUpdate'],
    ['TournamentEnablecountdown', 'TournamentEnableCountdown'],
    ['PlayerCalledformedic', 'PlayerCalledForMedic'],
    ['PlayerAskedforball', 'PlayerAskedForBall'],
    ['LocalplayerBecameobserver', 'LocalPlayerBecameObserver'],
    ['PlayerHealedmediccall', 'PlayerHealedMedicCall'],
    ['ArenaMatchMaxstreak', 'ArenaMatchMaxStreak'],
    ['StatsResetround', 'StatsResetRound'],
    ['FishNotice_arm', 'FishNoticeArm'],
    ['PlayerBonuspoints', 'PlayerBonusPoints'],
    ['PlayerUsedPowerupBottle', 'PlayerUsedPowerUpBottle'],
    ['ReplayStartrecord', 'ReplayStartRecord'],
    ['ReplaySessioninfo', 'ReplaySessionInfo'],
    ['ReplayEndrecord', 'ReplayEndRecord'],
    ['ReplayServererror', 'ReplayServerError']
]);
