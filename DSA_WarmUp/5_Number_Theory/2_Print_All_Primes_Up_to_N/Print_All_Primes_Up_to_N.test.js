const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Print_All_Primes_Up_to_N.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['negative number', -5, []],
  ['zero', 0, []],
  ['example 3: n = 1', 1, []],
  ['example 4: n = 2', 2, [2]],
  ['n = 3', 3, [2, 3]],
  ['example 1: n = 10', 10, [2, 3, 5, 7]],
  ['example 2: n = 20', 20, [2, 3, 5, 7, 11, 13, 17, 19]],
  ['n = 30', 30, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]],
  ['n = 50', 50, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]],
  [
    'n = 100',
    100,
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
  ],
];

test('Solution.printAllPrimesApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.printAllPrimesApproach1(n), expected);
    });
  }
});

test('Solution.printAllPrimesApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.printAllPrimesApproach2(n), expected);
    });
  }
});

test('both approaches agree up to n = 1000', () => {
  assert.deepEqual(sol.printAllPrimesApproach1(1000), sol.printAllPrimesApproach2(1000));
});
