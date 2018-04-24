'use strict';
const MAX = Math.pow(2, 31) - 1; // max signed 4 byte int value
const isNumber = require('./lib/is-number');

function checkInput(min, max) {
    if (!isNumber(min)) {
        throw new Error('min is mandatory and should be a number');
    }
    if (!isNumber(max)) {
        throw new Error('max is mandatory and should be a number');
    }
    if (false === (min < max)) {
        throw new Error('min should be lower than max');
    }
    if (min < 1) {
        throw new Error('min should be greater or equal than 1');
    }
    if (max > MAX) {
        throw new Error('max should be lower or equal than ' + MAX);
    }
}

function createBackoff(min, max) {
    checkInput(min, max);
    return function backoff(attempt) {
        let curr = Math.abs(Math.ceil(0.5 * (Math.pow(2, attempt) - 1)) * min);
        let neverHigherThanMax = Math.min(curr, max);
        let neverLowerThanMin = Math.max(min, neverHigherThanMax);
        return neverLowerThanMin;
    };
}
exports = module.exports = createBackoff;
