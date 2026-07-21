const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Simple_and_Compound_Interest.js');

const sol = new Solution();

// [description, principal, rate, time, expected]
const simpleInterestCases = [
  ['basic case', 1000, 5, 2, 100],
  ['1 year matches CI at n=1', 1000, 5, 1, 50],
  ['larger principal/time', 5000, 10, 3, 1500],
  ['zero rate', 2000, 0, 5, 0],
  ['zero time', 2000, 5, 0, 0],
  ['fractional rate', 1200, 7.5, 2, 180],
  ['rounds correctly at .5 boundary (not floor)', 100, 6.005, 1, 6.01],
];

// [description, principal, rate, time, compoundsPerYear, expected]
const compoundInterestCases = [
  ['basic case, annual compounding', 1000, 5, 2, 1, 102.5],
  ['1 year equals simple interest', 1000, 5, 1, 1, 50],
  ['quarterly compounding', 1000, 8, 1, 4, 82.43],
  ['larger principal/time, annual', 5000, 10, 3, 1, 1655],
  ['zero rate', 2000, 0, 5, 1, 0],
  ['zero time', 2000, 5, 0, 1, 0],
  ['monthly compounding', 1500, 6, 2, 12, 190.74],
  ['default compoundsPerYear (annual)', 1000, 5, 2, undefined, 102.5],
];

test('Solution.simpleInterest (optimized)', async (t) => {
  for (const [description, principal, rate, time, expected] of simpleInterestCases) {
    await t.test(description, () => {
      assert.equal(sol.simpleInterest(principal, rate, time), expected);
    });
  }
});

test('Solution.simpleInterestBruteForce', async (t) => {
  // brute force loop only supports whole-number time, so skip the fractional/.5-boundary case
  const wholeYearCases = simpleInterestCases.filter(([, , , time]) => Number.isInteger(time));
  for (const [description, principal, rate, time, expected] of wholeYearCases) {
    await t.test(description, () => {
      assert.equal(sol.simpleInterestBruteForce(principal, rate, time), expected);
    });
  }
});

test('Solution.compoundInterest (optimized)', async (t) => {
  for (const [description, principal, rate, time, compoundsPerYear, expected] of compoundInterestCases) {
    await t.test(description, () => {
      const actual = compoundsPerYear === undefined
        ? sol.compoundInterest(principal, rate, time)
        : sol.compoundInterest(principal, rate, time, compoundsPerYear);
      assert.equal(actual, expected);
    });
  }
});

test('Solution.compoundInterestBruteForce', async (t) => {
  for (const [description, principal, rate, time, compoundsPerYear, expected] of compoundInterestCases) {
    await t.test(description, () => {
      const actual = compoundsPerYear === undefined
        ? sol.compoundInterestBruteForce(principal, rate, time)
        : sol.compoundInterestBruteForce(principal, rate, time, compoundsPerYear);
      assert.equal(actual, expected);
    });
  }
});

test('Solution.compoundInterestFastPower', async (t) => {
  for (const [description, principal, rate, time, compoundsPerYear, expected] of compoundInterestCases) {
    await t.test(description, () => {
      const actual = compoundsPerYear === undefined
        ? sol.compoundInterestFastPower(principal, rate, time)
        : sol.compoundInterestFastPower(principal, rate, time, compoundsPerYear);
      assert.equal(actual, expected);
    });
  }
});

test('all three compound interest implementations agree with each other', () => {
  const inputs = [1000, 7, 5, 2];
  const optimized = sol.compoundInterest(...inputs);
  const brute = sol.compoundInterestBruteForce(...inputs);
  const fastPower = sol.compoundInterestFastPower(...inputs);
  assert.equal(optimized, brute);
  assert.equal(optimized, fastPower);
});

test('Solution.solve returns both results together', () => {
  const result = sol.solve(1000, 5, 2);
  assert.deepEqual(result, { simpleInterest: 100, compoundInterest: 102.5 });
});

test('CI is always >= SI for the same inputs and time > 1 (compounding accelerates growth)', () => {
  const si = sol.simpleInterest(1000, 6, 5);
  const ci = sol.compoundInterest(1000, 6, 5, 1);
  assert.ok(ci > si);
});
