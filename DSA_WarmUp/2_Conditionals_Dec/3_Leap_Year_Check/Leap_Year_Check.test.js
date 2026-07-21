const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Leap_Year_Check.js');

const sol = new Solution();

// [description, year, expected]
const cases = [
  ['example 1: divisible by 4, not a century year', 2024, true],
  ['example 2: century year, not divisible by 400', 1900, false],
  ['example 3: century year, divisible by 400', 2000, true],
  ['example 4: not divisible by 4', 2023, false],
  ['century year, not divisible by 400', 2100, false],
  ['century year, divisible by 400', 1600, true],
  ['century year, divisible by 400', 2400, true],
  ['year zero', 0, true],
  ['negative year, divisible by 4', -4, true],
  ['negative century year, not divisible by 400', -100, false],
  ['exactly 4', 4, true],
  ['exactly 100', 100, false],
  ['exactly 400', 400, true],
];

test('Solution.isDivisibleBruteForce', async (t) => {
  await t.test('12 is divisible by 4', () => {
    assert.equal(sol.isDivisibleBruteForce(12, 4), true);
  });
  await t.test('13 is not divisible by 4', () => {
    assert.equal(sol.isDivisibleBruteForce(13, 4), false);
  });
  await t.test('0 is divisible by any divisor', () => {
    assert.equal(sol.isDivisibleBruteForce(0, 7), true);
  });
});

test('Solution.isLeapYearBruteForce', async (t) => {
  for (const [description, year, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isLeapYearBruteForce(year), expected);
    });
  }
});

test('Solution.isLeapYearOptimized', async (t) => {
  for (const [description, year, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isLeapYearOptimized(year), expected);
    });
  }
});

test('brute force and optimized agree on every case', () => {
  for (const [, year] of cases) {
    assert.equal(sol.isLeapYearBruteForce(year), sol.isLeapYearOptimized(year));
  }
});
