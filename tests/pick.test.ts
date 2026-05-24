import { deck, pick } from 'alea-deck';
import { describe, expect, it } from 'vitest';

const MOO_REGEX = /moo/;

describe('pick', () => {
  it('picks uniformly from array', () => {
    const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const counts: Record<number, number> = {};
    const loops = 50_000;

    for (let i = 0; i < loops; i++) {
      const x = pick(xs)!;
      counts[x] = (counts[x] ?? 0) + 1;
    }

    expect(
      Object.keys(counts)
        .map(Number)
        .sort((a, b) => a - b)
    ).toEqual(xs);
    expect(xs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const x of xs) {
      expect(counts[x] * xs.length).toBeGreaterThanOrEqual(loops * 0.95);
      expect(counts[x] * xs.length).toBeLessThanOrEqual(loops * 1.05);
    }
  });

  it('picks uniformly via deck object', () => {
    const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const counts: Record<number, number> = {};
    const loops = 50_000;

    for (let i = 0; i < loops; i++) {
      const x = deck(xs).pick()!;
      counts[x] = (counts[x] ?? 0) + 1;
    }

    expect(
      Object.keys(counts)
        .map(Number)
        .sort((a, b) => a - b)
    ).toEqual(xs);
    expect(xs).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const x of xs) {
      expect(counts[x] * xs.length).toBeGreaterThanOrEqual(loops * 0.95);
      expect(counts[x] * xs.length).toBeLessThanOrEqual(loops * 1.05);
    }
  });

  it('picks weighted', () => {
    const counts: Record<string, number> = {};
    const weights = { a: 2, b: 10, c: 1 };
    const total = 2 + 10 + 1;
    const loops = 50_000;

    for (let i = 0; i < loops; i++) {
      const x = pick(weights)!;
      counts[x] = (counts[x] ?? 0) + 1;
    }

    expect(Object.keys(counts).sort()).toEqual(['a', 'b', 'c']);

    for (const key of Object.keys(weights) as (keyof typeof weights)[]) {
      expect((counts[key] / weights[key]) * total).toBeGreaterThanOrEqual(
        loops * 0.95
      );
      expect((counts[key] / weights[key]) * total).toBeLessThanOrEqual(
        loops * 1.05
      );
    }

    expect(() => {
      pick({ a: 5, b: 2, c: MOO_REGEX } as never);
    }).toThrow();
  });

  it('returns undefined for empty inputs', () => {
    expect(pick([])).toBeUndefined();
    expect(pick({})).toBeUndefined();
  });
});
