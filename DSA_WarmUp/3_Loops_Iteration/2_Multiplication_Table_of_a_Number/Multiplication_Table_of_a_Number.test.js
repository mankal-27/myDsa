const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Multiplication_Table_of_a_Number.js');

const sol = new Solution();

// [description, num, upTo, expected]
const cases = [
  ['example 1: default upTo', 5, undefined, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]],
  ['example 2: custom upTo', 3, 5, [3, 6, 9, 12, 15]],
  ['example 3: negative num', -4, 3, [-4, -8, -12]],
  ['zero', 0, 5, [0, 0, 0, 0, 0]],
  ['single entry', 1, 1, [1]],
  ['larger num, default upTo', 7, undefined, [7, 14, 21, 28, 35, 42, 49, 56, 63, 70]],
];

test('Solution.multiplicationTableApproach1', async (t) => {
  for (const [description, num, upTo, expected] of cases) {
    await t.test(description, () => {
      const actual = upTo === undefined
        ? sol.multiplicationTableApproach1(num)
        : sol.multiplicationTableApproach1(num, upTo);
      assert.deepEqual(actual, expected);
    });
  }
});

test('Solution.multiplicationTableApproach2', async (t) => {
  for (const [description, num, upTo, expected] of cases) {
    await t.test(description, () => {
      const actual = upTo === undefined
        ? sol.multiplicationTableApproach2(num)
        : sol.multiplicationTableApproach2(num, upTo);
      assert.deepEqual(actual, expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, num, upTo] of cases) {
    const a1 = upTo === undefined ? sol.multiplicationTableApproach1(num) : sol.multiplicationTableApproach1(num, upTo);
    const a2 = upTo === undefined ? sol.multiplicationTableApproach2(num) : sol.multiplicationTableApproach2(num, upTo);
    assert.deepEqual(a1, a2);
  }
});
