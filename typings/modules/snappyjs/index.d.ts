declare module 'snappyjs' {
	export function uncompress(input: Uint8Array): Uint8Array;

	export function compress(input: Uint8Array): Uint8Array;
}
