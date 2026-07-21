const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Print_Numbers_from_1_to_N.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['example 1', 5, [1, 2, 3, 4, 5]],
  ['example 2: n = 1', 1, [1]],
  ['example 3: n = 0', 0, []],
  ['n = 3', 3, [1, 2, 3]],
  ['n = 10', 10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
  ['n = 2', 2, [1, 2]],
];

test('Solution.printNumbersApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.printNumbersApproach1(n), expected);
    });
  }
});

test('Solution.printNumbersApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.printNumbersApproach2(n), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, n] of cases) {
    assert.deepEqual(sol.printNumbersApproach1(n), sol.printNumbersApproach2(n));
  }
});
