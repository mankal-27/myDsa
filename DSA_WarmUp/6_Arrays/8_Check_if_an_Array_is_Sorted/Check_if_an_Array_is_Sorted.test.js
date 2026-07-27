const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Check_if_an_Array_is_Sorted.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1: sorted', [1, 2, 3, 4, 5], true],
  ['example 2: reverse sorted', [5, 4, 3, 2, 1], false],
  ['example 3: equal adjacent elements', [1, 1, 2, 3], true],
  ['example 4: broken by the last element', [1, 2, 2, 3, 1], false],
  ['empty array', [], true],
  ['single element', [7], true],
  ['negatives', [-3, -2, -1, 0], true],
  ['all identical', [1, 1, 1], true],
  ['two elements, sorted', [1, 2], true],
  ['two elements, unsorted', [2, 1], false],
];

test('Solution.isSortedApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isSortedApproach1(arr), expected);
    });
  }
});

test('Solution.isSortedApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isSortedApproach2(arr), expected);
    });
  }
});

test('Solution.isSortedBonusDivideConquer', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isSortedBonusDivideConquer(arr), expected);
    });
  }
});

test('divide and conquer handles a large sorted array', () => {
  const big = Array.from({ length: 100000 }, (_, i) => i);
  assert.equal(sol.isSortedBonusDivideConquer(big), true);
  big[50000] = -1;
  assert.equal(sol.isSortedBonusDivideConquer(big), false);
});

test('all three approaches agree on every case', () => {
  for (const [, arr] of cases) {
    const a = sol.isSortedApproach1(arr);
    const b = sol.isSortedApproach2(arr);
    const c = sol.isSortedBonusDivideConquer(arr);
    assert.equal(a, b);
    assert.equal(b, c);
  }
});
