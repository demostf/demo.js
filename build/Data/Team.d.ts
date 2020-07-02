export declare enum TeamNumber {
    UNASGINED = 0,
    SPECTATOR = 1,
    RED = 2,
    BLU = 3
}
export interface Team {
    teamNumber: TeamNumber;
    name: string;
    score: number;
    roundsWon: number;
    players: number[];
}
