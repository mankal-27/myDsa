const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Prime_Number_Check.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['negative number', -5, false],
  ['zero', 0, false],
  ['one: not prime by definition', 1, false],
  ['smallest prime, even prime', 2, true],
  ['smallest odd prime', 3, true],
  ['smallest composite', 4, false],
  ['example 1: prime', 7, true],
  ['even composite', 6, false],
  ['example 2: composite', 15, false],
  ['prime', 11, true],
  ['prime', 17, true],
  ['perfect square, composite', 25, false],
  ['prime', 29, true],
  ['larger prime', 97, true],
  ['perfect square of a prime-ish number, composite', 100, false],
  ['large prime', 997, true],
  ['large composite', 1000, false],
];

test('Solution.isPrimeApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPrimeApproach1(n), expected);
    });
  }
});

test('Solution.isPrimeApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isPrimeApproach2(n), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, n] of cases) {
    assert.equal(sol.isPrimeApproach1(n), sol.isPrimeApproach2(n));
  }
});
