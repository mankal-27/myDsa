const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Sum_of_All_Divisors_of_a_Number.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['example 1', 6, 12],
  ['example 2', 28, 56],
  ['example 3: n = 1', 1, 1],
  ['example 4: prime', 7, 8],
  ['perfect square: 36', 36, 91],
  ['larger prime: 997', 997, 998],
  ['power of two: 12', 12, 28],
  ['n = 2', 2, 3],
  ['n = 100', 100, 217],
];

test('Solution.sumOfDivisorsApproachWithNoArrays', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfDivisorsApproachWithNoArrays(n), expected);
    });
  }
});

test('Solution.sumOfDivisorsApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfDivisorsApproach1(n), expected);
    });
  }
});

test('Solution.sumOfDivisorsApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfDivisorsApproach2(n), expected);
    });
  }
});

test('all three approaches agree on every case', () => {
  for (const [, n] of cases) {
    const a = sol.sumOfDivisorsApproachWithNoArrays(n);
    const b = sol.sumOfDivisorsApproach1(n);
    const c = sol.sumOfDivisorsApproach2(n);
    assert.equal(a, b);
    assert.equal(b, c);
  }
});
