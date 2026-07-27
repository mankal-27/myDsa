const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Vowels_and_Consonants.js');

const sol = new Solution();

// [description, str, expected]
const cases = [
  ['example 1', 'Hello World', { vowels: 3, consonants: 7 }],
  ['example 2: empty string', '', { vowels: 0, consonants: 0 }],
  ['example 3: digits, space, and punctuation ignored', 'DSA 123!', { vowels: 1, consonants: 2 }],
  ['example 4: all vowels, both cases', 'aeiouAEIOU', { vowels: 10, consonants: 0 }],
  ['all consonants', 'xyz', { vowels: 0, consonants: 3 }],
  ['only spaces', '  ', { vowels: 0, consonants: 0 }],
];

test('Solution.countVowelsAndConsonantsApproach1', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countVowelsAndConsonantsApproach1(str), expected);
    });
  }
});

test('Solution.countVowelsAndConsonantsApproach2', async (t) => {
  for (const [description, str, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.countVowelsAndConsonantsApproach2(str), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, str] of cases) {
    assert.deepEqual(sol.countVowelsAndConsonantsApproach1(str), sol.countVowelsAndConsonantsApproach2(str));
  }
});
