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

const mapToObj = m => {
    return Array.from(m).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
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
    const state = demo.getParser().parserState;
    if (argv['dump-props']) {
        let props = Array.from(
            demo.getParser().parserState.sendTables
            .entries()
        ).map(([key, sendTable]) => [key, sendTable.flattenedProps.map(prop => prop.fullName)]);
        echo(mapToObj(new Map(props)));
    } else if (argv['create-event-definitions']) {
        const definitions = Array.from(state.eventDefinitions.values());
        const definition = definitions
                .map(createEventDefinition)
                .join('\n\n')
            + '\n\n' + createEventDefinitionUnion(definitions) + '\n\n'
            + 'export type GameEventType = GameEvent[\'name\'];\n\n'
            + createEventTypeMap(definitions) + '\n\n'
            + createEventTypeIdMap(state.eventDefinitions) + '\n';
        console.log(definition);
    } else if (argv['create-event-definitions-rs']) {
        const definitions = Array.from(state.eventDefinitions.values()).map(definition => {
            definition.entries = definition.entries.map(entry => {
                if (entry.name === "type") {
                    entry.name = "kind";
                }
                return entry;
            });
            return definition;
        });
        const definition = 'use crate::{Result, ParseError, GameEventError};\n' +
            'use super::gamevent::{FromGameEventValue, GameEventValue, FromRawGameEvent, RawGameEvent};\n' +
            '\n\n' +
            '// auto generated, nobody in their right mind would write this manually\n\n'
            + definitions
            .map(createEventStructRS)
            .join('\n') + '\n\n'
            + '#[derive(Debug)]\n'
            + 'pub enum GameEvent {\n'
            + definitions
                .map(createEventDefinitionRS)
                .join(',\n')
            + ',\n\tUnknown(RawGameEvent),'
            + '\n}\n\n'
            + '#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]\n'
            + 'pub enum GameEventType {\n'
            + definitions
                .map(createEventTypeDefinitionRS)
                .join(',\n')
            + ',\n\t'
            + '\n\tUnknown,'
            + '\n}'
            + '\n\nimpl GameEventType {'
            + '\n\tpub fn from_type_name(name: &str) -> Self {\n'
            + '\t\tmatch name {\n'
            + definitions
                .map(createEventTypeDefinitionMatchRS)
                .join(',\n')
            + ',\n\t\t\t_ => GameEventType::Unknown\n'
            + '\t\t}\n'
            + '\t}\n'
            + '}\n'
            + '\n\nimpl GameEvent {'
            + '\n\tpub fn from_raw_event(event: RawGameEvent) -> Result<Self> {\n'
            + '\t\tOk(match event.event_type {\n'
            + definitions
                .map(createEventDefinitionMatch)
                .join(',\n') + ',\n'
            + '\t\t\tGameEventType::Unknown => GameEvent::Unknown(event),\n'
            + '\t\t})\n'
            + '\t}\n'
            + '}\n';
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

function getEventTypeNameRS(s) {
    return getEventTypeName(s) + 'Event';
}

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
            .replace('Skillrating', 'SkillRating')
            .replace('Directhit', 'DirectHit')
            .replace('Chargedeployed', 'ChargeDeployed')
            .replace('Winddown', 'WindDown')
            .replace('Stealsandvich', 'StealSandvich')
            .replace('Pricesheet', 'PriceSheet')
            .replace('Teambalanced', 'TeamBalanced')
            .replace('Highfive', 'HighFive')
            .replace('Powerup', 'PowerUp')
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

function getEntryTypeDefinitionRS(typeId) {
    switch (typeId) {
        case 1:
            return 'String';
        case 2:
            return 'f32';
        case 3:
            return 'u32';
        case 4:
            return 'u16';
        case 5:
            return 'u8';
        case 6:
            return 'bool';
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

function createEventStructRS(definition) {
    let structName = getEventTypeNameRS(definition.name);
    let reverseEntries = ([].concat(definition.entries)).reverse();
    return `#[derive(Debug)]\npub struct ${structName} {
${definition.entries.map(entry => `\tpub ${getEntryNameRS(entry.name)}: ${getEntryTypeDefinitionRS(entry.type)},`).join('\n')}
}
impl FromRawGameEvent for ${getEventTypeNameRS(definition.name)} {
    fn from_raw_event(mut ${definition.entries.length ? '' : '_'}values: Vec<GameEventValue>) -> Result<Self> {
        ${definition.entries.length ? `if values.len() < ${definition.entries.length} {
            return Err(ParseError::MalformedGameEvent(GameEventError::IncorrectValueCount));
        }\n\t\tvalues.truncate(${definition.entries.length});`: ''}
${reverseEntries.map((entry, index) => `\t\tlet ${getEntryNameRS(entry.name)}: ${getEntryTypeDefinitionRS(entry.type)} = ${getEntryTypeDefinitionRS(entry.type)}::from_value(values.pop().ok_or(ParseError::MalformedGameEvent(GameEventError::IncorrectValueCount))?, "${getEntryNameRS(entry.name)}")?;`).join('\n')}
        Ok(${structName} {
${definition.entries.map(entry => `\t\t\t${getEntryNameRS(entry.name)}`).join(',\n')}
        })
    }
}
`
}

function camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function getEntryNameRS(name) {
    return camelToSnake(name)
        .replace('mapname', 'map_name')
        .replace('cvarname', 'cvar_name')
        .replace('cvarvalue', 'cvar_value')
        .replace('userid', 'user_id')
        .replace('networkid', 'network_id')
        .replace('teamid', 'team_id')
        .replace('teamname', 'team_name')
        .replace('oldteam', 'old_team')
        .replace('autoteam', 'auto_team')
        .replace('entindex', 'ent_index')
        .replace('weaponid', 'weapon_id')
        .replace('damagebit', 'damage_bit')
        .replace('customkill', 'custom_kill')
        .replace('logclassname', 'log_class_name')
        .replace('playerpenetratecount', 'player_penetrate_count')
        .replace('damageamount', 'damage_amount')
        .replace('showdisguisedcrit', 'show_disguised_crit')
        .replace('minicrit', 'mini_crit')
        .replace('allseecrit', 'all_see_crit')
        .replace('weaponid', 'weapon_id')
        .replace('bonuseffect', 'bonus_effect')
        .replace('teamonly', 'team_only')
        .replace('oldname', 'old_name')
        .replace('newname', 'new_name')
        .replace('hintmessage', 'hint_message')
        .replace('roundslimit', 'rounds_limit')
        .replace('timelimit', 'time_limit')
        .replace('fraglimit', 'frag_limit')
        .replace('numadvanced', 'num_advanced')
        .replace('numbronze', 'num_bronze')
        .replace('numsilver', 'num_silver')
        .replace('numgold', 'num_gold')
        .replace('oldmode', 'old_mode')
        .replace('newmode', 'new_mode')
        .replace('entityid', 'entity_id')
        .replace('winreason', 'win_reason')
        .replace('flagcaplimit', 'flag_cap_limit')
        .replace('cpname', 'cp_name')
        .replace('capteam', 'cap_team')
        .replace('captime', 'cap_time')
        .replace('eventtype', 'event_type')
        .replace('killstreak', 'kill_stream')
        .replace('forceupload', 'force_upload')
        .replace('targetid', 'target_id')
        .replace('isbuilder', 'is_builder')
        .replace('objecttype', 'object_type')
        .replace('namechange', 'name_change')
        .replace('readystate', 'ready_state')
        .replace('builderid', 'builder_id')
        .replace('recedetime', 'recede_time')
        .replace('ownerid', 'owner_id')
        .replace('sapperid', 'sapper_id')
        .replace('itemdef', 'item_def')
        .replace('bitfield', 'bit_field')
        .replace('playsound', 'play_sound')
        .replace('totalhits', 'total_hits')
        .replace('posx', 'pos_x')
        .replace('posy', 'pos_y')
        .replace('posz', 'pos_z')
        .replace('ineye', 'in_eye')
        .replace('maxplayers', 'max_players');
}

function createEventTypeDefinitionRS(definition) {
    return `\t${getEventTypeName(definition.name)} = ${definition.id}`
}

function createEventDefinitionRS(definition) {
    return `\t${getEventTypeName(definition.name)}(${getEventTypeName(definition.name)}Event)`
}

function createEventDefinitionMatch(definition) {
    let structName = getEventTypeName(definition.name);
    return `\t\t\tGameEventType::${structName} => GameEvent::${structName}(${structName}Event::from_raw_event(event.values)?)`
}

function createEventTypeDefinitionMatchRS(definition) {
    let structName = getEventTypeName(definition.name);
    return `\t\t\t"${definition.name}" => GameEventType::${structName}`
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
    ['ControlpointFakeCaptureMult', 'ControlPointFakeCaptureMultiplier'],
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
