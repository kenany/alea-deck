var deck = require('../');
var test = require('tape');

test('normalize', function(t) {
  t.plan(3);

  t.deepEqual(
    deck.normalize({a: 1, b: 3, c: 4}),
    {a: 0.125, b: 0.375, c: 0.5}

  );

  var total = 0.1 + 0.2 + 0.05;
  t.deepEqual(
    deck.normalize({a: 0.1, b: 0.2, c: 0.05}),
    {a: 0.1 / total, b: 0.2 / total, c: 0.05 / total}
  );

  t.throws(function() {
    deck.normalize({a: 0.1, b: 0.2, c: []});
  });
});