const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Even_and_Odd_Numbers.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [1, 2, 3, 4, 5, 6], { even: 3, odd: 3 }],
  ['example 2: empty array', [], { even: 0, odd: 0 }],
  ['example 3: negatives and zero', [-3, -2, -1, 0], { even: 2, odd: 2 }],
  ['example 4: all even', [2, 4, 6], { even: 3, odd: 0 }],
  ['all odd', [1, 3, 5], { even: 0, odd: 3 }],
  ['single odd element', [7], { even: 0, odd: 1 }],
  ['zero alone counts as even', [0], { even: 1, odd: 0 }],
];

test('Solution.countEvenAndOddApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countEvenAndOddApproach1(arr), expected);
    });
  }
});

test('Solution.countEvenAndOddApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countEvenAndOddApproach2(arr), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.deepEqual(sol.countEvenAndOddApproach1(arr), sol.countEvenAndOddApproach2(arr));
  }
});
