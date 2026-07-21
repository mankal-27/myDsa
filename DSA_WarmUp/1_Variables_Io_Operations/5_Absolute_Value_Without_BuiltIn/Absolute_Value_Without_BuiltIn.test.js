const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Absolute_Value_Without_BuiltIn.js');

const sol = new Solution();

// [description, num, expected]
const cases = [
  ['example 1: negative', -7, 7],
  ['example 2: positive', 5, 5],
  ['example 3: zero', 0, 0],
  ['negative one', -1, 1],
  ['positive one', 1, 1],
  ['32-bit signed max', 2147483647, 2147483647],
  ['32-bit signed min (no overflow back to negative)', -2147483648, 2147483648],
  ['negative, larger magnitude', -100, 100],
  ['positive, same magnitude', 100, 100],
];

test('Solution.absoluteValueBruteForce', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.absoluteValueBruteForce(num), expected);
    });
  }
});

test('Solution.absoluteValueOptimized', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.absoluteValueOptimized(num), expected);
    });
  }
});

test('brute force and optimized agree on every case', () => {
  for (const [, num] of cases) {
    assert.equal(sol.absoluteValueBruteForce(num), sol.absoluteValueOptimized(num));
  }
});
