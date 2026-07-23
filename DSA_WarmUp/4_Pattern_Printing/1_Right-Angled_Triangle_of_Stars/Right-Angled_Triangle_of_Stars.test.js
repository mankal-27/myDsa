const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Right-Angled_Triangle_of_Stars.js');

const sol = new Solution();

// [description, n, expected]
const cases = [
  ['example 3: n = 1', 1, ['*']],
  ['n = 2', 2, ['*', '**']],
  ['example 1: n = 3', 3, ['*', '**', '***']],
  ['example 2: n = 5', 5, ['*', '**', '***', '****', '*****']],
  ['larger n = 10', 10, ['*', '**', '***', '****', '*****', '******', '*******', '********', '*********', '**********']],
];

test('Solution.rightAngledTriangleApproach1', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.rightAngledTriangleApproach1(n), expected);
    });
  }
});

test('Solution.rightAngledTriangleApproach2', async (t) => {
  for (const [description, n, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.rightAngledTriangleApproach2(n), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, n] of cases) {
    assert.deepEqual(sol.rightAngledTriangleApproach1(n), sol.rightAngledTriangleApproach2(n));
  }
});
