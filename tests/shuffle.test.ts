import { deck, shuffle } from 'alea-deck';
import { describe, expect, it } from 'vitest';

describe('shuffle', () => {
  it('shuffles array', () => {
    const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = shuffle(xs);
    expect(xs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(xs.length).toBe(10);
    expect(xs.every((x) => shuffled.includes(x))).toBe(true);
  });

  it('shuffles via deck object', () => {
    const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = deck(xs).shuffle();
    expect(xs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(xs.length).toBe(10);
    expect(xs.every((x) => shuffled.includes(x))).toBe(true);
  });

  it('weighted shuffle', () => {
    expect(shuffle({ a: 1000, b: 0.01 })).toEqual(['a', 'b']);

    const weights = { a: 3, b: 1, c: 10 };
    const loops = 50_000;
    const counts: Record<string, number> = {};

    for (let i = 0; i < loops; i++) {
      const x = shuffle(weights).join('');
      counts[x] = (counts[x] ?? 0) + 1;
    }

    function expectedCount(key: string): number {
      const keyChars = key.split('');
      const remaining = [...keyChars];
      return keyChars.reduce((p, x) => {
        const sum = remaining.reduce(
          (acc, k) => acc + weights[k as keyof typeof weights],
          0
        );
        const p2 = (p * weights[x as keyof typeof weights]) / sum;
        remaining.shift();
        return p2;
      }, loops);
    }

    // Only assert on high-probability permutations where ±10% is reliable.
    for (const key of Object.keys(counts)) {
      const expected = expectedCount(key);
      if (expected >= 2000) {
        expect(counts[key]).toBeGreaterThanOrEqual(0.9 * expected);
        expect(counts[key]).toBeLessThanOrEqual(1.1 * expected);
      }
    }

    expect(() => {
      shuffle({ a: 1, b: 'x', c: 5 } as never);
    }).toThrow();
  });
});
