const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Words_in_a_Sentence.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1', 'Hello World', 2],
  ['example 2: empty string', '', 0],
  ['example 3: only spaces', '   ', 0],
  ['example 4: leading, trailing, and repeated spaces', '  Hello   World  ', 2],
  ['single word', 'Hello', 1],
  ['multiple words', 'one two three four', 4],
];

test('Solution.countWordsApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countWordsApproach1(str), expected);
    });
  }
});

test('Solution.countWordsApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countWordsApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.equal(sol.countWordsApproach1(str), sol.countWordsApproach2(str));
  }
});
