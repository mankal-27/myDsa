const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Even_or_Odd.js');

const sol = new Solution();

// [description, num, expected]
const cases = [
  ['example 1: positive even', 4, 'Even'],
  ['example 2: positive odd', 7, 'Odd'],
  ['example 3: zero', 0, 'Even'],
  ['example 4: negative odd', -3, 'Odd'],
  ['negative even', -4, 'Even'],
  ['negative one', -1, 'Odd'],
  ['small even', 2, 'Even'],
  ['large even', 100, 'Even'],
  ['large negative even', -100, 'Even'],
];

test('Solution.evenOrOddBruteForce (modulo)', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.evenOrOddBruteForce(num), expected);
    });
  }
});

test('Solution.evenOrOddOptimized (bitwise AND)', async (t) => {
  for (const [description, num, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.evenOrOddOptimized(num), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, num] of cases) {
    assert.equal(sol.evenOrOddBruteForce(num), sol.evenOrOddOptimized(num));
  }
});
