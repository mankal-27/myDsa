const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Frequency_of_Each_Element.js');

const sol = new Solution();

// [description, arr, expected]
const cases = [
  ['example 1', [1, 2, 2, 3, 3, 3], { 1: 1, 2: 2, 3: 3 }],
  ['example 2: empty array', [], {}],
  ['example 3: negatives', [-1, -1, 2, 2, 2], { '-1': 2, 2: 3 }],
  ['example 4: all identical', [4, 4, 4, 4], { 4: 4 }],
  ['single element', [7], { 7: 1 }],
  ['all distinct', [1, 2, 3], { 1: 1, 2: 1, 3: 1 }],
];

test('Solution.countFrequencyApproach1', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countFrequencyApproach1(arr), expected);
    });
  }
});

test('Solution.countFrequencyApproach2', async (t) => {
  for (const [description, arr, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countFrequencyApproach2(arr), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, arr] of cases) {
    assert.deepEqual(sol.countFrequencyApproach1(arr), sol.countFrequencyApproach2(arr));
  }
});
