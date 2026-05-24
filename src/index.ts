import { isPlainObject } from '@thi.ng/checks';
import random from 'alea-random';

type WeightMap = Record<string, number>;

/**
 * Binds `shuffle` and `pick` to the given collection, returning an object
 * with both methods pre-applied to `xs`.
 */
export function deck<T>(xs: readonly T[]): {
  shuffle: () => T[];
  pick: () => T | undefined;
};
export function deck(xs: WeightMap): {
  shuffle: () => string[];
  pick: () => string | undefined;
};
export function deck<T>(xs: readonly T[] | WeightMap): {
  shuffle: () => T[] | string[];
  pick: () => T | string | undefined;
} {
  if (!(Array.isArray(xs) || isPlainObject(xs))) {
    throw new TypeError('Must be an Array or an Object');
  }

  return {
    shuffle: shuffle.bind(null, xs as never),
    pick: pick.bind(null, xs as never),
  };
}

/**
 * Returns a shuffled copy of `xs` without mutating the original.
 *
 * If `xs` is an Array, elements are reordered with uniform probability.
 * If `xs` is an Object, returns a shuffled array of its keys weighted by
 * their values.
 */
export function shuffle<T>(xs: readonly T[]): T[];
export function shuffle(xs: WeightMap): string[];
export function shuffle<T>(xs: readonly T[] | WeightMap): T[] | string[] {
  if (Array.isArray(xs)) {
    const res = xs.slice();
    for (let i = res.length - 1; i >= 0; i--) {
      const n = Math.floor(random(0, 1, true) * i);
      const t = res[i];
      res[i] = res[n];
      res[n] = t;
    }
    return res;
  }
  if (isPlainObject(xs)) {
    const weights: WeightMap = { ...(xs as WeightMap) };
    const ret: string[] = [];

    while (Object.keys(weights).length > 0) {
      const key = pick(weights) as string;
      delete weights[key];
      ret.push(key);
    }

    return ret;
  }
  throw new TypeError('Must be an Array or an Object');
}

/**
 * Samples a single element from `xs` without mutating it.
 *
 * If `xs` is an Array, returns a uniformly random element, or `undefined` if
 * the array is empty.
 * If `xs` is an Object, returns a key sampled with probability proportional to
 * its normalized weight, or `undefined` if the object is empty.
 */
export function pick<T>(xs: readonly T[]): T | undefined;
export function pick(xs: WeightMap): string | undefined;
export function pick<T>(xs: readonly T[] | WeightMap): T | string | undefined {
  if (Array.isArray(xs)) {
    if (xs.length === 0) {
      return undefined;
    }
    return xs[Math.floor(random(0, 1, true) * xs.length)];
  }
  if (isPlainObject(xs)) {
    const weights = normalize(xs as WeightMap);
    if (!weights) {
      return undefined;
    }

    const n = random(0, 1, true);
    let threshold = 0;
    const keyz = Object.keys(weights);

    for (const key of keyz) {
      threshold += weights[key];
      if (n < threshold) {
        return key;
      }
    }
    throw new Error('Exceeded threshold. Something is very wrong.');
  }
  throw new TypeError('Must be an Array or an Object');
}

/**
 * Returns a copy of `weights` where every value has been divided by the total
 * so that all values sum to 1. Returns `undefined` for an empty object.
 */
export function normalize(weights: WeightMap): WeightMap | undefined {
  if (!isPlainObject(weights)) {
    throw new TypeError('`weights` must be an object');
  }

  const keyz = Object.keys(weights);
  if (!keyz.length) {
    return undefined;
  }

  const total = keyz.reduce((sum, key) => {
    const x = weights[key];
    if (x < 0) {
      throw new Error(`Negative weight encountered at key ${key}`);
    }
    if (typeof x !== 'number' || Number.isNaN(x)) {
      throw new TypeError(`Number expected, got ${typeof x}`);
    }
    return sum + x;
  }, 0);

  return total === 1
    ? weights
    : keyz.reduce<WeightMap>((acc, key) => {
        acc[key] = weights[key] / total;
        return acc;
      }, {});
}
