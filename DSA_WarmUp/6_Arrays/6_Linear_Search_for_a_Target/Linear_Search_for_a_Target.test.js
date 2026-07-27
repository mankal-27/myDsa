const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Linear_Search_for_a_Target.js');

const sol = new Solution();

// [description, arr, target, expected]
const cases = [
  ['example 1', [3, 1, 4, 1, 5, 9, 2, 6], 5, 4],
  ['example 2: first occurrence of a duplicate', [3, 1, 4, 1, 5, 9, 2, 6], 1, 1],
  ['example 3: not present', [3, 1, 4, 1, 5, 9, 2, 6], 100, -1],
  ['example 4: empty array', [], 1, -1],
  ['single element, present', [7], 7, 0],
  ['single element, absent', [7], 100, -1],
  ['negative numbers', [-3, -2, -1], -2, 1],
  ['target at the last index', [1, 2, 3], 3, 2],
];

test('Solution.linearSearchApproach1', async (t) => {
  for (const [description, arr, target, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.linearSearchApproach1(arr, target), expected);
    });
  }
});

test('Solution.linearSearchApproach2', async (t) => {
  for (const [description, arr, target, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.linearSearchApproach2(arr, target), expected);
    });
  }
});

test('Solution.linearSearchBonusSentinel', async (t) => {
  for (const [description, arr, target, expected] of cases) {
    await t.test(description, () => {
      const copy = [...arr];
      assert.equal(sol.linearSearchBonusSentinel(copy, target), expected);
    });
  }
});

test('sentinel search restores the array to its original state', () => {
  for (const [, arr, target] of cases) {
    const original = [...arr];
    const copy = [...arr];
    sol.linearSearchBonusSentinel(copy, target);
    assert.deepEqual(copy, original);
  }
});

test('all three approaches agree on every case', () => {
  for (const [, arr, target] of cases) {
    const copy = [...arr];
    const a = sol.linearSearchApproach1(arr, target);
    const b = sol.linearSearchApproach2(arr, target);
    const c = sol.linearSearchBonusSentinel(copy, target);
    assert.equal(a, b);
    assert.equal(b, c);
  }
});
