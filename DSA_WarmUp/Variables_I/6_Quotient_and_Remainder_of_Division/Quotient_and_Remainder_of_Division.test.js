const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Quotient_and_Remainder_of_Division.js');

const sol = new Solution();

// [description, dividend, divisor, expected]
const cases = [
  ['example 1: positive/positive', 13, 4, [3, 1]],
  ['example 2: negative dividend', -13, 4, [-3, -1]],
  ['example 3: negative divisor', 13, -4, [-3, 1]],
  ['both negative', -13, -4, [3, -1]],
  ['zero dividend', 0, 5, [0, 0]],
  ['exact division, no remainder', 7, 7, [1, 0]],
  ['larger numbers', 100, 7, [14, 2]],
  ['larger numbers, negative dividend', -100, 7, [-14, -2]],
  ['larger numbers, negative divisor', 100, -7, [-14, 2]],
  ['dividend smaller than divisor', 3, 10, [0, 3]],
  ['divide by 1 (brute force stress case)', 1000000, 1, [1000000, 0]],
];

test('Solution.divideBruteForce', async (t) => {
  for (const [description, dividend, divisor, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.divideBruteForce(dividend, divisor), expected);
    });
  }
});

test('Solution.divideOptimized', async (t) => {
  for (const [description, dividend, divisor, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.divideOptimized(dividend, divisor), expected);
    });
  }
});

test('brute force and optimized agree on every case', () => {
  for (const [, dividend, divisor] of cases) {
    assert.deepEqual(sol.divideBruteForce(dividend, divisor), sol.divideOptimized(dividend, divisor));
  }
});
