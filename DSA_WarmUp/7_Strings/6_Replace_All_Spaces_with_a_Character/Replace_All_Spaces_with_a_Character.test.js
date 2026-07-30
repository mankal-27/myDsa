const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Replace_All_Spaces_with_a_Character.js');

const sol = new Solution();

// [description, str, replacement, expected]
const cases = [
  ['example 1', 'Hello World', '%20', 'Hello%20World'],
  ['example 2: empty string', '', '-', ''],
  ['example 3: all spaces', '   ', '_', '___'],
  ['example 4: leading and trailing spaces', '  leading and trailing  ', '#', '##leading#and#trailing##'],
  ['no spaces to replace', 'NoSpacesHere', '*', 'NoSpacesHere'],
  ['empty replacement removes spaces entirely', 'a b c', '', 'abc'],
];

test('Solution.replaceSpacesApproach1', async (t) => {
  for (const [description, str, replacement, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.replaceSpacesApproach1(str, replacement), expected);
    });
  }
});

test('Solution.replaceSpacesApproach2', async (t) => {
  for (const [description, str, replacement, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.replaceSpacesApproach2(str, replacement), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str, replacement] of cases) {
    assert.equal(sol.replaceSpacesApproach1(str, replacement), sol.replaceSpacesApproach2(str, replacement));
  }
});
