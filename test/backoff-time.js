'use strict';
const assert = require('assert');
const backoff = require('..');
const MAX_4_BYTE_SIGNED_INT = 2147483647;
describe('backoff', function () {
    describe('param checking', function () {
        describe('when `min` is not a number', function () {
            it('should throw an error', function () {
                try {
                    backoff('0');
                } catch (e) {
                    assert.deepEqual(e.message, 'min is mandatory and should be a number');
                    return;
                }
                assert.fail();
            });
        });
        describe('when `max` is not a number', function () {
            it('should throw an error', function () {
                try {
                    backoff(1, '0');
                } catch (e) {
                    assert.deepEqual(e.message, 'max is mandatory and should be a number');
                    return;
                }
                assert.fail();
            });
        });
        describe('when `min` is not lower than `max`', function () {
            it('should throw an error', function () {
                try {
                    backoff(5, 5);
                } catch (e) {
                    assert.deepEqual(e.message, 'min should be lower than max');
                    return;
                }
                assert.fail();
            });
        });
        describe('when `min` is lower than "1"', function () {
            it('should throw an error', function () {
                try {
                    backoff(0, 5);
                } catch (e) {
                    assert.deepEqual(e.message, 'min should be greater or equal than 1');
                    return;
                }
                assert.fail();
            });
        });
        describe('when `max` is bigger  than ' + MAX_4_BYTE_SIGNED_INT + '  (max 4 byte signed integer)', function () {
            it('should throw an error', function () {
                try {
                    backoff(1, MAX_4_BYTE_SIGNED_INT + 1);
                } catch (e) {
                    assert.deepEqual(e.message, 'max should be lower or equal than 2147483647');
                    return;
                }
                assert.fail();
            });
        });
    });
    describe('first call', function () {
        it('should always return the min value', function () {
            const min = 50;
            const max = min * 10;
            var actual = backoff(min, max)(1);
            assert.deepEqual(actual, min);
        });
    });

    function weirdAttemptsShouldReturnMinValue(input, name) {
        describe('when `attempt` is ' + name, function () {
            it('should return `min` value', function () {
                const min = 50;
                var actual = backoff(min, MAX_4_BYTE_SIGNED_INT)(input);
                assert.deepEqual(actual, min);
            });
        });
    }
    describe('weird `attempt` values', function () {
        weirdAttemptsShouldReturnMinValue(0, 'zero');
        weirdAttemptsShouldReturnMinValue(0.1, 'zero.something');
        weirdAttemptsShouldReturnMinValue(1, 'first');
        weirdAttemptsShouldReturnMinValue(-100, 'negative');
        weirdAttemptsShouldReturnMinValue(-0.1, 'negative decimal');
    });
    describe('max value protection', function () {
        it('should never output a value higher than ' + MAX_4_BYTE_SIGNED_INT, function () {
            const min = MAX_4_BYTE_SIGNED_INT - 1;
            var actual = backoff(min, MAX_4_BYTE_SIGNED_INT)(100);
            assert.deepEqual(actual, MAX_4_BYTE_SIGNED_INT);
        });
    });
    describe('exponential backoff', function () {
        var values = [];
        before(function () {
            const b = backoff(100, MAX_4_BYTE_SIGNED_INT);
            for (let i = 1; i < 10; i++) {
                values.push(b(i));
            }
        });
        it('should increment the output exponentially', function () {
            const expected = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600];
            assert.deepEqual(values, expected);
        });
    });
});
