const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Sum_of_First_N_Natural_Numbers.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['example 1', 5, 15],
  ['example 2: n = 0', 0, 0],
  ['example 3: n = 1', 1, 1],
  ['example 4: larger n', 100, 5050],
  ['negative n treated as 0', -5, 0],
  ['larger n for stack depth', 1000, 500500],
];

test('Solution.sumOfNApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfNApproach1(n), expected);
    });
  }
});

test('Solution.sumOfNApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfNApproach2(n), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, n] of cases) {
    assert.equal(sol.sumOfNApproach1(n), sol.sumOfNApproach2(n));
  }
});
