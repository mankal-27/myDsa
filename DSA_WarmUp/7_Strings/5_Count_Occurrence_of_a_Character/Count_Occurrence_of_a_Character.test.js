const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Count_Occurrence_of_a_Character.js');

const sol = new Solution();

// [description, str, target, expected]
const cases = [
  ['example 1', 'mississippi', 's', 4],
  ['example 2: different target, same string', 'mississippi', 'i', 4],
  ['example 3: empty string', '', 'a', 0],
  ['example 4: case-sensitive, not found', 'Hello', 'h', 0],
  ['all matching characters', 'aaaa', 'a', 4],
  ['target with a space between other words', 'hello world', 'o', 2],
  ['target not present', 'banana', 'z', 0],
];

test('Solution.countOccurrenceApproach1', async (t) => {
  for (const [description, str, target, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countOccurrenceApproach1(str, target), expected);
    });
  }
});

test('Solution.countOccurrenceApproach2', async (t) => {
  for (const [description, str, target, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.countOccurrenceApproach2(str, target), expected);
    });
  }
});

test('Solution.countOccurrenceBonusFrequencyMap (looked up by target)', async (t) => {
  for (const [description, str, target, expected] of cases) {
    await t.test(description, () => {
      const freq = sol.countOccurrenceBonusFrequencyMap(str);
      assert.equal(freq[target] || 0, expected);
    });
  }
});

test('frequency map matches a manually built map for a mixed string', () => {
  const freq = sol.countOccurrenceBonusFrequencyMap('mississippi');
  assert.deepEqual(freq, { m: 1, i: 4, s: 4, p: 2 });
});

test('all three approaches agree on every case', () => {
  for (const [, str, target] of cases) {
    const a = sol.countOccurrenceApproach1(str, target);
    const b = sol.countOccurrenceApproach2(str, target);
    const c = sol.countOccurrenceBonusFrequencyMap(str)[target] || 0;
    assert.equal(a, b);
    assert.equal(b, c);
  }
});
