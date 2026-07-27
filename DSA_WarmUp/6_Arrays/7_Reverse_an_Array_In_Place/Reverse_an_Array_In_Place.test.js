const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Reverse_an_Array_In_Place.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1: odd length', [1, 2, 3, 4, 5], [5, 4, 3, 2, 1]],
  ['example 2: even length', [1, 2, 3, 4], [4, 3, 2, 1]],
  ['example 3: empty array', [], []],
  ['example 4: single element', [7], [7]],
  ['two elements', [1, 2], [2, 1]],
  ['negatives and zero', [-3, -2, -1, 0, 1], [1, 0, -1, -2, -3]],
];

test('Solution.reverseArrayApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.reverseArrayApproach1([...arr]), expected);
    });
  }
});

test('Solution.reverseArrayApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.reverseArrayApproach2([...arr]), expected);
    });
  }
});

test('mutates the array in place (same reference is returned)', () => {
  const arr = [1, 2, 3];
  const result = sol.reverseArrayApproach2(arr);
  assert.strictEqual(result, arr);
  assert.deepEqual(arr, [3, 2, 1]);
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    const a = sol.reverseArrayApproach1([...arr]);
    const b = sol.reverseArrayApproach2([...arr]);
    assert.deepEqual(a, b);
  }
});
