const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Palindrome_Number.js');

const sol = new Solution();

// [description, x, expected]
const cases = [
  ['example 1', 121, true],
  ['example 2: negative number', -121, false],
  ['example 3: trailing zero', 10, false],
  ['example 4: zero', 0, true],
  ['example 5: larger palindrome', 12321, true],
  ['single digit', 7, true],
  ['single digit zero-adjacent', 9, true],
  ['two equal digits', 11, true],
  ['two different digits', 22, true],
  ['not a palindrome', 123, false],
  ['non-palindrome with repeated digit', 1000021, false],
  ['odd digit count palindrome', 909, true],
  ['negative single digit', -1, false],
  ['negative with trailing digit match', -101, false],
  ['trailing zero, larger', 100, false],
  ['trailing zero, exactly 20', 20, false],
  ['long palindrome', 1000000001, true],
  ['32-bit min (negative)', -2147483648, false],
  ['32-bit max (not a palindrome)', 2147483647, false],
  ['power of ten (not a palindrome)', 1000000000, false],
];

test('Solution.isPalindromeApproach1', async (t) => {
  for (const [description, x, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPalindromeApproach1(x), expected);
    });
  }
});

test('Solution.isPalindromeApproach2', async (t) => {
  for (const [description, x, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPalindromeApproach2(x), expected);
    });
  }
});

test('Solution.isPalindromeApproach3', async (t) => {
  for (const [description, x, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPalindromeApproach3(x), expected);
    });
  }
});

test('all three approaches agree on every case', () => {
  for (const [, x] of cases) {
    const a1 = sol.isPalindromeApproach1(x);
    assert.equal(sol.isPalindromeApproach2(x), a1);
    assert.equal(sol.isPalindromeApproach3(x), a1);
  }
});
