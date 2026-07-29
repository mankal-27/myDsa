const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Palindrome_String_Check.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1: odd-length palindrome', 'racecar', true],
  ['example 2: not a palindrome', 'hello', false],
  ['example 3: empty string', '', true],
  ['example 4: case-sensitive mismatch', 'Aa', false],
  ['single character', 'a', true],
  ['even-length palindrome', 'noon', true],
  ['odd-length palindrome with distinct middle', 'abcba', true],
  ['even-length palindrome with repeated middle', 'abccba', true],
  ['two distinct characters', 'ab', false],
];

test('Solution.isPalindromeApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPalindromeApproach1(str), expected);
    });
  }
});

test('Solution.isPalindromeApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPalindromeApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.equal(sol.isPalindromeApproach1(str), sol.isPalindromeApproach2(str));
  }
});
