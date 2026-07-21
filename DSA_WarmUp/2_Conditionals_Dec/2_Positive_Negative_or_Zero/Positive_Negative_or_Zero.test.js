const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Positive_Negative_or_Zero.js');

const sol = new Solution();

// [description, num, expected]
const cases = [
  ['example 1: positive integer', 5, 'Positive'],
  ['example 2: negative integer', -5, 'Negative'],
  ['example 3: zero', 0, 'Zero'],
  ['example 4: small negative fraction', -0.001, 'Negative'],
  ['negative zero', -0, 'Zero'],
  ['positive fraction', 0.5, 'Positive'],
  ['large negative', -100, 'Negative'],
  ['large positive', 100, 'Positive'],
  ['tiny positive', 1e-10, 'Positive'],
  ['tiny negative', -1e-10, 'Negative'],
];

test('Solution.positiveNegativeOrZeroApproach1', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.positiveNegativeOrZeroApproach1(num), expected);
    });
  }
});

test('Solution.positiveNegativeOrZeroApproach2', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.positiveNegativeOrZeroApproach2(num), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, num] of cases) {
    assert.equal(sol.positiveNegativeOrZeroApproach1(num), sol.positiveNegativeOrZeroApproach2(num));
  }
});
