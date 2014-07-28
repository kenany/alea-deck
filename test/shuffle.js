var deck = require('../');
var test = require('tape');
var every = require('lodash.every');
var reduce = require('lodash.reduce');
var keys = require('lodash.keys');
var Alea = require('alea');
var uuid = require('node-uuid');

function shuffler(fn, t) {
  var xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var xs_ = fn(xs);
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

test('quick', function(t) {
  t.plan(2);

  var xs = [];
  for (var i = 0; i < 1e5; i++) {
    xs.push((new Alea(uuid.v4()))());
  };

  var t0 = Date.now();
  var xs_ = deck.shuffle(xs);
  var elapsed = Date.now() - t0;
  t.ok(elapsed < 1000);
  t.equal(xs.length, 1e5);
});

test('shuffle object', function(t) {
  t.plan(3);

  shuffler(function(xs) {
    return deck(xs).shuffle();
  }, t);
});

test('weighted shuffle', function(t) {
  t.plan(4);

  t.deepEqual(deck.shuffle({a: 1000, b: 0.01}), ['a', 'b']);

  var weights = {a: 3, b: 1, c: 10};
  var total = 3 + 1 + 10;
  var loops = 5000;

  var counts = {};
  for (var i = 0; i < loops; i++) {
    var x = deck.shuffle(weights).join('');
    counts[x] = (counts[x] || 0) + 1;
  }

  function margins(key) {
    var keys = key.split('');
    var expected = reduce(key.split(''), function(p, x) {
      var p_ = p * weights[x] / reduce(keys, function(acc, k) {
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
    deck.shuffle({a: 1, b: 'x', c: 5});
  });
});