import * as assert from 'assert';
import {BitStream} from 'bit-buffer';

export interface EqualOpts {
	strict?: boolean;
}

export function deepEqual(actual, expected, opts: EqualOpts = {}) {
	// 7.1. All identical values are equivalent, as determined by ===.
	if (actual === expected) {
		return true;

	} else if (actual instanceof Date && expected instanceof Date) {
		return actual.getTime() === expected.getTime();

		// 7.3. Other pairs that do not both pass typeof value == 'object',
		// equivalence is determined by ==.
	} else if (!actual || !expected || typeof actual !== 'object' && typeof expected !== 'object') {
		// tslint:disable-next-line
		return opts.strict ? actual === expected : actual == expected;

		// 7.4. For all other Object pairs, including Array objects, equivalence is
		// determined by having the same number of owned properties (as verified
		// with Object.prototype.hasOwnProperty.call), the same set of keys
		// (although not necessarily the same order), equivalent values for every
		// corresponding key, and an identical 'prototype' property. Note: this
		// accounts for both named and indexed properties on Arrays.
	} else {
		return objEquiv(actual, expected, opts);
	}
}

function isUndefinedOrNull(value) {
	return value === null || value === undefined;
}

function isBuffer(x): x is Buffer {
	if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
		return false;
	}
	if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
		return false;
	}
	return !(x.length > 0 && typeof x[0] !== 'number');
}

function isStream(stream): stream is BitStream {
	return stream instanceof BitStream;
}

function objEquiv(a, b, opts) {
	let i;
	let key;
	if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
		return false;
	}
	// an identical 'prototype' property.
	if (a.prototype !== b.prototype) {
		return false;
	}
	// ~~~I've managed to break Object.keys through screwy arguments passing.
	//   Converting to array solves the problem.
	if (isBuffer(a)) {
		if (!isBuffer(b)) {
			return false;
		}
		if (a.length !== b.length) {
			return false;
		}

		for (i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}
	if (isStream(a)) {
		if (!isStream(b)) {
			return false;
		}
		if (a.length !== b.length) {
			return false;
		}
		a.index = 0;
		b.index = 0;
		while (a.bitsLeft > 0) {
			const bitsToRead = Math.min(32, a.bitsLeft);
			if (a.readBits(bitsToRead) !== b.readBits(bitsToRead)) {
				return false;
			}
		}
		a.index = 0;
		b.index = 0;
		return true;
	}
	try {
		const ka = Object.keys(a);
		const kb = Object.keys(b);

		// having the same number of owned properties (keys incorporates
		// hasOwnProperty)
		if (ka.length !== kb.length) {
			return false;
		}
		// the same set of keys (although not necessarily the same order),
		ka.sort();
		kb.sort();
		// ~~~cheap key test
		for (i = ka.length - 1; i >= 0; i--) {
			if (ka[i] !== kb[i]) {
				return false;
			}
		}
		// equivalent values for every corresponding key, and
		// ~~~possibly expensive deep test
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!deepEqual(a[key], b[key], opts)) {
				return false;
			}
		}
		return typeof a === typeof b;
	} catch (e) {// happens when one is a string literal and the other isn't
		return false;
	}
}
