const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Average_of_Array_Elements.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [1, 2, 3, 4, 5], 3],
  ['example 2: empty array', [], 0],
  ['example 3: all negative', [-1, -2, -3], -2],
  ['example 4: uneven division', [2, 3], 2.5],
  ['single element', [10], 10],
  ['floats', [1.5, 2.5, 3], 2.3333333333333335],
];

test('Solution.averageOfArrayApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.averageOfArrayApproach1(arr), expected);
    });
  }
});

test('Solution.averageOfArrayApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.averageOfArrayApproach2(arr), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.equal(sol.averageOfArrayApproach1(arr), sol.averageOfArrayApproach2(arr));
  }
});
