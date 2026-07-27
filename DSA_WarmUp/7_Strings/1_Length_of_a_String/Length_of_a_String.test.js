const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Length_of_a_String.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1', 'hello', 5],
  ['example 2: empty string', '', 0],
  ['example 3: single character', 'a', 1],
  ['example 4: spaces count as characters', 'DSA patterns', 12],
  ['leading and trailing spaces', '  spaced  ', 10],
  ['digits as characters', '12345', 5],
];

test('Solution.lengthOfStringApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.lengthOfStringApproach1(str), expected);
    });
  }
});

test('Solution.lengthOfStringApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.lengthOfStringApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.equal(sol.lengthOfStringApproach1(str), sol.lengthOfStringApproach2(str));
  }
});
