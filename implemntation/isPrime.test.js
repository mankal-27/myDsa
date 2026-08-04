const test = require('node:test');
const assert = require('node:assert/strict');
const { isPrime, countPrimes, buildSPF, factorize } = require('./isPrime.js');

function refIsPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// [description, n, expected]
const isPrimeCases = [
  ['n = 0 is not prime', 0, false],
  ['n = 1 is not prime', 1, false],
  ['n = 2 is prime (smallest prime)', 2, true],
  ['n = 3 is prime', 3, true],
  ['n = 4 is not prime (even, > 2)', 4, false],
  ['n = 9 is not prime (3 x 3)', 9, false],
  ['n = 17 is prime', 17, true],
  ['n = 49 is not prime (7 x 7)', 49, false],
  ['n = 97 is prime', 97, true],
];

test('isPrime', async (t) => {
  for (const [description, n, expected] of isPrimeCases) {
    await t.test(description, () => {
      assert.equal(isPrime(n), expected);
    });
  }

  await t.test('matches a known-correct reference for every n from 0 to 200', () => {
    for (let n = 0; n <= 200; n++) {
      assert.equal(isPrime(n), refIsPrime(n), `mismatch at n=${n}`);
    }
  });
});

function refCountPrimes(n) {
  let count = 0;
  for (let i = 2; i < n; i++) if (refIsPrime(i)) count++;
  return count;
}

// [description, n, expected]
const countPrimesCases = [
  ['n = 0 -- no primes below 0', 0, 0],
  ['n = 1 -- no primes below 1', 1, 0],
  ['n = 2 -- no primes strictly less than 2', 2, 0],
  ['n = 3 -- only 2 qualifies', 3, 1],
  ['n = 10', 10, 4],
  ['n = 30', 30, 10],
  ['n = 100', 100, 25],
  ['n = 1000', 1000, 168],
];

test('countPrimes', async (t) => {
  for (const [description, n, expected] of countPrimesCases) {
    await t.test(description, () => {
      assert.equal(countPrimes(n), expected);
    });
  }

  await t.test('does not throw (regression: local sieve array shadowed the isPrime function)', () => {
    assert.doesNotThrow(() => countPrimes(50));
  });
});

test('buildSPF + factorize', async (t) => {
  const spf = buildSPF(1000);

  await t.test('spf of a prime is itself', () => {
    assert.equal(spf[97], 97);
    assert.equal(spf[2], 2);
  });

  await t.test('spf of a composite is its smallest prime factor', () => {
    assert.equal(spf[84], 2);
    assert.equal(spf[9], 3);
    assert.equal(spf[35], 5);
  });

  // [description, x, expectedFactors]
  const factorizeCases = [
    ['prime input', 2, [2]],
    ['power of a prime', 4, [2, 2]],
    ['example: 84 = 2^2 * 3 * 7', 84, [2, 2, 3, 7]],
    ['example: 360 = 2^3 * 3^2 * 5', 360, [2, 2, 2, 3, 3, 5]],
    ['large prime', 997, [997]],
    ['power of ten', 1000, [2, 2, 2, 5, 5, 5]],
  ];

  for (const [description, x, expected] of factorizeCases) {
    await t.test(description, () => {
      assert.deepEqual(factorize(x, spf), expected);
    });
  }

  await t.test('does not throw (regression: spf(x) called as a function instead of spf[x] indexing)', () => {
    assert.doesNotThrow(() => factorize(360, spf));
  });

  await t.test('every factorization multiplies back to the original number', () => {
    for (const [, x] of factorizeCases) {
      const product = factorize(x, spf).reduce((acc, f) => acc * f, 1);
      assert.equal(product, x);
    }
  });
});
