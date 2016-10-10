var deck = require('../');
var test = require('tape');
var keys = require('lodash.keys');
var isUndefined = require('lodash.isundefined');
var map = require('lodash.map');

function picker(fn, t) {
  var xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var counts = {};
  var loops = 50000;

  for (var i = 0; i < loops; i++) {
    var x = fn(xs);
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

  var counts = {};
  var weights = {a: 2, b: 10, c: 1};
  var total = 2 + 10 + 1;
  var loops = 50000;

  for (var i = 0; i < loops; i++) {
    var x = deck.pick(weights);
    counts[x] = (counts[x] || 0) + 1;
  }

  t.deepEqual(keys(counts).sort(), ['a', 'b', 'c']);

  keys(weights).forEach(function(key) {
    t.ok(counts[key] / weights[key] * total >= loops * 0.95);
    t.ok(counts[key] / weights[key] * total <= loops * 1.05);
  });

  t.throws(function() {
    deck.pick({a: 5, b: 2, c: /moo/});
  });
});

test('pick empty', function(t) {
  t.plan(2);
  t.ok(isUndefined(deck.pick([])));
  t.ok(isUndefined(deck.pick({})));
});
