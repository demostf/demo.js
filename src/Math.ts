export function logBase2(num: number): number {
	let result = 0;
	while ((num >>= 1) != 0) {
		result++;
	}
	return result;
}
