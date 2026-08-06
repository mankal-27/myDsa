const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Plus_One.js');

const sol = new Solution();

// [description, digits, expected]
const cases = [
  ['example 1', [1, 2, 3], [1, 2, 4]],
  ['example 2', [4, 3, 2, 1], [4, 3, 2, 2]],
  ['example 3: single 9, carries into a new digit', [9], [1, 0]],
  ['example 4: all 9s, full carry chain', [9, 9, 9], [1, 0, 0, 0]],
  ['example 5: zero', [0], [1]],
  ['two 9s', [9, 9], [1, 0, 0]],
  ['leading digit not 9, trailing 9s', [1, 9, 9], [2, 0, 0]],
  ['carry stops partway through', [2, 9, 9, 9], [3, 0, 0, 0]],
  ['carry stops at the first digit', [8, 9, 9, 9, 9], [9, 0, 0, 0, 0]],
  ['no carry needed at all', [1, 2, 8], [1, 2, 9]],
  ['single non-9 digit', [5], [6]],
];

test('Solution.plusOneApproach1', async (t) => {
  for (const [description, digits, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.plusOneApproach1([...digits]), expected);
    });
  }
});

test('Solution.plusOneApproach2', async (t) => {
  for (const [description, digits, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.plusOneApproach2([...digits]), expected);
    });
  }
});

test('Solution.plusOneBonusRecursive', async (t) => {
  for (const [description, digits, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.plusOneBonusRecursive([...digits]), expected);
    });
  }
});

test('all three approaches agree on every case', () => {
  for (const [, digits] of cases) {
    const a1 = sol.plusOneApproach1([...digits]);
    assert.deepEqual(sol.plusOneApproach2([...digits]), a1);
    assert.deepEqual(sol.plusOneBonusRecursive([...digits]), a1);
  }
});
