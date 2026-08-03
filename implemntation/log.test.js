const test = require('node:test');
const assert = require('node:assert/strict');
const { floorLog2, countDigits, countBits } = require('./log.js');

// [description, n, expected]
const floorLog2Cases = [
  ['n = 1 (base case, 0 divisions needed)', 1, 0],
  ['n = 2 (exact power of two)', 2, 1],
  ['n = 7 (just below 8)', 7, 2],
  ['n = 8 (exact power of two)', 8, 3],
  ['n = 9 (just above 8)', 9, 3],
  ['n = 16', 16, 4],
  ['n = 100 (not a power of two)', 100, 6],
  ['n = 1023 (just below 1024)', 1023, 9],
  ['n = 1024', 1024, 10],
];

test('floorLog2', async (t) => {
  for (const [description, n, expected] of floorLog2Cases) {
    await t.test(description, () => {
      assert.equal(floorLog2(n), expected);
    });
  }

  await t.test('throws on n = 0', () => {
    assert.throws(() => floorLog2(0));
  });

  await t.test('throws on negative n', () => {
    assert.throws(() => floorLog2(-5));
  });
});

const countDigitsCases = [
  ['single digit', 1, 1],
  ['single digit, 9', 9, 1],
  ['two digits, boundary', 10, 2],
  ['example: 5000', 5000, 4],
  ['just below a power of ten', 999999, 6],
  ['exact power of ten', 1000000, 7],
];

test('countDigits', async (t) => {
  for (const [description, n, expected] of countDigitsCases) {
    await t.test(description, () => {
      assert.equal(countDigits(n), expected);
    });
  }

  await t.test('throws on n = 0', () => {
    assert.throws(() => countDigits(0));
  });

  await t.test('throws on negative n', () => {
    assert.throws(() => countDigits(-3));
  });
});

const countBitsCases = [
  ['n = 1', 1, 1],
  ['n = 2', 2, 2],
  ['example: 13 (binary 1101)', 13, 4],
  ['n = 16 (binary 10000)', 16, 5],
  ['n = 255 (binary 11111111)', 255, 8],
  ['n = 256 (binary 100000000)', 256, 9],
];

test('countBits', async (t) => {
  for (const [description, n, expected] of countBitsCases) {
    await t.test(description, () => {
      assert.equal(countBits(n), expected);
    });
  }

  await t.test('is consistent with floorLog2 (countBits = floorLog2 + 1)', () => {
    for (const n of [1, 2, 13, 16, 255, 256, 1023, 1024]) {
      assert.equal(countBits(n), floorLog2(n) + 1);
    }
  });

  await t.test('throws on n = 0', () => {
    assert.throws(() => countBits(0));
  });
});
