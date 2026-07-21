const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Area_and_Perimeter_of_Shapes.js');

const sol = new Solution();

// [description, shape, dims, expected]
const cases = [
  ['example 1: rectangle', 'rectangle', [5, 3], [15, 16]],
  ['example 2: square', 'square', [4], [16, 16]],
  ['example 3: circle', 'circle', [7], [153.94, 43.98]],
  ['example 4: triangle (3-4-5 right triangle)', 'triangle', [3, 4, 5], [6, 12]],
  ['rectangle with decimals', 'rectangle', [10.5, 2.3], [24.15, 25.6]],
  ['unit circle', 'circle', [1], [3.14, 6.28]],
  ['scalene triangle', 'triangle', [7, 8, 9], [26.83, 24]],
  ['small square (fractional side)', 'square', [0.5], [0.25, 2]],
  ['equilateral triangle', 'triangle', [6, 6, 6], [15.59, 18]],
  ['large rectangle', 'rectangle', [100, 50], [5000, 300]],
];

test('Solution.areaAndPerimeterBruteForce', async (t) => {
  for (const [description, shape, dims, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.areaAndPerimeterBruteForce(shape, dims), expected);
    });
  }
});

test('Solution.areaAndPerimeterOptimized', async (t) => {
  for (const [description, shape, dims, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.areaAndPerimeterOptimized(shape, dims), expected);
    });
  }
});

test('brute force and optimized agree on every case', () => {
  for (const [, shape, dims] of cases) {
    assert.deepEqual(
      sol.areaAndPerimeterBruteForce(shape, dims),
      sol.areaAndPerimeterOptimized(shape, dims)
    );
  }
});

test('manual sqrt (Newton\'s method) matches Math.sqrt closely', () => {
  const approx = sol.sqrt(2);
  assert.ok(Math.abs(approx - Math.sqrt(2)) < 1e-9);
});
