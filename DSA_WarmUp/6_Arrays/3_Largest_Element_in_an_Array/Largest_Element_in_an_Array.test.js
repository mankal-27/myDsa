const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Largest_Element_in_an_Array.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [3, 1, 4, 1, 5, 9, 2, 6], 9],
  ['example 2: empty array', [], undefined],
  ['example 3: all negative', [-5, -1, -10], -1],
  ['example 4: single element', [7], 7],
  ['all equal elements', [2, 2, 2], 2],
  ['floats', [1.5, 2.7, 2.6], 2.7],
  ['largest element at the start', [10, 3, 1], 10],
];

test('Solution.largestElementApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.largestElementApproach1(arr), expected);
    });
  }
});

test('Solution.largestElementApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.largestElementApproach2(arr), expected);
    });
  }
});

test('empty array returns actual undefined, not the string "undefined"', () => {
  assert.strictEqual(sol.largestElementApproach1([]), undefined);
  assert.strictEqual(sol.largestElementApproach2([]), undefined);
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.equal(sol.largestElementApproach1(arr), sol.largestElementApproach2(arr));
  }
});
