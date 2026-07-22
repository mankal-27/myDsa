const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Digits_in_an_Integer.js');

const sol = new Solution();

// [description, num, expected]
const cases = [
  ['example 1', 12345, 5],
  ['example 2: zero', 0, 1],
  ['example 3: negative', -987, 3],
  ['example 4: single digit', 7, 1],
  ['exact power of ten: 10', 10, 2],
  ['exact power of ten: 100', 100, 3],
  ['exact power of ten: 1000 (floating-point trap case)', 1000, 4],
  ['exact power of ten: 10000', 10000, 5],
  ['exact power of ten: 100000', 100000, 6],
  ['exact power of ten: 1000000 (floating-point trap case)', 1000000, 7],
  ['just under a power of ten', 999999999, 9],
  ['negative single digit', -1, 1],
  ['negative exact power of ten', -10, 2],
];

test('Solution.countDigitsApproach1', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countDigitsApproach1(num), expected);
    });
  }
});

test('Solution.countDigitsApproach2', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countDigitsApproach2(num), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, num] of cases) {
    assert.equal(sol.countDigitsApproach1(num), sol.countDigitsApproach2(num));
  }
});
