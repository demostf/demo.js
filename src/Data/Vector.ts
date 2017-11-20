export class Vector {
	public x: number;
	public y: number;
	public z: number;

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public static areEqual(a: Vector, b: Vector) {
		return a.x === b.x && a.y === b.y && a.z === b.z;
	}
}
