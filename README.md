# alea-deck

Uniform and weighted shuffling and sampling, just like
[deck](https://github.com/substack/node-deck), but utilizing
[Alea](https://github.com/coverslide/node-alea) instead of `Math.random`.

## Example

``` javascript
import { shuffle, pick } from 'alea-deck';

shuffle([1, 2, 3, 4]);
// => [1, 4, 2, 3]

pick([1, 2, 3, 4]);
// => 2

shuffle({
  a: 10,
  b: 8,
  c: 2,
  d: 1,
  e: 1
});
// => ['b', 'a', 'c', 'd', 'e']

pick({
  a: 10,
  b: 8,
  c: 2,
  d: 1,
  e: 1
});
// => a
```

## Installation

``` bash
$ npm install alea-deck
```

## API

``` javascript
import { deck, shuffle, pick, normalize } from 'alea-deck';
```

### `deck(collection)`

Binds `shuffle` and `pick` to `collection`, returning an object with both
methods pre-applied.

``` javascript
const d = deck([1, 2, 3, 4]);

d.shuffle(); // => [3, 1, 4, 2]
d.pick();    // => 3
```

### `shuffle(collection)`

If `collection` is an _Array_, returns a new shuffled _Array_ based on a unifrom
distributionm without mutating the original _Array_.

Otherwise, if `collection` is an _Object_, returns a new shuffled _Array_ of
`collection`'s visible keys based on the value weights of `collection`.

### `pick(collection)`

Samples `collection` without mutating `collection`.

If `collection` is an _Array_, returns a random element from `collection` with a
uniform distribution.

Otherwise, if `collection` is an _Object_, returns a random key from
`collection` biased by its normalized value.

### `normalize(obj)`

Return a new `obj` _Object_ where the values have been divided by the sum of all
the values such that the sum of all the values in the returned _Object_ is 1.

If any weights are `< 0`, an _Error_ is thrown.
