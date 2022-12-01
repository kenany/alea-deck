const test = require('tape');
const every = require('lodash.every');
const reduce = require('lodash.reduce');
const keys = require('lodash.keys');

const deck = require('../');

function shuffler(fn, t) {
  const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const xs_ = fn(xs);
  t.deepEqual(xs, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  t.equal(xs.length, 10);
  t.ok(every(xs, function(x) {
    return xs_.indexOf(x) >= 0;
  }));
}

test('shuffle', function(t) {
  t.plan(3);

  shuffler(deck.shuffle, t);
});

test('shuffle object', function(t) {
  t.plan(3);

  shuffler(function(xs) {
    return deck(xs).shuffle();
  }, t);
});

test('weighted shuffle', function(t) {
  t.plan(4);

  t.deepEqual(deck.shuffle({ a: 1000, b: 0.01 }), ['a', 'b']);

  const weights = { a: 3, b: 1, c: 10 };
  const loops = 5000;

  const counts = {};
  for (let i = 0; i < loops; i++) {
    const x = deck.shuffle(weights).join('');
    counts[x] = (counts[x] || 0) + 1;
  }

  function margins(key) {
    const keys = key.split('');
    const expected = reduce(key.split(''), function(p, x) {
      const p_ = p * weights[x] / reduce(keys, function(acc, k) {
        return acc + weights[k];
      }, 0);
      keys.shift();
      return p_;
    }, loops);
    t.ok(counts[key] >= 0.95 * expected);
    t.ok(counts[key] <= 1.05 * expected);
  }

  every(keys(counts), margins);

  t.throws(function() {
    deck.shuffle({ a: 1, b: 'x', c: 5 });
  });
});
