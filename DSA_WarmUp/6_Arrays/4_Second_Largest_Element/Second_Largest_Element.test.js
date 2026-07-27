const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Second_Largest_Element.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [3, 1, 4, 1, 5, 9, 2, 6], 6],
  ['example 2: duplicate largest', [10, 10, 9], 9],
  ['example 3: all identical, no second largest', [5, 5, 5], undefined],
  ['example 4: empty array', [], undefined],
  ['single element', [7], undefined],
  ['two distinct elements', [3, 7], 3],
  ['all negative', [-5, -1, -10], -5],
  ['ascending pair', [1, 2], 1],
  ['duplicates on both ranks', [2, 2, 3, 3], 2],
  ['floats', [1.5, 2.7, 2.6], 2.6],
  ['duplicate largest, three copies', [9, 9, 9, 8], 8],
];

test('Solution.secondLargestApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.secondLargestApproach1(arr), expected);
    });
  }
});

test('Solution.secondLargestApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.secondLargestApproach2(arr), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.equal(sol.secondLargestApproach1(arr), sol.secondLargestApproach2(arr));
  }
});
