export interface UserInfo extends UserEntityInfo {
	classes: any;
	team: string;
}

export type UserId = number;

export interface UserEntityInfo {
	name: string;
	userId: UserId;
	steamId: string;
	entityId: number;
}
