export function logBase2(num: number): number {
	let result = 0;
	num >>= 1;
	while (num !== 0 && result < 32) {
		result++;
		num >>= 1;
	}
	return result;
}
