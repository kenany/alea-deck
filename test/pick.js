const test = require('tape');
const keys = require('lodash.keys');
const isUndefined = require('lodash.isundefined');
const map = require('lodash.map');

const deck = require('../');

function picker(fn, t) {
  const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const counts = {};
  const loops = 50000;

  for (let i = 0; i < loops; i++) {
    const x = fn(xs);
    counts[x] = (counts[x] || 0) + 1;
  }
  t.deepEqual(map(keys(counts).sort(), function(x) {
    return +x;
  }), xs);
  t.deepEqual(xs, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  xs.forEach(function(x) {
    t.ok(counts[x] * xs.length >= loops * 0.95);
    t.ok(counts[x] * xs.length <= loops * 1.05);
  });
}

test('pick', function(t) {
  t.plan(22);

  picker(deck.pick, t);
});

test('pick object', function(t) {
  t.plan(22);

  picker(function(xs) {
    return deck(xs).pick();
  }, t);
});

test('weighted pick', function(t) {
  t.plan(8);

  const counts = {};
  const weights = { a: 2, b: 10, c: 1 };
  const total = 2 + 10 + 1;
  const loops = 50000;

  for (let i = 0; i < loops; i++) {
    const x = deck.pick(weights);
    counts[x] = (counts[x] || 0) + 1;
  }

  t.deepEqual(keys(counts).sort(), ['a', 'b', 'c']);

  keys(weights).forEach(function(key) {
    t.ok(counts[key] / weights[key] * total >= loops * 0.95);
    t.ok(counts[key] / weights[key] * total <= loops * 1.05);
  });

  t.throws(function() {
    deck.pick({ a: 5, b: 2, c: /moo/ });
  });
});

test('pick empty', function(t) {
  t.plan(2);
  t.ok(isUndefined(deck.pick([])));
  t.ok(isUndefined(deck.pick({})));
});
