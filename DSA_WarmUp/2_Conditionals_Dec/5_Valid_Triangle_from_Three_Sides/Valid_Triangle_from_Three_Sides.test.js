const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Valid_Triangle_from_Three_Sides.js');

const sol = new Solution();

// [description, a, b, c, expected]
const cases = [
  ['example 1: valid (3-4-5 right triangle)', 3, 4, 5, true],
  ['example 2: degenerate (sum equals third side)', 1, 2, 3, false],
  ['example 3: invalid (two sides too short)', 5, 1, 1, false],
  ['example 4: valid, sides unsorted as given', 7, 10, 5, true],
  ['equilateral triangle', 2, 2, 2, true],
  ['smallest possible equilateral', 1, 1, 1, true],
  ['very invalid (one side dominates)', 10, 1, 1, false],
  ['valid, larger sides', 6, 8, 10, true],
  ['fractional sides, degenerate', 0.5, 0.5, 1, false],
  ['fractional sides, valid', 2.5, 3.5, 5, true],
];

test('Solution.isValidTriangleApproach1', async (t) => {
  for (const [description, a, b, c, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isValidTriangleApproach1(a, b, c), expected);
    });
  }
});

test('Solution.isValidTriangleApproach2', async (t) => {
  for (const [description, a, b, c, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.isValidTriangleApproach2(a, b, c), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, a, b, c] of cases) {
    assert.equal(sol.isValidTriangleApproach1(a, b, c), sol.isValidTriangleApproach2(a, b, c));
  }
});
