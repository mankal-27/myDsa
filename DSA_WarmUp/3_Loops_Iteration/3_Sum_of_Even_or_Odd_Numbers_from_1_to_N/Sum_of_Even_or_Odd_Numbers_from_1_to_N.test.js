const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Sum_of_Even_or_Odd_Numbers_from_1_to_N.js');

const sol = new Solution();

// [description, n, type, expected]
const cases = [
  ['example 1', 10, 'even', 30],
  ['example 2', 10, 'odd', 25],
  ['example 3: n = 1, even', 1, 'even', 0],
  ['example 4: n = 1, odd', 1, 'odd', 1],
  ['n = 0, even', 0, 'even', 0],
  ['n = 0, odd', 0, 'odd', 0],
  ['odd n, even type', 7, 'even', 12],
  ['odd n, odd type', 7, 'odd', 16],
  ['larger n, even', 100, 'even', 2550],
  ['larger n, odd', 100, 'odd', 2500],
];

test('Solution.sumEvenOrOddApproach1', async (t) => {
  for (const [description, n, type, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumEvenOrOddApproach1(n, type), expected);
    });
  }
});

test('Solution.sumEvenOrOddApproach2', async (t) => {
  for (const [description, n, type, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumEvenOrOddApproach2(n, type), expected);
    });
  }
});

test('Solution.sumEvenOrOddBonusBitwise', async (t) => {
  for (const [description, n, type, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.sumEvenOrOddBonusBitwise(n, type), expected);
    });
  }
});

test('all three implementations agree on every case', () => {
  for (const [, n, type] of cases) {
    const a1 = sol.sumEvenOrOddApproach1(n, type);
    const a2 = sol.sumEvenOrOddApproach2(n, type);
    const bonus = sol.sumEvenOrOddBonusBitwise(n, type);
    assert.equal(a1, a2);
    assert.equal(a2, bonus);
  }
});
