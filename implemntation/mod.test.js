const test = require('node:test');
const assert = require('node:assert/strict');
const { MOD, power, modInverse, modSubstract } = require('./mod.js');

// [description, base, exp, mod, expected] -- all BigInt
const powerCases = [
  ['small base/exp/mod', 2n, 10n, 1000n, 24n],
  ['matches manual trace: 7^500 mod 13', 7n, 500n, 13n, 3n],
  ['large exponent under MOD (10^9 + 7)', 3n, 1000n, MOD, 56888193n],
  ['exp = 0 is always 1 (identity)', 5n, 0n, 7n, 1n],
  ['base = 0 with positive exp is 0', 0n, 5n, 7n, 0n],
  ['base = 0, exp = 0 is 1 by convention', 0n, 0n, 7n, 1n],
  ['base = 1 stays 1 regardless of exponent', 1n, 999999n, 13n, 1n],
];

test('power (modular exponentiation)', async (t) => {
  for (const [description, base, exp, mod, expected] of powerCases) {
    await t.test(description, () => {
      assert.equal(power(base, exp, mod), expected);
    });
  }
});

test('modInverse', async (t) => {
  await t.test('a * modInverse(a) === 1 (mod MOD), for MOD prime', () => {
    for (const a of [5n, 2n, 123456n, 999999937n]) {
      const inv = modInverse(a, MOD);
      assert.equal((a * inv) % MOD, 1n);
    }
  });

  await t.test('works for a small prime modulus too', () => {
    const inv = modInverse(2n, 13n);
    assert.equal((2n * inv) % 13n, 1n);
  });

  await t.test('modInverse(0, mod) has no true inverse -- documents current behavior (returns 0)', () => {
    assert.equal(modInverse(0n, MOD), 0n);
  });
});

// [description, a, b, mod, expected]
const modSubstractCases = [
  ['result goes negative before wrapping: (3-8+5)%5', 3n, 8n, 5n, 0n],
  ['result already non-negative: (10-3)%7', 10n, 3n, 7n, 0n],
  ['result goes negative, wraps to 4: (1-2+5)%5', 1n, 2n, 5n, 4n],
  ['zero minus zero', 0n, 0n, 5n, 0n],
  ['larger values still reduced correctly', 100n, 1n, 7n, 1n],
];

test('modSubstract', async (t) => {
  for (const [description, a, b, mod, expected] of modSubstractCases) {
    await t.test(description, () => {
      assert.equal(modSubstract(a, b, mod), expected);
    });
  }

  await t.test('never returns a negative BigInt', () => {
    for (const [a, b, mod] of [[0n, 1n, 5n], [2n, 100n, 7n], [1n, 1000000n, 11n]]) {
      assert.ok(modSubstract(a, b, mod) >= 0n);
    }
  });
});
