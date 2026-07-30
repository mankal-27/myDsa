const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Find_the_Longest_Word_in_a_Sentence.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1', 'The quick brown fox jumps', 'quick'],
  ['example 2: empty string', '', ''],
  ['example 3: leading, trailing, and repeated spaces', '  a bb ccc  dddd ', 'dddd'],
  ['example 4: tie - first longest wins', 'same size aaa bbb', 'same'],
  ['only spaces', '   ', ''],
  ['single word', 'hello', 'hello'],
  ['no tie, longest in the middle', 'I love programming in JavaScript', 'programming'],
];

test('Solution.findLongestWordApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.findLongestWordApproach1(str), expected);
    });
  }
});

test('Solution.findLongestWordApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.findLongestWordApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.equal(sol.findLongestWordApproach1(str), sol.findLongestWordApproach2(str));
  }
});
