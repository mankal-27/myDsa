const test = require('node:test');
const assert = require('node:assert/strict');
const { gcd, gcdRecursive, lcm, extendedGcd, gcdArray } = require('./gcdlcm.js');

// [description, a, b, expected]
const gcdCases = [
  ['example: gcd(48, 18)', 48, 18, 6],
  ['one operand is 0', 0, 5, 5],
  ['other operand is 0', 5, 0, 5],
  ['coprime numbers', 7, 13, 1],
  ['equal numbers', 17, 17, 17],
  ['both zero', 0, 0, 0],
  ['negative first operand', -12, 18, 6],
  ['negative second operand', 12, -18, 6],
  ['both negative', -12, -18, 6],
];

test('gcd (iterative)', async (t) => {
  for (const [description, a, b, expected] of gcdCases) {
    await t.test(description, () => {
      assert.equal(gcd(a, b), expected);
    });
  }
});

test('gcdRecursive', async (t) => {
  for (const [description, a, b, expected] of gcdCases) {
    await t.test(description, () => {
      assert.equal(gcdRecursive(a, b), expected);
    });
  }

  await t.test('does not stack-overflow when b reaches 0 before matching a (regression)', () => {
    assert.doesNotThrow(() => gcdRecursive(6, 0));
    assert.doesNotThrow(() => gcdRecursive(48, 18));
  });

  await t.test('agrees with the iterative version on every case', () => {
    for (const [, a, b] of gcdCases) {
      assert.equal(gcdRecursive(a, b), gcd(a, b));
    }
  });
});

// [description, a, b, expected]
const lcmCases = [
  ['example: lcm(4, 6)', 4, 6, 12],
  ['lcm(21, 6)', 21, 6, 42],
  ['one operand is 0', 0, 5, 0],
  ['coprime numbers', 7, 13, 91],
  ['equal numbers', 9, 9, 9],
];

test('lcm', async (t) => {
  for (const [description, a, b, expected] of lcmCases) {
    await t.test(description, () => {
      assert.equal(lcm(a, b), expected);
    });
  }
});

test('gcdArray', async (t) => {
  await t.test('gcd across a full array', () => {
    assert.equal(gcdArray([12, 18, 24]), 6);
  });

  await t.test('single-element array returns that element', () => {
    assert.equal(gcdArray([7]), 7);
  });

  await t.test('array with a coprime pair collapses to 1', () => {
    assert.equal(gcdArray([8, 9, 100]), 1);
  });
});

function bezoutHolds(a, b) {
  const { gcd: g, x, y } = extendedGcd(a, b);
  return a * x + b * y === g;
}

// [description, a, b]
const extendedGcdCases = [
  ['example: extendedGcd(35, 15)', 35, 15],
  ['extendedGcd(240, 46)', 240, 46],
  ['extendedGcd(48, 18)', 48, 18],
  ['coprime pair', 17, 5],
  ['equal numbers', 1, 1],
  ['b is 0 (base case)', 100, 0],
  ['a is 0', 0, 7],
];

test('extendedGcd', async (t) => {
  for (const [description, a, b] of extendedGcdCases) {
    await t.test(`${description} -- satisfies Bezout's identity (a*x + b*y === gcd)`, () => {
      assert.ok(bezoutHolds(a, b), `expected a*x + b*y === gcd for extendedGcd(${a}, ${b})`);
    });
  }

  await t.test('gcd component matches the plain gcd function', () => {
    for (const [, a, b] of extendedGcdCases) {
      assert.equal(extendedGcd(a, b).gcd, gcd(a, b));
    }
  });
});
