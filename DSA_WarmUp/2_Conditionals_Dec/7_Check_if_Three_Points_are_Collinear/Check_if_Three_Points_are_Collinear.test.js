const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Check_if_Three_Points_are_Collinear.js');

const sol = new Solution();

// [description, x1, y1, x2, y2, x3, y3, expected]
const cases = [
  ['example 1: diagonal line y = x', 1, 1, 2, 2, 3, 3, true],
  ['example 2: not collinear', 1, 1, 2, 2, 3, 4, false],
  ['example 3: vertical line', 0, 0, 0, 5, 0, 10, true],
  ['example 4: not collinear (near-vertical)', 0, 0, 0, 5, 1, 10, false],
  ['horizontal line', 1, 2, 3, 2, 5, 2, true],
  ['diagonal through origin', 0, 0, 1, 1, 2, 2, true],
  ['diagonal, different slope value but still linear', 0, 0, 1, 2, 2, 4, true],
  ['negative coordinates, collinear', -1, -1, 0, 0, 1, 1, true],
  ['all three points identical', 1, 1, 1, 1, 1, 1, true],
  ['P1 and P2 identical, P3 different', 2, 3, 2, 3, 5, 7, true],
  ['clearly not collinear', 0, 0, 2, 4, 3, 5, false],
  ['P2 and P3 identical', 1, 1, 2, 2, 2, 2, true],
  ['P1 and P3 identical', 5, 5, 1, 2, 5, 5, true],
];

test('Solution.areCollinearApproach1', async (t) => {
  for (const [description, x1, y1, x2, y2, x3, y3, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.areCollinearApproach1(x1, y1, x2, y2, x3, y3), expected);
    });
  }
});

test('Solution.areCollinearApproach2', async (t) => {
  for (const [description, x1, y1, x2, y2, x3, y3, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.areCollinearApproach2(x1, y1, x2, y2, x3, y3), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, x1, y1, x2, y2, x3, y3] of cases) {
    assert.equal(
      sol.areCollinearApproach1(x1, y1, x2, y2, x3, y3),
      sol.areCollinearApproach2(x1, y1, x2, y2, x3, y3)
    );
  }
});
