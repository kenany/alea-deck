import { normalize } from 'alea-deck';
import { describe, expect, it } from 'vitest';

describe('normalize', () => {
  it('normalizes weights', () => {
    expect(normalize({ a: 1, b: 3, c: 4 })).toEqual({
      a: 0.125,
      b: 0.375,
      c: 0.5,
    });

    const total = 0.1 + 0.2 + 0.05;
    expect(normalize({ a: 0.1, b: 0.2, c: 0.05 })).toEqual({
      a: 0.1 / total,
      b: 0.2 / total,
      c: 0.05 / total,
    });

    expect(() => {
      normalize({ a: 0.1, b: 0.2, c: [] as never });
    }).toThrow();
  });

  it('throws for non-objects', () => {
    const nonObjects = ['', true, false, [], 3, Number.NaN, null, undefined];

    for (const no of nonObjects) {
      expect(() => {
        normalize(no as never);
      }).toThrow();
    }
  });
});
