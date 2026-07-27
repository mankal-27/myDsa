const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Sum_of_All_Elements.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [1, 2, 3, 4, 5], 15],
  ['example 2: empty array', [], 0],
  ['example 3: all negative', [-1, -2, -3], -6],
  ['example 4: single element', [10], 10],
  ['all zeros', [0, 0, 0], 0],
  ['floats', [1.5, 2.5, 3], 7],
  ['positives and negatives cancel out', [-5, 5], 0],
];

test('Solution.sumOfAllElementsApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfAllElementsApproach1(arr), expected);
    });
  }
});

test('Solution.sumOfAllElementsApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumOfAllElementsApproach2(arr), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.equal(sol.sumOfAllElementsApproach1(arr), sol.sumOfAllElementsApproach2(arr));
  }
});
