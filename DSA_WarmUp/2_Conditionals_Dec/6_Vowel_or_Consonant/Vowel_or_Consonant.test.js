const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Vowel_or_Consonant.js');

const sol = new Solution();

// [description, ch, expected]
const cases = [
  ['example 1: lowercase vowel', 'a', 'Vowel'],
  ['example 2: lowercase consonant', 'b', 'Consonant'],
  ['example 3: uppercase vowel', 'E', 'Vowel'],
  ['example 4: lowercase consonant (end of alphabet)', 'z', 'Consonant'],
  ['uppercase vowel', 'U', 'Vowel'],
  ['consonant that looks vowel-adjacent', 'y', 'Consonant'],
  ['uppercase consonant', 'Q', 'Consonant'],
  ['lowercase consonant', 'm', 'Consonant'],
  ['all lowercase vowels', 'i', 'Vowel'],
  ['all lowercase vowels', 'o', 'Vowel'],
  ['all lowercase vowels', 'u', 'Vowel'],
  ['all uppercase vowels', 'I', 'Vowel'],
  ['all uppercase vowels', 'O', 'Vowel'],
];

test('Solution.vowelOrConsonantApproach1', async (t) => {
  for (const [description, ch, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.vowelOrConsonantApproach1(ch), expected);
    });
  }
});

test('Solution.vowelOrConsonantApproach2', async (t) => {
  for (const [description, ch, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.vowelOrConsonantApproach2(ch), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, ch] of cases) {
    assert.equal(sol.vowelOrConsonantApproach1(ch), sol.vowelOrConsonantApproach2(ch));
  }
});
