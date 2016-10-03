var random = require('alea-random');
var isPlainObject = require('lodash.isplainobject');
var keys = require('lodash.keys');
var reduce = require('lodash.reduce');
var isNumber = require('lodash.isnumber');

function deck(xs) {
  if (!Array.isArray(xs) && !isPlainObject(xs)) {
    throw new TypeError('Must be an Array or an Object');
  }

  return reduce(keys(module.exports), function(acc, name) {
    acc[name] = module.exports[name].bind(null, xs);
    return acc;
  }, {});
}

function shuffle(xs) {
  if (Array.isArray(xs)) {
    var res = xs.slice();
    for (var i = res.length - 1; i >= 0; i--) {
      var n = Math.floor(random(true) * i);
      var t = res[i];
      res[i] = res[n];
      res[n] = t;
    }
    return res;
  }
  else if (isPlainObject(xs)) {
    var weights = reduce(keys(xs), function(acc, key) {
      acc[key] = xs[key];
      return acc;
    }, {});

    var ret = [];

    while (keys(weights).length > 0) {
      var key = pick(weights);
      delete weights[key];
      ret.push(key);
    }

    return ret;
  }
  else {
    throw new TypeError('Must be an Array or an Object');
  }
}

function pick(xs) {
  if (Array.isArray(xs)) {
    return xs[Math.floor(random(true) * xs.length)];
  }
  else if (isPlainObject(xs)) {
    var weights = normalize(xs);
    if (!weights) {
      return undefined;
    }

    var n = random(true);
    var threshold = 0;
    var keyz = keys(weights);

    for (var i = 0; i < keyz.length; i++) {
      threshold += weights[keyz[i]];
      if (n < threshold) {
        return keyz[i];
      }
    }
    throw new Error('Exceeded threshold. Something is very wrong.');
  }
  else {
    throw new TypeError('Must be an Array or an Object');
  }
}

function normalize(weights) {
  if (!isPlainObject(weights)) {
    throw 'Not an Object';
  }

  var keyz = keys(weights);
  if (!keyz.length) {
    return undefined;
  }

  var total = reduce(keyz, function(sum, key) {
    var x = weights[key];
    if (x < 0) {
      throw new Error('Negative weight encountered at key ' + key);
    }
    else if (!isNumber(x)) {
      throw new TypeError('Number expected, got ' + typeof x);
    }
    else {
      return sum + x;
    }
  }, 0);

  return total === 1
    ? weights
    : reduce(keyz, function(acc, key) {
        acc[key] = weights[key] / total;
        return acc;
      }, {});
}

module.exports = deck;
module.exports.shuffle = shuffle;
module.exports.pick = pick;
module.exports.normalize = normalize;
