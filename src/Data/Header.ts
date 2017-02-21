export interface Header {
	type: string;
	version: number;
	protocol: number;
	server: string;
	nick: string;
	map: string;
	game: string;
	duration: number;
	ticks: number;
	frames: number;
	sigon: number;
}
