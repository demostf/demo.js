export interface ServerSpawnEvent {
    name: 'server_spawn';
    values: {
        hostname: string;
        address: string;
        ip: number;
        port: number;
        game: string;
        mapname: string;
        maxplayers: number;
        os: string;
        dedicated: boolean;
        password: boolean;
    };
}
export interface ServerChangelevelFailedEvent {
    name: 'server_changelevel_failed';
    values: {
        levelname: string;
    };
}
export interface ServerShutdownEvent {
    name: 'server_shutdown';
    values: {
        reason: string;
    };
}
export interface ServerCvarEvent {
    name: 'server_cvar';
    values: {
        cvarname: string;
        cvarvalue: string;
    };
}
export interface ServerMessageEvent {
    name: 'server_message';
    values: {
        text: string;
    };
}
export interface ServerAddBanEvent {
    name: 'server_addban';
    values: {
        name: string;
        userid: number;
        networkid: string;
        ip: string;
        duration: string;
        by: string;
        kicked: boolean;
    };
}
export interface ServerRemoveBanEvent {
    name: 'server_removeban';
    values: {
        networkid: string;
        ip: string;
        by: string;
    };
}
export interface PlayerConnectEvent {
    name: 'player_connect';
    values: {
        name: string;
        index: number;
        userid: number;
        networkid: string;
        address: string;
        bot: number;
    };
}
export interface PlayerConnectClientEvent {
    name: 'player_connect_client';
    values: {
        name: string;
        index: number;
        userid: number;
        networkid: string;
        bot: number;
    };
}
export interface PlayerInfoEvent {
    name: 'player_info';
    values: {
        name: string;
        index: number;
        userid: number;
        networkid: string;
        bot: boolean;
    };
}
export interface PlayerDisconnectEvent {
    name: 'player_disconnect';
    values: {
        userid: number;
        reason: string;
        name: string;
        networkid: string;
        bot: number;
    };
}
export interface PlayerActivateEvent {
    name: 'player_activate';
    values: {
        userid: number;
    };
}
export interface PlayerSayEvent {
    name: 'player_say';
    values: {
        userid: number;
        text: string;
    };
}
export interface ClientDisconnectEvent {
    name: 'client_disconnect';
    values: {
        message: string;
    };
}
export interface ClientBeginConnectEvent {
    name: 'client_beginconnect';
    values: {
        address: string;
        ip: number;
        port: number;
        source: string;
    };
}
export interface ClientConnectedEvent {
    name: 'client_connected';
    values: {
        address: string;
        ip: number;
        port: number;
    };
}
export interface ClientFullConnectEvent {
    name: 'client_fullconnect';
    values: {
        address: string;
        ip: number;
        port: number;
    };
}
export interface HostQuitEvent {
    name: 'host_quit';
    values: {};
}
export interface TeamInfoEvent {
    name: 'team_info';
    values: {
        teamid: number;
        teamname: string;
    };
}
export interface TeamScoreEvent {
    name: 'team_score';
    values: {
        teamid: number;
        score: number;
    };
}
export interface TeamPlayBroadcastAudioEvent {
    name: 'teamplay_broadcast_audio';
    values: {
        team: number;
        sound: string;
        additional_flags: number;
    };
}
export interface PlayerTeamEvent {
    name: 'player_team';
    values: {
        userid: number;
        team: number;
        oldteam: number;
        disconnect: boolean;
        autoteam: boolean;
        silent: boolean;
        name: string;
    };
}
export interface PlayerClassEvent {
    name: 'player_class';
    values: {
        userid: number;
        class: string;
    };
}
export interface PlayerDeathEvent {
    name: 'player_death';
    values: {
        userid: number;
        victim_entindex: number;
        inflictor_entindex: number;
        attacker: number;
        weapon: string;
        weaponid: number;
        damagebits: number;
        customkill: number;
        assister: number;
        weapon_logclassname: string;
        stun_flags: number;
        death_flags: number;
        silent_kill: boolean;
        playerpenetratecount: number;
        assister_fallback: string;
        kill_streak_total: number;
        kill_streak_wep: number;
        kill_streak_assist: number;
        kill_streak_victim: number;
        ducks_streaked: number;
        duck_streak_total: number;
        duck_streak_assist: number;
        duck_streak_victim: number;
        rocket_jump: boolean;
        weapon_def_index: number;
        crit_type: number;
    };
}
export interface PlayerHurtEvent {
    name: 'player_hurt';
    values: {
        userid: number;
        health: number;
        attacker: number;
        damageamount: number;
        custom: number;
        showdisguisedcrit: boolean;
        crit: boolean;
        minicrit: boolean;
        allseecrit: boolean;
        weaponid: number;
        bonuseffect: number;
    };
}
export interface PlayerChatEvent {
    name: 'player_chat';
    values: {
        teamonly: boolean;
        userid: number;
        text: string;
    };
}
export interface PlayerScoreEvent {
    name: 'player_score';
    values: {
        userid: number;
        kills: number;
        deaths: number;
        score: number;
    };
}
export interface PlayerSpawnEvent {
    name: 'player_spawn';
    values: {
        userid: number;
        team: number;
        class: number;
    };
}
export interface PlayerShootEvent {
    name: 'player_shoot';
    values: {
        userid: number;
        weapon: number;
        mode: number;
    };
}
export interface PlayerUseEvent {
    name: 'player_use';
    values: {
        userid: number;
        entity: number;
    };
}
export interface PlayerChangeNameEvent {
    name: 'player_changename';
    values: {
        userid: number;
        oldname: string;
        newname: string;
    };
}
export interface PlayerHintMessageEvent {
    name: 'player_hintmessage';
    values: {
        hintmessage: string;
    };
}
export interface BasePlayerTeleportedEvent {
    name: 'base_player_teleported';
    values: {
        entindex: number;
    };
}
export interface GameInitEvent {
    name: 'game_init';
    values: {};
}
export interface GameNewMapEvent {
    name: 'game_newmap';
    values: {
        mapname: string;
    };
}
export interface GameStartEvent {
    name: 'game_start';
    values: {
        roundslimit: number;
        timelimit: number;
        fraglimit: number;
        objective: string;
    };
}
export interface GameEndEvent {
    name: 'game_end';
    values: {
        winner: number;
    };
}
export interface RoundStartEvent {
    name: 'round_start';
    values: {
        timelimit: number;
        fraglimit: number;
        objective: string;
    };
}
export interface RoundEndEvent {
    name: 'round_end';
    values: {
        winner: number;
        reason: number;
        message: string;
    };
}
export interface GameMessageEvent {
    name: 'game_message';
    values: {
        target: number;
        text: string;
    };
}
export interface BreakBreakableEvent {
    name: 'break_breakable';
    values: {
        entindex: number;
        userid: number;
        material: number;
    };
}
export interface BreakPropEvent {
    name: 'break_prop';
    values: {
        entindex: number;
        userid: number;
    };
}
export interface EntityKilledEvent {
    name: 'entity_killed';
    values: {
        entindex_killed: number;
        entindex_attacker: number;
        entindex_inflictor: number;
        damagebits: number;
    };
}
export interface BonusUpdatedEvent {
    name: 'bonus_updated';
    values: {
        numadvanced: number;
        numbronze: number;
        numsilver: number;
        numgold: number;
    };
}
export interface AchievementEventEvent {
    name: 'achievement_event';
    values: {
        achievement_name: string;
        cur_val: number;
        max_val: number;
    };
}
export interface AchievementIncrementEvent {
    name: 'achievement_increment';
    values: {
        achievement_id: number;
        cur_val: number;
        max_val: number;
    };
}
export interface PhysgunPickupEvent {
    name: 'physgun_pickup';
    values: {
        entindex: number;
    };
}
export interface FlareIgniteNpcEvent {
    name: 'flare_ignite_npc';
    values: {
        entindex: number;
    };
}
export interface HelicopterGrenadePuntMissEvent {
    name: 'helicopter_grenade_punt_miss';
    values: {};
}
export interface UserDataDownloadedEvent {
    name: 'user_data_downloaded';
    values: {};
}
export interface RagdollDissolvedEvent {
    name: 'ragdoll_dissolved';
    values: {
        entindex: number;
    };
}
export interface HLTVChangedModeEvent {
    name: 'hltv_changed_mode';
    values: {
        oldmode: number;
        newmode: number;
        obs_target: number;
    };
}
export interface HLTVChangedTargetEvent {
    name: 'hltv_changed_target';
    values: {
        mode: number;
        old_target: number;
        obs_target: number;
    };
}
export interface VoteEndedEvent {
    name: 'vote_ended';
    values: {};
}
export interface VoteStartedEvent {
    name: 'vote_started';
    values: {
        issue: string;
        param1: string;
        team: number;
        initiator: number;
    };
}
export interface VoteChangedEvent {
    name: 'vote_changed';
    values: {
        vote_option1: number;
        vote_option2: number;
        vote_option3: number;
        vote_option4: number;
        vote_option5: number;
        potentialVotes: number;
    };
}
export interface VotePassedEvent {
    name: 'vote_passed';
    values: {
        details: string;
        param1: string;
        team: number;
    };
}
export interface VoteFailedEvent {
    name: 'vote_failed';
    values: {
        team: number;
    };
}
export interface VoteCastEvent {
    name: 'vote_cast';
    values: {
        vote_option: number;
        team: number;
        entityid: number;
    };
}
export interface VoteOptionsEvent {
    name: 'vote_options';
    values: {
        count: number;
        option1: string;
        option2: string;
        option3: string;
        option4: string;
        option5: string;
    };
}
export interface ReplaySavedEvent {
    name: 'replay_saved';
    values: {};
}
export interface EnteredPerformanceModeEvent {
    name: 'entered_performance_mode';
    values: {};
}
export interface BrowseReplaysEvent {
    name: 'browse_replays';
    values: {};
}
export interface ReplayYoutubeStatsEvent {
    name: 'replay_youtube_stats';
    values: {
        views: number;
        likes: number;
        favorited: number;
    };
}
export interface InventoryUpdatedEvent {
    name: 'inventory_updated';
    values: {};
}
export interface CartUpdatedEvent {
    name: 'cart_updated';
    values: {};
}
export interface StorePricesheetUpdatedEvent {
    name: 'store_pricesheet_updated';
    values: {};
}
export interface GcConnectedEvent {
    name: 'gc_connected';
    values: {};
}
export interface ItemSchemaInitializedEvent {
    name: 'item_schema_initialized';
    values: {};
}
export interface IntroFinishEvent {
    name: 'intro_finish';
    values: {
        player: number;
    };
}
export interface IntroNextCameraEvent {
    name: 'intro_nextcamera';
    values: {
        player: number;
    };
}
export interface MmLobbyChatEvent {
    name: 'mm_lobby_chat';
    values: {
        steamid: string;
        text: string;
        type: number;
    };
}
export interface MmLobbyMemberJoinEvent {
    name: 'mm_lobby_member_join';
    values: {
        steamid: string;
    };
}
export interface MmLobbyMemberLeaveEvent {
    name: 'mm_lobby_member_leave';
    values: {
        steamid: string;
        flags: number;
    };
}
export interface PlayerChangeClassEvent {
    name: 'player_changeclass';
    values: {
        userid: number;
        class: number;
    };
}
export interface TfMapTimeRemainingEvent {
    name: 'tf_map_time_remaining';
    values: {
        seconds: number;
    };
}
export interface TfGameOverEvent {
    name: 'tf_game_over';
    values: {
        reason: string;
    };
}
export interface CtfFlagCapturedEvent {
    name: 'ctf_flag_captured';
    values: {
        capping_team: number;
        capping_team_score: number;
    };
}
export interface ControlPointInitializedEvent {
    name: 'controlpoint_initialized';
    values: {};
}
export interface ControlPointUpdateImagesEvent {
    name: 'controlpoint_updateimages';
    values: {
        index: number;
    };
}
export interface ControlPointUpdateLayoutEvent {
    name: 'controlpoint_updatelayout';
    values: {
        index: number;
    };
}
export interface ControlPointUpdateCappingEvent {
    name: 'controlpoint_updatecapping';
    values: {
        index: number;
    };
}
export interface ControlPointUpdateOwnerEvent {
    name: 'controlpoint_updateowner';
    values: {
        index: number;
    };
}
export interface ControlPointStartTouchEvent {
    name: 'controlpoint_starttouch';
    values: {
        player: number;
        area: number;
    };
}
export interface ControlPointEndTouchEvent {
    name: 'controlpoint_endtouch';
    values: {
        player: number;
        area: number;
    };
}
export interface ControlPointPulseElementEvent {
    name: 'controlpoint_pulse_element';
    values: {
        player: number;
    };
}
export interface ControlPointFakeCaptureEvent {
    name: 'controlpoint_fake_capture';
    values: {
        player: number;
        int_data: number;
    };
}
export interface ControlPointFakeCaptureMultEvent {
    name: 'controlpoint_fake_capture_mult';
    values: {
        player: number;
        int_data: number;
    };
}
export interface TeamPlayRoundSelectedEvent {
    name: 'teamplay_round_selected';
    values: {
        round: string;
    };
}
export interface TeamPlayRoundStartEvent {
    name: 'teamplay_round_start';
    values: {
        full_reset: boolean;
    };
}
export interface TeamPlayRoundActiveEvent {
    name: 'teamplay_round_active';
    values: {};
}
export interface TeamPlayWaitingBeginsEvent {
    name: 'teamplay_waiting_begins';
    values: {};
}
export interface TeamPlayWaitingEndsEvent {
    name: 'teamplay_waiting_ends';
    values: {};
}
export interface TeamPlayWaitingAboutToEndEvent {
    name: 'teamplay_waiting_abouttoend';
    values: {};
}
export interface TeamPlayRestartRoundEvent {
    name: 'teamplay_restart_round';
    values: {};
}
export interface TeamPlayReadyRestartEvent {
    name: 'teamplay_ready_restart';
    values: {};
}
export interface TeamPlayRoundRestartSecondsEvent {
    name: 'teamplay_round_restart_seconds';
    values: {
        seconds: number;
    };
}
export interface TeamPlayTeamReadyEvent {
    name: 'teamplay_team_ready';
    values: {
        team: number;
    };
}
export interface TeamPlayRoundWinEvent {
    name: 'teamplay_round_win';
    values: {
        team: number;
        winreason: number;
        flagcaplimit: number;
        full_round: number;
        round_time: number;
        losing_team_num_caps: number;
        was_sudden_death: number;
    };
}
export interface TeamPlayUpdateTimerEvent {
    name: 'teamplay_update_timer';
    values: {};
}
export interface TeamPlayRoundStalemateEvent {
    name: 'teamplay_round_stalemate';
    values: {
        reason: number;
    };
}
export interface TeamPlayOvertimeBeginEvent {
    name: 'teamplay_overtime_begin';
    values: {};
}
export interface TeamPlayOvertimeEndEvent {
    name: 'teamplay_overtime_end';
    values: {};
}
export interface TeamPlaySuddenDeathBeginEvent {
    name: 'teamplay_suddendeath_begin';
    values: {};
}
export interface TeamPlaySuddenDeathEndEvent {
    name: 'teamplay_suddendeath_end';
    values: {};
}
export interface TeamPlayGameOverEvent {
    name: 'teamplay_game_over';
    values: {
        reason: string;
    };
}
export interface TeamPlayMapTimeRemainingEvent {
    name: 'teamplay_map_time_remaining';
    values: {
        seconds: number;
    };
}
export interface TeamPlayTimerFlashEvent {
    name: 'teamplay_timer_flash';
    values: {
        time_remaining: number;
    };
}
export interface TeamPlayTimerTimeAddedEvent {
    name: 'teamplay_timer_time_added';
    values: {
        timer: number;
        seconds_added: number;
    };
}
export interface TeamPlayPointStartCaptureEvent {
    name: 'teamplay_point_startcapture';
    values: {
        cp: number;
        cpname: string;
        team: number;
        capteam: number;
        cappers: string;
        captime: number;
    };
}
export interface TeamPlayPointCapturedEvent {
    name: 'teamplay_point_captured';
    values: {
        cp: number;
        cpname: string;
        team: number;
        cappers: string;
    };
}
export interface TeamPlayPointLockedEvent {
    name: 'teamplay_point_locked';
    values: {
        cp: number;
        cpname: string;
        team: number;
    };
}
export interface TeamPlayPointUnlockedEvent {
    name: 'teamplay_point_unlocked';
    values: {
        cp: number;
        cpname: string;
        team: number;
    };
}
export interface TeamPlayCaptureBrokenEvent {
    name: 'teamplay_capture_broken';
    values: {
        cp: number;
        cpname: string;
        time_remaining: number;
    };
}
export interface TeamPlayCaptureBlockedEvent {
    name: 'teamplay_capture_blocked';
    values: {
        cp: number;
        cpname: string;
        blocker: number;
        victim: number;
    };
}
export interface TeamPlayFlagEventEvent {
    name: 'teamplay_flag_event';
    values: {
        player: number;
        carrier: number;
        eventtype: number;
        home: number;
        team: number;
    };
}
export interface TeamPlayWinPanelEvent {
    name: 'teamplay_win_panel';
    values: {
        panel_style: number;
        winning_team: number;
        winreason: number;
        cappers: string;
        flagcaplimit: number;
        blue_score: number;
        red_score: number;
        blue_score_prev: number;
        red_score_prev: number;
        round_complete: number;
        rounds_remaining: number;
        player_1: number;
        player_1_points: number;
        player_2: number;
        player_2_points: number;
        player_3: number;
        player_3_points: number;
        killstreak_player_1: number;
        killstreak_player_1_count: number;
        game_over: number;
    };
}
export interface TeamPlayTeambalancedPlayerEvent {
    name: 'teamplay_teambalanced_player';
    values: {
        player: number;
        team: number;
    };
}
export interface TeamPlaySetupFinishedEvent {
    name: 'teamplay_setup_finished';
    values: {};
}
export interface TeamPlayAlertEvent {
    name: 'teamplay_alert';
    values: {
        alert_type: number;
    };
}
export interface TrainingCompleteEvent {
    name: 'training_complete';
    values: {
        next_map: string;
        map: string;
        text: string;
    };
}
export interface ShowFreezePanelEvent {
    name: 'show_freezepanel';
    values: {
        killer: number;
    };
}
export interface HideFreezePanelEvent {
    name: 'hide_freezepanel';
    values: {};
}
export interface FreezeCamStartedEvent {
    name: 'freezecam_started';
    values: {};
}
export interface LocalPlayerChangeTeamEvent {
    name: 'localplayer_changeteam';
    values: {};
}
export interface LocalPlayerScoreChangedEvent {
    name: 'localplayer_score_changed';
    values: {
        score: number;
    };
}
export interface LocalPlayerChangeClassEvent {
    name: 'localplayer_changeclass';
    values: {};
}
export interface LocalPlayerRespawnEvent {
    name: 'localplayer_respawn';
    values: {};
}
export interface BuildingInfoChangedEvent {
    name: 'building_info_changed';
    values: {
        building_type: number;
        object_mode: number;
        remove: number;
    };
}
export interface LocalPlayerChangeDisguiseEvent {
    name: 'localplayer_changedisguise';
    values: {
        disguised: boolean;
    };
}
export interface PlayerAccountChangedEvent {
    name: 'player_account_changed';
    values: {
        old_value: number;
        new_value: number;
    };
}
export interface SpyPdaResetEvent {
    name: 'spy_pda_reset';
    values: {};
}
export interface FlagStatusUpdateEvent {
    name: 'flagstatus_update';
    values: {
        userid: number;
        entindex: number;
    };
}
export interface PlayerStatsUpdatedEvent {
    name: 'player_stats_updated';
    values: {
        forceupload: boolean;
    };
}
export interface PlayingCommentaryEvent {
    name: 'playing_commentary';
    values: {};
}
export interface PlayerChargedeployedEvent {
    name: 'player_chargedeployed';
    values: {
        userid: number;
        targetid: number;
    };
}
export interface PlayerBuiltObjectEvent {
    name: 'player_builtobject';
    values: {
        userid: number;
        object: number;
        index: number;
    };
}
export interface PlayerUpgradedObjectEvent {
    name: 'player_upgradedobject';
    values: {
        userid: number;
        object: number;
        index: number;
        isbuilder: boolean;
    };
}
export interface PlayerCarryObjectEvent {
    name: 'player_carryobject';
    values: {
        userid: number;
        object: number;
        index: number;
    };
}
export interface PlayerDropObjectEvent {
    name: 'player_dropobject';
    values: {
        userid: number;
        object: number;
        index: number;
    };
}
export interface ObjectRemovedEvent {
    name: 'object_removed';
    values: {
        userid: number;
        objecttype: number;
        index: number;
    };
}
export interface ObjectDestroyedEvent {
    name: 'object_destroyed';
    values: {
        userid: number;
        attacker: number;
        assister: number;
        weapon: string;
        weaponid: number;
        objecttype: number;
        index: number;
        was_building: boolean;
    };
}
export interface ObjectDetonatedEvent {
    name: 'object_detonated';
    values: {
        userid: number;
        objecttype: number;
        index: number;
    };
}
export interface AchievementEarnedEvent {
    name: 'achievement_earned';
    values: {
        player: number;
        achievement: number;
    };
}
export interface SpecTargetUpdatedEvent {
    name: 'spec_target_updated';
    values: {};
}
export interface TournamentStateUpdateEvent {
    name: 'tournament_stateupdate';
    values: {
        userid: number;
        namechange: boolean;
        readystate: number;
        newname: string;
    };
}
export interface TournamentEnableCountdownEvent {
    name: 'tournament_enablecountdown';
    values: {};
}
export interface PlayerCalledForMedicEvent {
    name: 'player_calledformedic';
    values: {
        userid: number;
    };
}
export interface PlayerAskedForBallEvent {
    name: 'player_askedforball';
    values: {
        userid: number;
    };
}
export interface LocalPlayerBecameObserverEvent {
    name: 'localplayer_becameobserver';
    values: {};
}
export interface PlayerIgnitedInvEvent {
    name: 'player_ignited_inv';
    values: {
        pyro_entindex: number;
        victim_entindex: number;
        medic_entindex: number;
    };
}
export interface PlayerIgnitedEvent {
    name: 'player_ignited';
    values: {
        pyro_entindex: number;
        victim_entindex: number;
        weaponid: number;
    };
}
export interface PlayerExtinguishedEvent {
    name: 'player_extinguished';
    values: {
        victim: number;
        healer: number;
    };
}
export interface PlayerTeleportedEvent {
    name: 'player_teleported';
    values: {
        userid: number;
        builderid: number;
        dist: number;
    };
}
export interface PlayerHealedMedicCallEvent {
    name: 'player_healedmediccall';
    values: {
        userid: number;
    };
}
export interface LocalPlayerChargeReadyEvent {
    name: 'localplayer_chargeready';
    values: {};
}
export interface LocalPlayerWinddownEvent {
    name: 'localplayer_winddown';
    values: {};
}
export interface PlayerInvulnedEvent {
    name: 'player_invulned';
    values: {
        userid: number;
        medic_userid: number;
    };
}
export interface EscortSpeedEvent {
    name: 'escort_speed';
    values: {
        team: number;
        speed: number;
        players: number;
    };
}
export interface EscortProgressEvent {
    name: 'escort_progress';
    values: {
        team: number;
        progress: number;
        reset: boolean;
    };
}
export interface EscortRecedeEvent {
    name: 'escort_recede';
    values: {
        team: number;
        recedetime: number;
    };
}
export interface GameUIActivatedEvent {
    name: 'gameui_activated';
    values: {};
}
export interface GameUIHiddenEvent {
    name: 'gameui_hidden';
    values: {};
}
export interface PlayerEscortScoreEvent {
    name: 'player_escort_score';
    values: {
        player: number;
        points: number;
    };
}
export interface PlayerHealOnHitEvent {
    name: 'player_healonhit';
    values: {
        amount: number;
        entindex: number;
        weapon_def_index: number;
    };
}
export interface PlayerStealsandvichEvent {
    name: 'player_stealsandvich';
    values: {
        owner: number;
        target: number;
    };
}
export interface ShowClassLayoutEvent {
    name: 'show_class_layout';
    values: {
        show: boolean;
    };
}
export interface ShowVsPanelEvent {
    name: 'show_vs_panel';
    values: {
        show: boolean;
    };
}
export interface PlayerDamagedEvent {
    name: 'player_damaged';
    values: {
        amount: number;
        type: number;
    };
}
export interface ArenaPlayerNotificationEvent {
    name: 'arena_player_notification';
    values: {
        player: number;
        message: number;
    };
}
export interface ArenaMatchMaxStreakEvent {
    name: 'arena_match_maxstreak';
    values: {
        team: number;
        streak: number;
    };
}
export interface ArenaRoundStartEvent {
    name: 'arena_round_start';
    values: {};
}
export interface ArenaWinPanelEvent {
    name: 'arena_win_panel';
    values: {
        panel_style: number;
        winning_team: number;
        winreason: number;
        cappers: string;
        flagcaplimit: number;
        blue_score: number;
        red_score: number;
        blue_score_prev: number;
        red_score_prev: number;
        round_complete: number;
        player_1: number;
        player_1_damage: number;
        player_1_healing: number;
        player_1_lifetime: number;
        player_1_kills: number;
        player_2: number;
        player_2_damage: number;
        player_2_healing: number;
        player_2_lifetime: number;
        player_2_kills: number;
        player_3: number;
        player_3_damage: number;
        player_3_healing: number;
        player_3_lifetime: number;
        player_3_kills: number;
        player_4: number;
        player_4_damage: number;
        player_4_healing: number;
        player_4_lifetime: number;
        player_4_kills: number;
        player_5: number;
        player_5_damage: number;
        player_5_healing: number;
        player_5_lifetime: number;
        player_5_kills: number;
        player_6: number;
        player_6_damage: number;
        player_6_healing: number;
        player_6_lifetime: number;
        player_6_kills: number;
    };
}
export interface PveWinPanelEvent {
    name: 'pve_win_panel';
    values: {
        panel_style: number;
        winning_team: number;
        winreason: number;
    };
}
export interface AirDashEvent {
    name: 'air_dash';
    values: {
        player: number;
    };
}
export interface LandedEvent {
    name: 'landed';
    values: {
        player: number;
    };
}
export interface PlayerDamageDodgedEvent {
    name: 'player_damage_dodged';
    values: {
        damage: number;
    };
}
export interface PlayerStunnedEvent {
    name: 'player_stunned';
    values: {
        stunner: number;
        victim: number;
        victim_capping: boolean;
        big_stun: boolean;
    };
}
export interface ScoutGrandSlamEvent {
    name: 'scout_grand_slam';
    values: {
        scout_id: number;
        target_id: number;
    };
}
export interface ScoutSlamdollLandedEvent {
    name: 'scout_slamdoll_landed';
    values: {
        target_index: number;
        x: number;
        y: number;
        z: number;
    };
}
export interface ArrowImpactEvent {
    name: 'arrow_impact';
    values: {
        attachedEntity: number;
        shooter: number;
        boneIndexAttached: number;
        bonePositionX: number;
        bonePositionY: number;
        bonePositionZ: number;
        boneAnglesX: number;
        boneAnglesY: number;
        boneAnglesZ: number;
        projectileType: number;
        isCrit: boolean;
    };
}
export interface PlayerJaratedEvent {
    name: 'player_jarated';
    values: {
        thrower_entindex: number;
        victim_entindex: number;
    };
}
export interface PlayerJaratedFadeEvent {
    name: 'player_jarated_fade';
    values: {
        thrower_entindex: number;
        victim_entindex: number;
    };
}
export interface PlayerShieldBlockedEvent {
    name: 'player_shield_blocked';
    values: {
        attacker_entindex: number;
        blocker_entindex: number;
    };
}
export interface PlayerPinnedEvent {
    name: 'player_pinned';
    values: {
        pinned: number;
    };
}
export interface PlayerHealedByMedicEvent {
    name: 'player_healedbymedic';
    values: {
        medic: number;
    };
}
export interface PlayerSappedObjectEvent {
    name: 'player_sapped_object';
    values: {
        userid: number;
        ownerid: number;
        object: number;
        sapperid: number;
    };
}
export interface ItemFoundEvent {
    name: 'item_found';
    values: {
        player: number;
        quality: number;
        method: number;
        itemdef: number;
        isstrange: number;
        isunusual: number;
        wear: number;
    };
}
export interface ShowAnnotationEvent {
    name: 'show_annotation';
    values: {
        worldPosX: number;
        worldPosY: number;
        worldPosZ: number;
        worldNormalX: number;
        worldNormalY: number;
        worldNormalZ: number;
        id: number;
        text: string;
        lifetime: number;
        visibilityBitfield: number;
        follow_entindex: number;
        show_distance: boolean;
        play_sound: string;
        show_effect: boolean;
    };
}
export interface HideAnnotationEvent {
    name: 'hide_annotation';
    values: {
        id: number;
    };
}
export interface PostInventoryApplicationEvent {
    name: 'post_inventory_application';
    values: {
        userid: number;
    };
}
export interface ControlPointUnlockUpdatedEvent {
    name: 'controlpoint_unlock_updated';
    values: {
        index: number;
        time: number;
    };
}
export interface DeployBuffBannerEvent {
    name: 'deploy_buff_banner';
    values: {
        buff_type: number;
        buff_owner: number;
    };
}
export interface PlayerBuffEvent {
    name: 'player_buff';
    values: {
        userid: number;
        buff_owner: number;
        buff_type: number;
    };
}
export interface MedicDeathEvent {
    name: 'medic_death';
    values: {
        userid: number;
        attacker: number;
        healing: number;
        charged: boolean;
    };
}
export interface OvertimeNagEvent {
    name: 'overtime_nag';
    values: {};
}
export interface TeamsChangedEvent {
    name: 'teams_changed';
    values: {};
}
export interface HalloweenPumpkinGrabEvent {
    name: 'halloween_pumpkin_grab';
    values: {
        userid: number;
    };
}
export interface RocketJumpEvent {
    name: 'rocket_jump';
    values: {
        userid: number;
        playsound: boolean;
    };
}
export interface RocketJumpLandedEvent {
    name: 'rocket_jump_landed';
    values: {
        userid: number;
    };
}
export interface StickyJumpEvent {
    name: 'sticky_jump';
    values: {
        userid: number;
        playsound: boolean;
    };
}
export interface StickyJumpLandedEvent {
    name: 'sticky_jump_landed';
    values: {
        userid: number;
    };
}
export interface MedicDefendedEvent {
    name: 'medic_defended';
    values: {
        userid: number;
        medic: number;
    };
}
export interface LocalPlayerHealedEvent {
    name: 'localplayer_healed';
    values: {
        amount: number;
    };
}
export interface PlayerDestroyedPipeBombEvent {
    name: 'player_destroyed_pipebomb';
    values: {
        userid: number;
    };
}
export interface ObjectDeflectedEvent {
    name: 'object_deflected';
    values: {
        userid: number;
        ownerid: number;
        weaponid: number;
        object_entindex: number;
    };
}
export interface PlayerMvpEvent {
    name: 'player_mvp';
    values: {
        player: number;
    };
}
export interface RaidSpawnMobEvent {
    name: 'raid_spawn_mob';
    values: {};
}
export interface RaidSpawnSquadEvent {
    name: 'raid_spawn_squad';
    values: {};
}
export interface NavBlockedEvent {
    name: 'nav_blocked';
    values: {
        area: number;
        blocked: boolean;
    };
}
export interface PathTrackPassedEvent {
    name: 'path_track_passed';
    values: {
        index: number;
    };
}
export interface NumCappersChangedEvent {
    name: 'num_cappers_changed';
    values: {
        index: number;
        count: number;
    };
}
export interface PlayerRegenerateEvent {
    name: 'player_regenerate';
    values: {};
}
export interface UpdateStatusItemEvent {
    name: 'update_status_item';
    values: {
        index: number;
        object: number;
    };
}
export interface StatsResetRoundEvent {
    name: 'stats_resetround';
    values: {};
}
export interface ScoreStatsAccumulatedUpdateEvent {
    name: 'scorestats_accumulated_update';
    values: {};
}
export interface ScoreStatsAccumulatedResetEvent {
    name: 'scorestats_accumulated_reset';
    values: {};
}
export interface AchievementEarnedLocalEvent {
    name: 'achievement_earned_local';
    values: {
        achievement: number;
    };
}
export interface PlayerHealedEvent {
    name: 'player_healed';
    values: {
        patient: number;
        healer: number;
        amount: number;
    };
}
export interface BuildingHealedEvent {
    name: 'building_healed';
    values: {
        building: number;
        healer: number;
        amount: number;
    };
}
export interface ItemPickupEvent {
    name: 'item_pickup';
    values: {
        userid: number;
        item: string;
    };
}
export interface DuelStatusEvent {
    name: 'duel_status';
    values: {
        killer: number;
        score_type: number;
        initiator: number;
        target: number;
        initiator_score: number;
        target_score: number;
    };
}
export interface FishNoticeEvent {
    name: 'fish_notice';
    values: {
        userid: number;
        victim_entindex: number;
        inflictor_entindex: number;
        attacker: number;
        weapon: string;
        weaponid: number;
        damagebits: number;
        customkill: number;
        assister: number;
        weapon_logclassname: string;
        stun_flags: number;
        death_flags: number;
        silent_kill: boolean;
        assister_fallback: string;
    };
}
export interface FishNoticeArmEvent {
    name: 'fish_notice__arm';
    values: {
        userid: number;
        victim_entindex: number;
        inflictor_entindex: number;
        attacker: number;
        weapon: string;
        weaponid: number;
        damagebits: number;
        customkill: number;
        assister: number;
        weapon_logclassname: string;
        stun_flags: number;
        death_flags: number;
        silent_kill: boolean;
        assister_fallback: string;
    };
}
export interface ThrowableHitEvent {
    name: 'throwable_hit';
    values: {
        userid: number;
        victim_entindex: number;
        inflictor_entindex: number;
        attacker: number;
        weapon: string;
        weaponid: number;
        damagebits: number;
        customkill: number;
        assister: number;
        weapon_logclassname: string;
        stun_flags: number;
        death_flags: number;
        silent_kill: boolean;
        assister_fallback: string;
        totalhits: number;
    };
}
export interface PumpkinLordSummonedEvent {
    name: 'pumpkin_lord_summoned';
    values: {};
}
export interface PumpkinLordKilledEvent {
    name: 'pumpkin_lord_killed';
    values: {};
}
export interface MerasmusSummonedEvent {
    name: 'merasmus_summoned';
    values: {
        level: number;
    };
}
export interface MerasmusKilledEvent {
    name: 'merasmus_killed';
    values: {
        level: number;
    };
}
export interface MerasmusEscapeWarningEvent {
    name: 'merasmus_escape_warning';
    values: {
        level: number;
        time_remaining: number;
    };
}
export interface MerasmusEscapedEvent {
    name: 'merasmus_escaped';
    values: {
        level: number;
    };
}
export interface EyeballBossSummonedEvent {
    name: 'eyeball_boss_summoned';
    values: {
        level: number;
    };
}
export interface EyeballBossStunnedEvent {
    name: 'eyeball_boss_stunned';
    values: {
        level: number;
        player_entindex: number;
    };
}
export interface EyeballBossKilledEvent {
    name: 'eyeball_boss_killed';
    values: {
        level: number;
    };
}
export interface EyeballBossKillerEvent {
    name: 'eyeball_boss_killer';
    values: {
        level: number;
        player_entindex: number;
    };
}
export interface EyeballBossEscapeImminentEvent {
    name: 'eyeball_boss_escape_imminent';
    values: {
        level: number;
        time_remaining: number;
    };
}
export interface EyeballBossEscapedEvent {
    name: 'eyeball_boss_escaped';
    values: {
        level: number;
    };
}
export interface NpcHurtEvent {
    name: 'npc_hurt';
    values: {
        entindex: number;
        health: number;
        attacker_player: number;
        weaponid: number;
        damageamount: number;
        crit: boolean;
        boss: number;
    };
}
export interface ControlPointTimerUpdatedEvent {
    name: 'controlpoint_timer_updated';
    values: {
        index: number;
        time: number;
    };
}
export interface PlayerHighfiveStartEvent {
    name: 'player_highfive_start';
    values: {
        entindex: number;
    };
}
export interface PlayerHighfiveCancelEvent {
    name: 'player_highfive_cancel';
    values: {
        entindex: number;
    };
}
export interface PlayerHighfiveSuccessEvent {
    name: 'player_highfive_success';
    values: {
        initiator_entindex: number;
        partner_entindex: number;
    };
}
export interface PlayerBonusPointsEvent {
    name: 'player_bonuspoints';
    values: {
        points: number;
        player_entindex: number;
        source_entindex: number;
    };
}
export interface PlayerUpgradedEvent {
    name: 'player_upgraded';
    values: {};
}
export interface PlayerBuybackEvent {
    name: 'player_buyback';
    values: {
        player: number;
        cost: number;
    };
}
export interface PlayerUsedPowerUpBottleEvent {
    name: 'player_used_powerup_bottle';
    values: {
        player: number;
        type: number;
        time: number;
    };
}
export interface ChristmasGiftGrabEvent {
    name: 'christmas_gift_grab';
    values: {
        userid: number;
    };
}
export interface PlayerKilledAchievementZoneEvent {
    name: 'player_killed_achievement_zone';
    values: {
        attacker: number;
        victim: number;
        zone_id: number;
    };
}
export interface PartyUpdatedEvent {
    name: 'party_updated';
    values: {};
}
export interface LobbyUpdatedEvent {
    name: 'lobby_updated';
    values: {};
}
export interface MvmMissionUpdateEvent {
    name: 'mvm_mission_update';
    values: {
        class: number;
        count: number;
    };
}
export interface RecalculateHolidaysEvent {
    name: 'recalculate_holidays';
    values: {};
}
export interface PlayerCurrencyChangedEvent {
    name: 'player_currency_changed';
    values: {
        currency: number;
    };
}
export interface DoomsdayRocketOpenEvent {
    name: 'doomsday_rocket_open';
    values: {
        team: number;
    };
}
export interface RemoveNemesisRelationshipsEvent {
    name: 'remove_nemesis_relationships';
    values: {
        player: number;
    };
}
export interface MvmCreditBonusWaveEvent {
    name: 'mvm_creditbonus_wave';
    values: {};
}
export interface MvmCreditBonusAllEvent {
    name: 'mvm_creditbonus_all';
    values: {};
}
export interface MvmCreditBonusAllAdvancedEvent {
    name: 'mvm_creditbonus_all_advanced';
    values: {};
}
export interface MvmQuickSentryUpgradeEvent {
    name: 'mvm_quick_sentry_upgrade';
    values: {
        player: number;
    };
}
export interface MvmTankDestroyedByPlayersEvent {
    name: 'mvm_tank_destroyed_by_players';
    values: {};
}
export interface MvmKillRobotDeliveringBombEvent {
    name: 'mvm_kill_robot_delivering_bomb';
    values: {
        player: number;
    };
}
export interface MvmPickupCurrencyEvent {
    name: 'mvm_pickup_currency';
    values: {
        player: number;
        currency: number;
    };
}
export interface MvmBombCarrierKilledEvent {
    name: 'mvm_bomb_carrier_killed';
    values: {
        level: number;
    };
}
export interface MvmSentryBusterDetonateEvent {
    name: 'mvm_sentrybuster_detonate';
    values: {
        player: number;
        det_x: number;
        det_y: number;
        det_z: number;
    };
}
export interface MvmScoutMarkedForDeathEvent {
    name: 'mvm_scout_marked_for_death';
    values: {
        player: number;
    };
}
export interface MvmMedicPowerupSharedEvent {
    name: 'mvm_medic_powerup_shared';
    values: {
        player: number;
    };
}
export interface MvmBeginWaveEvent {
    name: 'mvm_begin_wave';
    values: {
        wave_index: number;
        max_waves: number;
        advanced: number;
    };
}
export interface MvmWaveCompleteEvent {
    name: 'mvm_wave_complete';
    values: {
        advanced: boolean;
    };
}
export interface MvmMissionCompleteEvent {
    name: 'mvm_mission_complete';
    values: {
        mission: string;
    };
}
export interface MvmBombResetByPlayerEvent {
    name: 'mvm_bomb_reset_by_player';
    values: {
        player: number;
    };
}
export interface MvmBombAlarmTriggeredEvent {
    name: 'mvm_bomb_alarm_triggered';
    values: {};
}
export interface MvmBombDeployResetByPlayerEvent {
    name: 'mvm_bomb_deploy_reset_by_player';
    values: {
        player: number;
    };
}
export interface MvmWaveFailedEvent {
    name: 'mvm_wave_failed';
    values: {};
}
export interface MvmResetStatsEvent {
    name: 'mvm_reset_stats';
    values: {};
}
export interface DamageResistedEvent {
    name: 'damage_resisted';
    values: {
        entindex: number;
    };
}
export interface RevivePlayerNotifyEvent {
    name: 'revive_player_notify';
    values: {
        entindex: number;
        marker_entindex: number;
    };
}
export interface RevivePlayerStoppedEvent {
    name: 'revive_player_stopped';
    values: {
        entindex: number;
    };
}
export interface RevivePlayerCompleteEvent {
    name: 'revive_player_complete';
    values: {
        entindex: number;
    };
}
export interface PlayerTurnedToGhostEvent {
    name: 'player_turned_to_ghost';
    values: {
        userid: number;
    };
}
export interface MedigunShieldBlockedDamageEvent {
    name: 'medigun_shield_blocked_damage';
    values: {
        userid: number;
        damage: number;
    };
}
export interface MvmAdvWaveCompleteNoGatesEvent {
    name: 'mvm_adv_wave_complete_no_gates';
    values: {
        index: number;
    };
}
export interface MvmSniperHeadshotCurrencyEvent {
    name: 'mvm_sniper_headshot_currency';
    values: {
        userid: number;
        currency: number;
    };
}
export interface MvmMannhattanPitEvent {
    name: 'mvm_mannhattan_pit';
    values: {};
}
export interface FlagCarriedInDetectionZoneEvent {
    name: 'flag_carried_in_detection_zone';
    values: {};
}
export interface MvmAdvWaveKilledStunRadioEvent {
    name: 'mvm_adv_wave_killed_stun_radio';
    values: {};
}
export interface PlayerDirecthitStunEvent {
    name: 'player_directhit_stun';
    values: {
        attacker: number;
        victim: number;
    };
}
export interface MvmSentryBusterKilledEvent {
    name: 'mvm_sentrybuster_killed';
    values: {
        sentry_buster: number;
    };
}
export interface UpgradesFileChangedEvent {
    name: 'upgrades_file_changed';
    values: {
        path: string;
    };
}
export interface RdTeamPointsChangedEvent {
    name: 'rd_team_points_changed';
    values: {
        points: number;
        team: number;
        method: number;
    };
}
export interface RdRulesStateChangedEvent {
    name: 'rd_rules_state_changed';
    values: {};
}
export interface RdRobotKilledEvent {
    name: 'rd_robot_killed';
    values: {
        userid: number;
        victim_entindex: number;
        inflictor_entindex: number;
        attacker: number;
        weapon: string;
        weaponid: number;
        damagebits: number;
        customkill: number;
        weapon_logclassname: string;
    };
}
export interface RdRobotImpactEvent {
    name: 'rd_robot_impact';
    values: {
        entindex: number;
        impulse_x: number;
        impulse_y: number;
        impulse_z: number;
    };
}
export interface TeamPlayPreRoundTimeLeftEvent {
    name: 'teamplay_pre_round_time_left';
    values: {
        time: number;
    };
}
export interface ParachuteDeployEvent {
    name: 'parachute_deploy';
    values: {
        index: number;
    };
}
export interface ParachuteHolsterEvent {
    name: 'parachute_holster';
    values: {
        index: number;
    };
}
export interface KillRefillsMeterEvent {
    name: 'kill_refills_meter';
    values: {
        index: number;
    };
}
export interface RpsTauntEventEvent {
    name: 'rps_taunt_event';
    values: {
        winner: number;
        winner_rps: number;
        loser: number;
        loser_rps: number;
    };
}
export interface CongaKillEvent {
    name: 'conga_kill';
    values: {
        index: number;
    };
}
export interface PlayerInitialSpawnEvent {
    name: 'player_initial_spawn';
    values: {
        index: number;
    };
}
export interface CompetitiveVictoryEvent {
    name: 'competitive_victory';
    values: {};
}
export interface CompetitiveStatsUpdateEvent {
    name: 'competitive_stats_update';
    values: {
        index: number;
        rating: number;
        delta: number;
        kills_rank: number;
        score_rank: number;
        damage_rank: number;
        healing_rank: number;
        support_rank: number;
    };
}
export interface MiniGameWinEvent {
    name: 'minigame_win';
    values: {
        team: number;
        type: number;
    };
}
export interface SentryOnGoActiveEvent {
    name: 'sentry_on_go_active';
    values: {
        index: number;
    };
}
export interface DuckXpLevelUpEvent {
    name: 'duck_xp_level_up';
    values: {
        level: number;
    };
}
export interface QuestLogOpenedEvent {
    name: 'questlog_opened';
    values: {};
}
export interface SchemaUpdatedEvent {
    name: 'schema_updated';
    values: {};
}
export interface LocalPlayerPickupWeaponEvent {
    name: 'localplayer_pickup_weapon';
    values: {};
}
export interface RdPlayerScorePointsEvent {
    name: 'rd_player_score_points';
    values: {
        player: number;
        method: number;
        amount: number;
    };
}
export interface DemomanDetStickiesEvent {
    name: 'demoman_det_stickies';
    values: {
        player: number;
    };
}
export interface QuestObjectiveCompletedEvent {
    name: 'quest_objective_completed';
    values: {
        quest_item_id_low: number;
        quest_item_id_hi: number;
        quest_objective_id: number;
    };
}
export interface PlayerScoreChangedEvent {
    name: 'player_score_changed';
    values: {
        player: number;
        delta: number;
    };
}
export interface KilledCappingPlayerEvent {
    name: 'killed_capping_player';
    values: {
        cp: number;
        killer: number;
        victim: number;
        assister: number;
    };
}
export interface EnvironmentalDeathEvent {
    name: 'environmental_death';
    values: {
        killer: number;
        victim: number;
    };
}
export interface ProjectileDirectHitEvent {
    name: 'projectile_direct_hit';
    values: {
        attacker: number;
        victim: number;
    };
}
export interface PassGetEvent {
    name: 'pass_get';
    values: {
        owner: number;
    };
}
export interface PassScoreEvent {
    name: 'pass_score';
    values: {
        scorer: number;
        assister: number;
        points: number;
    };
}
export interface PassFreeEvent {
    name: 'pass_free';
    values: {
        owner: number;
        attacker: number;
    };
}
export interface PassPassCaughtEvent {
    name: 'pass_pass_caught';
    values: {
        passer: number;
        catcher: number;
        dist: number;
        duration: number;
    };
}
export interface PassBallStolenEvent {
    name: 'pass_ball_stolen';
    values: {
        victim: number;
        attacker: number;
    };
}
export interface PassBallBlockedEvent {
    name: 'pass_ball_blocked';
    values: {
        owner: number;
        blocker: number;
    };
}
export interface DamagePreventedEvent {
    name: 'damage_prevented';
    values: {
        preventor: number;
        victim: number;
        amount: number;
        condition: number;
    };
}
export interface HalloweenBossKilledEvent {
    name: 'halloween_boss_killed';
    values: {
        boss: number;
        killer: number;
    };
}
export interface EscapedLootIslandEvent {
    name: 'escaped_loot_island';
    values: {
        player: number;
    };
}
export interface TaggedPlayerAsItEvent {
    name: 'tagged_player_as_it';
    values: {
        player: number;
    };
}
export interface MerasmusStunnedEvent {
    name: 'merasmus_stunned';
    values: {
        player: number;
    };
}
export interface MerasmusPropFoundEvent {
    name: 'merasmus_prop_found';
    values: {
        player: number;
    };
}
export interface HalloweenSkeletonKilledEvent {
    name: 'halloween_skeleton_killed';
    values: {
        player: number;
    };
}
export interface EscapeHellEvent {
    name: 'escape_hell';
    values: {
        player: number;
    };
}
export interface CrossSpectralBridgeEvent {
    name: 'cross_spectral_bridge';
    values: {
        player: number;
    };
}
export interface MiniGameWonEvent {
    name: 'minigame_won';
    values: {
        player: number;
        game: number;
    };
}
export interface RespawnGhostEvent {
    name: 'respawn_ghost';
    values: {
        reviver: number;
        ghost: number;
    };
}
export interface KillInHellEvent {
    name: 'kill_in_hell';
    values: {
        killer: number;
        victim: number;
    };
}
export interface HalloweenDuckCollectedEvent {
    name: 'halloween_duck_collected';
    values: {
        collector: number;
    };
}
export interface SpecialScoreEvent {
    name: 'special_score';
    values: {
        player: number;
    };
}
export interface TeamLeaderKilledEvent {
    name: 'team_leader_killed';
    values: {
        killer: number;
        victim: number;
    };
}
export interface HalloweenSoulCollectedEvent {
    name: 'halloween_soul_collected';
    values: {
        intended_target: number;
        collecting_player: number;
        soul_count: number;
    };
}
export interface RecalculateTruceEvent {
    name: 'recalculate_truce';
    values: {};
}
export interface DeadringerCheatDeathEvent {
    name: 'deadringer_cheat_death';
    values: {
        spy: number;
        attacker: number;
    };
}
export interface CrossbowHealEvent {
    name: 'crossbow_heal';
    values: {
        healer: number;
        target: number;
        amount: number;
    };
}
export interface DamageMitigatedEvent {
    name: 'damage_mitigated';
    values: {
        mitigator: number;
        damaged: number;
        amount: number;
        itemdefindex: number;
    };
}
export interface PayloadPushedEvent {
    name: 'payload_pushed';
    values: {
        pusher: number;
        distance: number;
    };
}
export interface PlayerAbandonedMatchEvent {
    name: 'player_abandoned_match';
    values: {
        game_over: boolean;
    };
}
export interface ClDrawlineEvent {
    name: 'cl_drawline';
    values: {
        player: number;
        panel: number;
        line: number;
        x: number;
        y: number;
    };
}
export interface RestartTimerTimeEvent {
    name: 'restart_timer_time';
    values: {
        time: number;
    };
}
export interface WinLimitChangedEvent {
    name: 'winlimit_changed';
    values: {};
}
export interface WinPanelShowScoresEvent {
    name: 'winpanel_show_scores';
    values: {};
}
export interface TopStreamsRequestFinishedEvent {
    name: 'top_streams_request_finished';
    values: {};
}
export interface CompetitiveStateChangedEvent {
    name: 'competitive_state_changed';
    values: {};
}
export interface GlobalWarDataUpdatedEvent {
    name: 'global_war_data_updated';
    values: {};
}
export interface StopWatchChangedEvent {
    name: 'stop_watch_changed';
    values: {};
}
export interface DsStopEvent {
    name: 'ds_stop';
    values: {};
}
export interface DsScreenshotEvent {
    name: 'ds_screenshot';
    values: {
        delay: number;
    };
}
export interface ShowMatchSummaryEvent {
    name: 'show_match_summary';
    values: {};
}
export interface ExperienceChangedEvent {
    name: 'experience_changed';
    values: {};
}
export interface BeginXpLerpEvent {
    name: 'begin_xp_lerp';
    values: {};
}
export interface MatchmakerStatsUpdatedEvent {
    name: 'matchmaker_stats_updated';
    values: {};
}
export interface RematchVotePeriodOverEvent {
    name: 'rematch_vote_period_over';
    values: {
        success: boolean;
    };
}
export interface RematchFailedToCreateEvent {
    name: 'rematch_failed_to_create';
    values: {};
}
export interface PlayerRematchChangeEvent {
    name: 'player_rematch_change';
    values: {};
}
export interface PingUpdatedEvent {
    name: 'ping_updated';
    values: {};
}
export interface PlayerNextMapVoteChangeEvent {
    name: 'player_next_map_vote_change';
    values: {
        map_index: number;
        vote: number;
    };
}
export interface VoteMapsChangedEvent {
    name: 'vote_maps_changed';
    values: {};
}
export interface HLTVStatusEvent {
    name: 'hltv_status';
    values: {
        clients: number;
        slots: number;
        proxies: number;
        master: string;
    };
}
export interface HLTVCameramanEvent {
    name: 'hltv_cameraman';
    values: {
        index: number;
    };
}
export interface HLTVRankCameraEvent {
    name: 'hltv_rank_camera';
    values: {
        index: number;
        rank: number;
        target: number;
    };
}
export interface HLTVRankEntityEvent {
    name: 'hltv_rank_entity';
    values: {
        index: number;
        rank: number;
        target: number;
    };
}
export interface HLTVFixedEvent {
    name: 'hltv_fixed';
    values: {
        posx: number;
        posy: number;
        posz: number;
        theta: number;
        phi: number;
        offset: number;
        fov: number;
        target: number;
    };
}
export interface HLTVChaseEvent {
    name: 'hltv_chase';
    values: {
        target1: number;
        target2: number;
        distance: number;
        theta: number;
        phi: number;
        inertia: number;
        ineye: number;
    };
}
export interface HLTVMessageEvent {
    name: 'hltv_message';
    values: {
        text: string;
    };
}
export interface HLTVTitleEvent {
    name: 'hltv_title';
    values: {
        text: string;
    };
}
export interface HLTVChatEvent {
    name: 'hltv_chat';
    values: {
        text: string;
    };
}
export interface ReplayStartRecordEvent {
    name: 'replay_startrecord';
    values: {};
}
export interface ReplaySessionInfoEvent {
    name: 'replay_sessioninfo';
    values: {
        sn: string;
        di: number;
        cb: number;
        st: number;
    };
}
export interface ReplayEndRecordEvent {
    name: 'replay_endrecord';
    values: {};
}
export interface ReplayReplaysAvailableEvent {
    name: 'replay_replaysavailable';
    values: {};
}
export interface ReplayServerErrorEvent {
    name: 'replay_servererror';
    values: {
        error: string;
    };
}
export declare type GameEvent = ServerSpawnEvent | ServerChangelevelFailedEvent | ServerShutdownEvent | ServerCvarEvent | ServerMessageEvent | ServerAddBanEvent | ServerRemoveBanEvent | PlayerConnectEvent | PlayerConnectClientEvent | PlayerInfoEvent | PlayerDisconnectEvent | PlayerActivateEvent | PlayerSayEvent | ClientDisconnectEvent | ClientBeginConnectEvent | ClientConnectedEvent | ClientFullConnectEvent | HostQuitEvent | TeamInfoEvent | TeamScoreEvent | TeamPlayBroadcastAudioEvent | PlayerTeamEvent | PlayerClassEvent | PlayerDeathEvent | PlayerHurtEvent | PlayerChatEvent | PlayerScoreEvent | PlayerSpawnEvent | PlayerShootEvent | PlayerUseEvent | PlayerChangeNameEvent | PlayerHintMessageEvent | BasePlayerTeleportedEvent | GameInitEvent | GameNewMapEvent | GameStartEvent | GameEndEvent | RoundStartEvent | RoundEndEvent | GameMessageEvent | BreakBreakableEvent | BreakPropEvent | EntityKilledEvent | BonusUpdatedEvent | AchievementEventEvent | AchievementIncrementEvent | PhysgunPickupEvent | FlareIgniteNpcEvent | HelicopterGrenadePuntMissEvent | UserDataDownloadedEvent | RagdollDissolvedEvent | HLTVChangedModeEvent | HLTVChangedTargetEvent | VoteEndedEvent | VoteStartedEvent | VoteChangedEvent | VotePassedEvent | VoteFailedEvent | VoteCastEvent | VoteOptionsEvent | ReplaySavedEvent | EnteredPerformanceModeEvent | BrowseReplaysEvent | ReplayYoutubeStatsEvent | InventoryUpdatedEvent | CartUpdatedEvent | StorePricesheetUpdatedEvent | GcConnectedEvent | ItemSchemaInitializedEvent | IntroFinishEvent | IntroNextCameraEvent | MmLobbyChatEvent | MmLobbyMemberJoinEvent | MmLobbyMemberLeaveEvent | PlayerChangeClassEvent | TfMapTimeRemainingEvent | TfGameOverEvent | CtfFlagCapturedEvent | ControlPointInitializedEvent | ControlPointUpdateImagesEvent | ControlPointUpdateLayoutEvent | ControlPointUpdateCappingEvent | ControlPointUpdateOwnerEvent | ControlPointStartTouchEvent | ControlPointEndTouchEvent | ControlPointPulseElementEvent | ControlPointFakeCaptureEvent | ControlPointFakeCaptureMultEvent | TeamPlayRoundSelectedEvent | TeamPlayRoundStartEvent | TeamPlayRoundActiveEvent | TeamPlayWaitingBeginsEvent | TeamPlayWaitingEndsEvent | TeamPlayWaitingAboutToEndEvent | TeamPlayRestartRoundEvent | TeamPlayReadyRestartEvent | TeamPlayRoundRestartSecondsEvent | TeamPlayTeamReadyEvent | TeamPlayRoundWinEvent | TeamPlayUpdateTimerEvent | TeamPlayRoundStalemateEvent | TeamPlayOvertimeBeginEvent | TeamPlayOvertimeEndEvent | TeamPlaySuddenDeathBeginEvent | TeamPlaySuddenDeathEndEvent | TeamPlayGameOverEvent | TeamPlayMapTimeRemainingEvent | TeamPlayTimerFlashEvent | TeamPlayTimerTimeAddedEvent | TeamPlayPointStartCaptureEvent | TeamPlayPointCapturedEvent | TeamPlayPointLockedEvent | TeamPlayPointUnlockedEvent | TeamPlayCaptureBrokenEvent | TeamPlayCaptureBlockedEvent | TeamPlayFlagEventEvent | TeamPlayWinPanelEvent | TeamPlayTeambalancedPlayerEvent | TeamPlaySetupFinishedEvent | TeamPlayAlertEvent | TrainingCompleteEvent | ShowFreezePanelEvent | HideFreezePanelEvent | FreezeCamStartedEvent | LocalPlayerChangeTeamEvent | LocalPlayerScoreChangedEvent | LocalPlayerChangeClassEvent | LocalPlayerRespawnEvent | BuildingInfoChangedEvent | LocalPlayerChangeDisguiseEvent | PlayerAccountChangedEvent | SpyPdaResetEvent | FlagStatusUpdateEvent | PlayerStatsUpdatedEvent | PlayingCommentaryEvent | PlayerChargedeployedEvent | PlayerBuiltObjectEvent | PlayerUpgradedObjectEvent | PlayerCarryObjectEvent | PlayerDropObjectEvent | ObjectRemovedEvent | ObjectDestroyedEvent | ObjectDetonatedEvent | AchievementEarnedEvent | SpecTargetUpdatedEvent | TournamentStateUpdateEvent | TournamentEnableCountdownEvent | PlayerCalledForMedicEvent | PlayerAskedForBallEvent | LocalPlayerBecameObserverEvent | PlayerIgnitedInvEvent | PlayerIgnitedEvent | PlayerExtinguishedEvent | PlayerTeleportedEvent | PlayerHealedMedicCallEvent | LocalPlayerChargeReadyEvent | LocalPlayerWinddownEvent | PlayerInvulnedEvent | EscortSpeedEvent | EscortProgressEvent | EscortRecedeEvent | GameUIActivatedEvent | GameUIHiddenEvent | PlayerEscortScoreEvent | PlayerHealOnHitEvent | PlayerStealsandvichEvent | ShowClassLayoutEvent | ShowVsPanelEvent | PlayerDamagedEvent | ArenaPlayerNotificationEvent | ArenaMatchMaxStreakEvent | ArenaRoundStartEvent | ArenaWinPanelEvent | PveWinPanelEvent | AirDashEvent | LandedEvent | PlayerDamageDodgedEvent | PlayerStunnedEvent | ScoutGrandSlamEvent | ScoutSlamdollLandedEvent | ArrowImpactEvent | PlayerJaratedEvent | PlayerJaratedFadeEvent | PlayerShieldBlockedEvent | PlayerPinnedEvent | PlayerHealedByMedicEvent | PlayerSappedObjectEvent | ItemFoundEvent | ShowAnnotationEvent | HideAnnotationEvent | PostInventoryApplicationEvent | ControlPointUnlockUpdatedEvent | DeployBuffBannerEvent | PlayerBuffEvent | MedicDeathEvent | OvertimeNagEvent | TeamsChangedEvent | HalloweenPumpkinGrabEvent | RocketJumpEvent | RocketJumpLandedEvent | StickyJumpEvent | StickyJumpLandedEvent | MedicDefendedEvent | LocalPlayerHealedEvent | PlayerDestroyedPipeBombEvent | ObjectDeflectedEvent | PlayerMvpEvent | RaidSpawnMobEvent | RaidSpawnSquadEvent | NavBlockedEvent | PathTrackPassedEvent | NumCappersChangedEvent | PlayerRegenerateEvent | UpdateStatusItemEvent | StatsResetRoundEvent | ScoreStatsAccumulatedUpdateEvent | ScoreStatsAccumulatedResetEvent | AchievementEarnedLocalEvent | PlayerHealedEvent | BuildingHealedEvent | ItemPickupEvent | DuelStatusEvent | FishNoticeEvent | FishNoticeArmEvent | ThrowableHitEvent | PumpkinLordSummonedEvent | PumpkinLordKilledEvent | MerasmusSummonedEvent | MerasmusKilledEvent | MerasmusEscapeWarningEvent | MerasmusEscapedEvent | EyeballBossSummonedEvent | EyeballBossStunnedEvent | EyeballBossKilledEvent | EyeballBossKillerEvent | EyeballBossEscapeImminentEvent | EyeballBossEscapedEvent | NpcHurtEvent | ControlPointTimerUpdatedEvent | PlayerHighfiveStartEvent | PlayerHighfiveCancelEvent | PlayerHighfiveSuccessEvent | PlayerBonusPointsEvent | PlayerUpgradedEvent | PlayerBuybackEvent | PlayerUsedPowerUpBottleEvent | ChristmasGiftGrabEvent | PlayerKilledAchievementZoneEvent | PartyUpdatedEvent | LobbyUpdatedEvent | MvmMissionUpdateEvent | RecalculateHolidaysEvent | PlayerCurrencyChangedEvent | DoomsdayRocketOpenEvent | RemoveNemesisRelationshipsEvent | MvmCreditBonusWaveEvent | MvmCreditBonusAllEvent | MvmCreditBonusAllAdvancedEvent | MvmQuickSentryUpgradeEvent | MvmTankDestroyedByPlayersEvent | MvmKillRobotDeliveringBombEvent | MvmPickupCurrencyEvent | MvmBombCarrierKilledEvent | MvmSentryBusterDetonateEvent | MvmScoutMarkedForDeathEvent | MvmMedicPowerupSharedEvent | MvmBeginWaveEvent | MvmWaveCompleteEvent | MvmMissionCompleteEvent | MvmBombResetByPlayerEvent | MvmBombAlarmTriggeredEvent | MvmBombDeployResetByPlayerEvent | MvmWaveFailedEvent | MvmResetStatsEvent | DamageResistedEvent | RevivePlayerNotifyEvent | RevivePlayerStoppedEvent | RevivePlayerCompleteEvent | PlayerTurnedToGhostEvent | MedigunShieldBlockedDamageEvent | MvmAdvWaveCompleteNoGatesEvent | MvmSniperHeadshotCurrencyEvent | MvmMannhattanPitEvent | FlagCarriedInDetectionZoneEvent | MvmAdvWaveKilledStunRadioEvent | PlayerDirecthitStunEvent | MvmSentryBusterKilledEvent | UpgradesFileChangedEvent | RdTeamPointsChangedEvent | RdRulesStateChangedEvent | RdRobotKilledEvent | RdRobotImpactEvent | TeamPlayPreRoundTimeLeftEvent | ParachuteDeployEvent | ParachuteHolsterEvent | KillRefillsMeterEvent | RpsTauntEventEvent | CongaKillEvent | PlayerInitialSpawnEvent | CompetitiveVictoryEvent | CompetitiveStatsUpdateEvent | MiniGameWinEvent | SentryOnGoActiveEvent | DuckXpLevelUpEvent | QuestLogOpenedEvent | SchemaUpdatedEvent | LocalPlayerPickupWeaponEvent | RdPlayerScorePointsEvent | DemomanDetStickiesEvent | QuestObjectiveCompletedEvent | PlayerScoreChangedEvent | KilledCappingPlayerEvent | EnvironmentalDeathEvent | ProjectileDirectHitEvent | PassGetEvent | PassScoreEvent | PassFreeEvent | PassPassCaughtEvent | PassBallStolenEvent | PassBallBlockedEvent | DamagePreventedEvent | HalloweenBossKilledEvent | EscapedLootIslandEvent | TaggedPlayerAsItEvent | MerasmusStunnedEvent | MerasmusPropFoundEvent | HalloweenSkeletonKilledEvent | EscapeHellEvent | CrossSpectralBridgeEvent | MiniGameWonEvent | RespawnGhostEvent | KillInHellEvent | HalloweenDuckCollectedEvent | SpecialScoreEvent | TeamLeaderKilledEvent | HalloweenSoulCollectedEvent | RecalculateTruceEvent | DeadringerCheatDeathEvent | CrossbowHealEvent | DamageMitigatedEvent | PayloadPushedEvent | PlayerAbandonedMatchEvent | ClDrawlineEvent | RestartTimerTimeEvent | WinLimitChangedEvent | WinPanelShowScoresEvent | TopStreamsRequestFinishedEvent | CompetitiveStateChangedEvent | GlobalWarDataUpdatedEvent | StopWatchChangedEvent | DsStopEvent | DsScreenshotEvent | ShowMatchSummaryEvent | ExperienceChangedEvent | BeginXpLerpEvent | MatchmakerStatsUpdatedEvent | RematchVotePeriodOverEvent | RematchFailedToCreateEvent | PlayerRematchChangeEvent | PingUpdatedEvent | PlayerNextMapVoteChangeEvent | VoteMapsChangedEvent | HLTVStatusEvent | HLTVCameramanEvent | HLTVRankCameraEvent | HLTVRankEntityEvent | HLTVFixedEvent | HLTVChaseEvent | HLTVMessageEvent | HLTVTitleEvent | HLTVChatEvent | ReplayStartRecordEvent | ReplaySessionInfoEvent | ReplayEndRecordEvent | ReplayReplaysAvailableEvent | ReplayServerErrorEvent;
export declare type GameEventType = GameEvent['name'];
export interface GameEventTypeMap {
    server_spawn: ServerSpawnEvent;
    server_changelevel_failed: ServerChangelevelFailedEvent;
    server_shutdown: ServerShutdownEvent;
    server_cvar: ServerCvarEvent;
    server_message: ServerMessageEvent;
    server_addban: ServerAddBanEvent;
    server_removeban: ServerRemoveBanEvent;
    player_connect: PlayerConnectEvent;
    player_connect_client: PlayerConnectClientEvent;
    player_info: PlayerInfoEvent;
    player_disconnect: PlayerDisconnectEvent;
    player_activate: PlayerActivateEvent;
    player_say: PlayerSayEvent;
    client_disconnect: ClientDisconnectEvent;
    client_beginconnect: ClientBeginConnectEvent;
    client_connected: ClientConnectedEvent;
    client_fullconnect: ClientFullConnectEvent;
    host_quit: HostQuitEvent;
    team_info: TeamInfoEvent;
    team_score: TeamScoreEvent;
    teamplay_broadcast_audio: TeamPlayBroadcastAudioEvent;
    player_team: PlayerTeamEvent;
    player_class: PlayerClassEvent;
    player_death: PlayerDeathEvent;
    player_hurt: PlayerHurtEvent;
    player_chat: PlayerChatEvent;
    player_score: PlayerScoreEvent;
    player_spawn: PlayerSpawnEvent;
    player_shoot: PlayerShootEvent;
    player_use: PlayerUseEvent;
    player_changename: PlayerChangeNameEvent;
    player_hintmessage: PlayerHintMessageEvent;
    base_player_teleported: BasePlayerTeleportedEvent;
    game_init: GameInitEvent;
    game_newmap: GameNewMapEvent;
    game_start: GameStartEvent;
    game_end: GameEndEvent;
    round_start: RoundStartEvent;
    round_end: RoundEndEvent;
    game_message: GameMessageEvent;
    break_breakable: BreakBreakableEvent;
    break_prop: BreakPropEvent;
    entity_killed: EntityKilledEvent;
    bonus_updated: BonusUpdatedEvent;
    achievement_event: AchievementEventEvent;
    achievement_increment: AchievementIncrementEvent;
    physgun_pickup: PhysgunPickupEvent;
    flare_ignite_npc: FlareIgniteNpcEvent;
    helicopter_grenade_punt_miss: HelicopterGrenadePuntMissEvent;
    user_data_downloaded: UserDataDownloadedEvent;
    ragdoll_dissolved: RagdollDissolvedEvent;
    hltv_changed_mode: HLTVChangedModeEvent;
    hltv_changed_target: HLTVChangedTargetEvent;
    vote_ended: VoteEndedEvent;
    vote_started: VoteStartedEvent;
    vote_changed: VoteChangedEvent;
    vote_passed: VotePassedEvent;
    vote_failed: VoteFailedEvent;
    vote_cast: VoteCastEvent;
    vote_options: VoteOptionsEvent;
    replay_saved: ReplaySavedEvent;
    entered_performance_mode: EnteredPerformanceModeEvent;
    browse_replays: BrowseReplaysEvent;
    replay_youtube_stats: ReplayYoutubeStatsEvent;
    inventory_updated: InventoryUpdatedEvent;
    cart_updated: CartUpdatedEvent;
    store_pricesheet_updated: StorePricesheetUpdatedEvent;
    gc_connected: GcConnectedEvent;
    item_schema_initialized: ItemSchemaInitializedEvent;
    intro_finish: IntroFinishEvent;
    intro_nextcamera: IntroNextCameraEvent;
    mm_lobby_chat: MmLobbyChatEvent;
    mm_lobby_member_join: MmLobbyMemberJoinEvent;
    mm_lobby_member_leave: MmLobbyMemberLeaveEvent;
    player_changeclass: PlayerChangeClassEvent;
    tf_map_time_remaining: TfMapTimeRemainingEvent;
    tf_game_over: TfGameOverEvent;
    ctf_flag_captured: CtfFlagCapturedEvent;
    controlpoint_initialized: ControlPointInitializedEvent;
    controlpoint_updateimages: ControlPointUpdateImagesEvent;
    controlpoint_updatelayout: ControlPointUpdateLayoutEvent;
    controlpoint_updatecapping: ControlPointUpdateCappingEvent;
    controlpoint_updateowner: ControlPointUpdateOwnerEvent;
    controlpoint_starttouch: ControlPointStartTouchEvent;
    controlpoint_endtouch: ControlPointEndTouchEvent;
    controlpoint_pulse_element: ControlPointPulseElementEvent;
    controlpoint_fake_capture: ControlPointFakeCaptureEvent;
    controlpoint_fake_capture_mult: ControlPointFakeCaptureMultEvent;
    teamplay_round_selected: TeamPlayRoundSelectedEvent;
    teamplay_round_start: TeamPlayRoundStartEvent;
    teamplay_round_active: TeamPlayRoundActiveEvent;
    teamplay_waiting_begins: TeamPlayWaitingBeginsEvent;
    teamplay_waiting_ends: TeamPlayWaitingEndsEvent;
    teamplay_waiting_abouttoend: TeamPlayWaitingAboutToEndEvent;
    teamplay_restart_round: TeamPlayRestartRoundEvent;
    teamplay_ready_restart: TeamPlayReadyRestartEvent;
    teamplay_round_restart_seconds: TeamPlayRoundRestartSecondsEvent;
    teamplay_team_ready: TeamPlayTeamReadyEvent;
    teamplay_round_win: TeamPlayRoundWinEvent;
    teamplay_update_timer: TeamPlayUpdateTimerEvent;
    teamplay_round_stalemate: TeamPlayRoundStalemateEvent;
    teamplay_overtime_begin: TeamPlayOvertimeBeginEvent;
    teamplay_overtime_end: TeamPlayOvertimeEndEvent;
    teamplay_suddendeath_begin: TeamPlaySuddenDeathBeginEvent;
    teamplay_suddendeath_end: TeamPlaySuddenDeathEndEvent;
    teamplay_game_over: TeamPlayGameOverEvent;
    teamplay_map_time_remaining: TeamPlayMapTimeRemainingEvent;
    teamplay_timer_flash: TeamPlayTimerFlashEvent;
    teamplay_timer_time_added: TeamPlayTimerTimeAddedEvent;
    teamplay_point_startcapture: TeamPlayPointStartCaptureEvent;
    teamplay_point_captured: TeamPlayPointCapturedEvent;
    teamplay_point_locked: TeamPlayPointLockedEvent;
    teamplay_point_unlocked: TeamPlayPointUnlockedEvent;
    teamplay_capture_broken: TeamPlayCaptureBrokenEvent;
    teamplay_capture_blocked: TeamPlayCaptureBlockedEvent;
    teamplay_flag_event: TeamPlayFlagEventEvent;
    teamplay_win_panel: TeamPlayWinPanelEvent;
    teamplay_teambalanced_player: TeamPlayTeambalancedPlayerEvent;
    teamplay_setup_finished: TeamPlaySetupFinishedEvent;
    teamplay_alert: TeamPlayAlertEvent;
    training_complete: TrainingCompleteEvent;
    show_freezepanel: ShowFreezePanelEvent;
    hide_freezepanel: HideFreezePanelEvent;
    freezecam_started: FreezeCamStartedEvent;
    localplayer_changeteam: LocalPlayerChangeTeamEvent;
    localplayer_score_changed: LocalPlayerScoreChangedEvent;
    localplayer_changeclass: LocalPlayerChangeClassEvent;
    localplayer_respawn: LocalPlayerRespawnEvent;
    building_info_changed: BuildingInfoChangedEvent;
    localplayer_changedisguise: LocalPlayerChangeDisguiseEvent;
    player_account_changed: PlayerAccountChangedEvent;
    spy_pda_reset: SpyPdaResetEvent;
    flagstatus_update: FlagStatusUpdateEvent;
    player_stats_updated: PlayerStatsUpdatedEvent;
    playing_commentary: PlayingCommentaryEvent;
    player_chargedeployed: PlayerChargedeployedEvent;
    player_builtobject: PlayerBuiltObjectEvent;
    player_upgradedobject: PlayerUpgradedObjectEvent;
    player_carryobject: PlayerCarryObjectEvent;
    player_dropobject: PlayerDropObjectEvent;
    object_removed: ObjectRemovedEvent;
    object_destroyed: ObjectDestroyedEvent;
    object_detonated: ObjectDetonatedEvent;
    achievement_earned: AchievementEarnedEvent;
    spec_target_updated: SpecTargetUpdatedEvent;
    tournament_stateupdate: TournamentStateUpdateEvent;
    tournament_enablecountdown: TournamentEnableCountdownEvent;
    player_calledformedic: PlayerCalledForMedicEvent;
    player_askedforball: PlayerAskedForBallEvent;
    localplayer_becameobserver: LocalPlayerBecameObserverEvent;
    player_ignited_inv: PlayerIgnitedInvEvent;
    player_ignited: PlayerIgnitedEvent;
    player_extinguished: PlayerExtinguishedEvent;
    player_teleported: PlayerTeleportedEvent;
    player_healedmediccall: PlayerHealedMedicCallEvent;
    localplayer_chargeready: LocalPlayerChargeReadyEvent;
    localplayer_winddown: LocalPlayerWinddownEvent;
    player_invulned: PlayerInvulnedEvent;
    escort_speed: EscortSpeedEvent;
    escort_progress: EscortProgressEvent;
    escort_recede: EscortRecedeEvent;
    gameui_activated: GameUIActivatedEvent;
    gameui_hidden: GameUIHiddenEvent;
    player_escort_score: PlayerEscortScoreEvent;
    player_healonhit: PlayerHealOnHitEvent;
    player_stealsandvich: PlayerStealsandvichEvent;
    show_class_layout: ShowClassLayoutEvent;
    show_vs_panel: ShowVsPanelEvent;
    player_damaged: PlayerDamagedEvent;
    arena_player_notification: ArenaPlayerNotificationEvent;
    arena_match_maxstreak: ArenaMatchMaxStreakEvent;
    arena_round_start: ArenaRoundStartEvent;
    arena_win_panel: ArenaWinPanelEvent;
    pve_win_panel: PveWinPanelEvent;
    air_dash: AirDashEvent;
    landed: LandedEvent;
    player_damage_dodged: PlayerDamageDodgedEvent;
    player_stunned: PlayerStunnedEvent;
    scout_grand_slam: ScoutGrandSlamEvent;
    scout_slamdoll_landed: ScoutSlamdollLandedEvent;
    arrow_impact: ArrowImpactEvent;
    player_jarated: PlayerJaratedEvent;
    player_jarated_fade: PlayerJaratedFadeEvent;
    player_shield_blocked: PlayerShieldBlockedEvent;
    player_pinned: PlayerPinnedEvent;
    player_healedbymedic: PlayerHealedByMedicEvent;
    player_sapped_object: PlayerSappedObjectEvent;
    item_found: ItemFoundEvent;
    show_annotation: ShowAnnotationEvent;
    hide_annotation: HideAnnotationEvent;
    post_inventory_application: PostInventoryApplicationEvent;
    controlpoint_unlock_updated: ControlPointUnlockUpdatedEvent;
    deploy_buff_banner: DeployBuffBannerEvent;
    player_buff: PlayerBuffEvent;
    medic_death: MedicDeathEvent;
    overtime_nag: OvertimeNagEvent;
    teams_changed: TeamsChangedEvent;
    halloween_pumpkin_grab: HalloweenPumpkinGrabEvent;
    rocket_jump: RocketJumpEvent;
    rocket_jump_landed: RocketJumpLandedEvent;
    sticky_jump: StickyJumpEvent;
    sticky_jump_landed: StickyJumpLandedEvent;
    medic_defended: MedicDefendedEvent;
    localplayer_healed: LocalPlayerHealedEvent;
    player_destroyed_pipebomb: PlayerDestroyedPipeBombEvent;
    object_deflected: ObjectDeflectedEvent;
    player_mvp: PlayerMvpEvent;
    raid_spawn_mob: RaidSpawnMobEvent;
    raid_spawn_squad: RaidSpawnSquadEvent;
    nav_blocked: NavBlockedEvent;
    path_track_passed: PathTrackPassedEvent;
    num_cappers_changed: NumCappersChangedEvent;
    player_regenerate: PlayerRegenerateEvent;
    update_status_item: UpdateStatusItemEvent;
    stats_resetround: StatsResetRoundEvent;
    scorestats_accumulated_update: ScoreStatsAccumulatedUpdateEvent;
    scorestats_accumulated_reset: ScoreStatsAccumulatedResetEvent;
    achievement_earned_local: AchievementEarnedLocalEvent;
    player_healed: PlayerHealedEvent;
    building_healed: BuildingHealedEvent;
    item_pickup: ItemPickupEvent;
    duel_status: DuelStatusEvent;
    fish_notice: FishNoticeEvent;
    fish_notice__arm: FishNoticeArmEvent;
    throwable_hit: ThrowableHitEvent;
    pumpkin_lord_summoned: PumpkinLordSummonedEvent;
    pumpkin_lord_killed: PumpkinLordKilledEvent;
    merasmus_summoned: MerasmusSummonedEvent;
    merasmus_killed: MerasmusKilledEvent;
    merasmus_escape_warning: MerasmusEscapeWarningEvent;
    merasmus_escaped: MerasmusEscapedEvent;
    eyeball_boss_summoned: EyeballBossSummonedEvent;
    eyeball_boss_stunned: EyeballBossStunnedEvent;
    eyeball_boss_killed: EyeballBossKilledEvent;
    eyeball_boss_killer: EyeballBossKillerEvent;
    eyeball_boss_escape_imminent: EyeballBossEscapeImminentEvent;
    eyeball_boss_escaped: EyeballBossEscapedEvent;
    npc_hurt: NpcHurtEvent;
    controlpoint_timer_updated: ControlPointTimerUpdatedEvent;
    player_highfive_start: PlayerHighfiveStartEvent;
    player_highfive_cancel: PlayerHighfiveCancelEvent;
    player_highfive_success: PlayerHighfiveSuccessEvent;
    player_bonuspoints: PlayerBonusPointsEvent;
    player_upgraded: PlayerUpgradedEvent;
    player_buyback: PlayerBuybackEvent;
    player_used_powerup_bottle: PlayerUsedPowerUpBottleEvent;
    christmas_gift_grab: ChristmasGiftGrabEvent;
    player_killed_achievement_zone: PlayerKilledAchievementZoneEvent;
    party_updated: PartyUpdatedEvent;
    lobby_updated: LobbyUpdatedEvent;
    mvm_mission_update: MvmMissionUpdateEvent;
    recalculate_holidays: RecalculateHolidaysEvent;
    player_currency_changed: PlayerCurrencyChangedEvent;
    doomsday_rocket_open: DoomsdayRocketOpenEvent;
    remove_nemesis_relationships: RemoveNemesisRelationshipsEvent;
    mvm_creditbonus_wave: MvmCreditBonusWaveEvent;
    mvm_creditbonus_all: MvmCreditBonusAllEvent;
    mvm_creditbonus_all_advanced: MvmCreditBonusAllAdvancedEvent;
    mvm_quick_sentry_upgrade: MvmQuickSentryUpgradeEvent;
    mvm_tank_destroyed_by_players: MvmTankDestroyedByPlayersEvent;
    mvm_kill_robot_delivering_bomb: MvmKillRobotDeliveringBombEvent;
    mvm_pickup_currency: MvmPickupCurrencyEvent;
    mvm_bomb_carrier_killed: MvmBombCarrierKilledEvent;
    mvm_sentrybuster_detonate: MvmSentryBusterDetonateEvent;
    mvm_scout_marked_for_death: MvmScoutMarkedForDeathEvent;
    mvm_medic_powerup_shared: MvmMedicPowerupSharedEvent;
    mvm_begin_wave: MvmBeginWaveEvent;
    mvm_wave_complete: MvmWaveCompleteEvent;
    mvm_mission_complete: MvmMissionCompleteEvent;
    mvm_bomb_reset_by_player: MvmBombResetByPlayerEvent;
    mvm_bomb_alarm_triggered: MvmBombAlarmTriggeredEvent;
    mvm_bomb_deploy_reset_by_player: MvmBombDeployResetByPlayerEvent;
    mvm_wave_failed: MvmWaveFailedEvent;
    mvm_reset_stats: MvmResetStatsEvent;
    damage_resisted: DamageResistedEvent;
    revive_player_notify: RevivePlayerNotifyEvent;
    revive_player_stopped: RevivePlayerStoppedEvent;
    revive_player_complete: RevivePlayerCompleteEvent;
    player_turned_to_ghost: PlayerTurnedToGhostEvent;
    medigun_shield_blocked_damage: MedigunShieldBlockedDamageEvent;
    mvm_adv_wave_complete_no_gates: MvmAdvWaveCompleteNoGatesEvent;
    mvm_sniper_headshot_currency: MvmSniperHeadshotCurrencyEvent;
    mvm_mannhattan_pit: MvmMannhattanPitEvent;
    flag_carried_in_detection_zone: FlagCarriedInDetectionZoneEvent;
    mvm_adv_wave_killed_stun_radio: MvmAdvWaveKilledStunRadioEvent;
    player_directhit_stun: PlayerDirecthitStunEvent;
    mvm_sentrybuster_killed: MvmSentryBusterKilledEvent;
    upgrades_file_changed: UpgradesFileChangedEvent;
    rd_team_points_changed: RdTeamPointsChangedEvent;
    rd_rules_state_changed: RdRulesStateChangedEvent;
    rd_robot_killed: RdRobotKilledEvent;
    rd_robot_impact: RdRobotImpactEvent;
    teamplay_pre_round_time_left: TeamPlayPreRoundTimeLeftEvent;
    parachute_deploy: ParachuteDeployEvent;
    parachute_holster: ParachuteHolsterEvent;
    kill_refills_meter: KillRefillsMeterEvent;
    rps_taunt_event: RpsTauntEventEvent;
    conga_kill: CongaKillEvent;
    player_initial_spawn: PlayerInitialSpawnEvent;
    competitive_victory: CompetitiveVictoryEvent;
    competitive_stats_update: CompetitiveStatsUpdateEvent;
    minigame_win: MiniGameWinEvent;
    sentry_on_go_active: SentryOnGoActiveEvent;
    duck_xp_level_up: DuckXpLevelUpEvent;
    questlog_opened: QuestLogOpenedEvent;
    schema_updated: SchemaUpdatedEvent;
    localplayer_pickup_weapon: LocalPlayerPickupWeaponEvent;
    rd_player_score_points: RdPlayerScorePointsEvent;
    demoman_det_stickies: DemomanDetStickiesEvent;
    quest_objective_completed: QuestObjectiveCompletedEvent;
    player_score_changed: PlayerScoreChangedEvent;
    killed_capping_player: KilledCappingPlayerEvent;
    environmental_death: EnvironmentalDeathEvent;
    projectile_direct_hit: ProjectileDirectHitEvent;
    pass_get: PassGetEvent;
    pass_score: PassScoreEvent;
    pass_free: PassFreeEvent;
    pass_pass_caught: PassPassCaughtEvent;
    pass_ball_stolen: PassBallStolenEvent;
    pass_ball_blocked: PassBallBlockedEvent;
    damage_prevented: DamagePreventedEvent;
    halloween_boss_killed: HalloweenBossKilledEvent;
    escaped_loot_island: EscapedLootIslandEvent;
    tagged_player_as_it: TaggedPlayerAsItEvent;
    merasmus_stunned: MerasmusStunnedEvent;
    merasmus_prop_found: MerasmusPropFoundEvent;
    halloween_skeleton_killed: HalloweenSkeletonKilledEvent;
    escape_hell: EscapeHellEvent;
    cross_spectral_bridge: CrossSpectralBridgeEvent;
    minigame_won: MiniGameWonEvent;
    respawn_ghost: RespawnGhostEvent;
    kill_in_hell: KillInHellEvent;
    halloween_duck_collected: HalloweenDuckCollectedEvent;
    special_score: SpecialScoreEvent;
    team_leader_killed: TeamLeaderKilledEvent;
    halloween_soul_collected: HalloweenSoulCollectedEvent;
    recalculate_truce: RecalculateTruceEvent;
    deadringer_cheat_death: DeadringerCheatDeathEvent;
    crossbow_heal: CrossbowHealEvent;
    damage_mitigated: DamageMitigatedEvent;
    payload_pushed: PayloadPushedEvent;
    player_abandoned_match: PlayerAbandonedMatchEvent;
    cl_drawline: ClDrawlineEvent;
    restart_timer_time: RestartTimerTimeEvent;
    winlimit_changed: WinLimitChangedEvent;
    winpanel_show_scores: WinPanelShowScoresEvent;
    top_streams_request_finished: TopStreamsRequestFinishedEvent;
    competitive_state_changed: CompetitiveStateChangedEvent;
    global_war_data_updated: GlobalWarDataUpdatedEvent;
    stop_watch_changed: StopWatchChangedEvent;
    ds_stop: DsStopEvent;
    ds_screenshot: DsScreenshotEvent;
    show_match_summary: ShowMatchSummaryEvent;
    experience_changed: ExperienceChangedEvent;
    begin_xp_lerp: BeginXpLerpEvent;
    matchmaker_stats_updated: MatchmakerStatsUpdatedEvent;
    rematch_vote_period_over: RematchVotePeriodOverEvent;
    rematch_failed_to_create: RematchFailedToCreateEvent;
    player_rematch_change: PlayerRematchChangeEvent;
    ping_updated: PingUpdatedEvent;
    player_next_map_vote_change: PlayerNextMapVoteChangeEvent;
    vote_maps_changed: VoteMapsChangedEvent;
    hltv_status: HLTVStatusEvent;
    hltv_cameraman: HLTVCameramanEvent;
    hltv_rank_camera: HLTVRankCameraEvent;
    hltv_rank_entity: HLTVRankEntityEvent;
    hltv_fixed: HLTVFixedEvent;
    hltv_chase: HLTVChaseEvent;
    hltv_message: HLTVMessageEvent;
    hltv_title: HLTVTitleEvent;
    hltv_chat: HLTVChatEvent;
    replay_startrecord: ReplayStartRecordEvent;
    replay_sessioninfo: ReplaySessionInfoEvent;
    replay_endrecord: ReplayEndRecordEvent;
    replay_replaysavailable: ReplayReplaysAvailableEvent;
    replay_servererror: ReplayServerErrorEvent;
}
export declare type GameEventTypeId = number;
export declare const GameEventTypeIdMap: Map<GameEventType, GameEventTypeId>;
