const random = require('alea-random');
const isPlainObject = require('lodash.isplainobject');
const keys = require('lodash.keys');
const reduce = require('lodash.reduce');
const isNumber = require('lodash.isnumber');

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
    const res = xs.slice();
    for (let i = res.length - 1; i >= 0; i--) {
      const n = Math.floor(random(true) * i);
      const t = res[i];
      res[i] = res[n];
      res[n] = t;
    }
    return res;
  }
  else if (isPlainObject(xs)) {
    const weights = reduce(keys(xs), function(acc, key) {
      acc[key] = xs[key];
      return acc;
    }, {});

    const ret = [];

    while (keys(weights).length > 0) {
      const key = pick(weights);
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
    const weights = normalize(xs);
    if (!weights) {
      return undefined;
    }

    const n = random(true);
    let threshold = 0;
    const keyz = keys(weights);

    for (let i = 0; i < keyz.length; i++) {
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
    throw new TypeError('`weights` must be an object');
  }

  const keyz = keys(weights);
  if (!keyz.length) {
    return undefined;
  }

  const total = reduce(keyz, function(sum, key) {
    const x = weights[key];
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
