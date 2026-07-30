const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Toggle_Case_of_Every_Character.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1', 'Hello World', 'hELLO wORLD'],
  ['example 2: empty string', '', ''],
  ['example 3: alternating case', 'AbCdEf', 'aBcDeF'],
  ['example 4: digits and punctuation untouched', 'Mixed123!@#', 'mIXED123!@#'],
  ['digits only', '12345', '12345'],
  ['all lowercase', 'already lower', 'ALREADY LOWER'],
  ['all uppercase', 'ALLCAPS', 'allcaps'],
];

test('Solution.toggleCaseApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.toggleCaseApproach1(str), expected);
    });
  }
});

test('Solution.toggleCaseApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.toggleCaseApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.equal(sol.toggleCaseApproach1(str), sol.toggleCaseApproach2(str));
  }
});
