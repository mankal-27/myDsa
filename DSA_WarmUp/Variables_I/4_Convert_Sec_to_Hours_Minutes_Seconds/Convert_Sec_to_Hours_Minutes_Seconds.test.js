const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Convert_Sec_to_Hours_Minutes_Seconds.js');

const sol = new Solution();

// [description, totalSeconds, expected]
const cases = [
  ['example 1', 3661, [1, 1, 1]],
  ['example 2', 86399, [23, 59, 59]],
  ['zero seconds', 0, [0, 0, 0]],
  ['just under a minute', 59, [0, 0, 59]],
  ['exactly one minute', 60, [0, 1, 0]],
  ['one minute and one second', 61, [0, 1, 1]],
  ['just under an hour', 3599, [0, 59, 59]],
  ['exactly one hour', 3600, [1, 0, 0]],
  ['one hour, one minute, zero seconds', 3660, [1, 1, 0]],
  ['multi-digit breakdown', 7325, [2, 2, 5]],
];

test('Solution.convertSecondsBruteForce', async (t) => {
  for (const [description, totalSeconds, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.convertSecondsBruteForce(totalSeconds), expected);
    });
  }
});

test('Solution.convertSecondsOptimized', async (t) => {
  for (const [description, totalSeconds, expected] of cases) {
    await t.test(description, () => {
      assert.deepEqual(sol.convertSecondsOptimized(totalSeconds), expected);
    });
  }
});

test('brute force and optimized agree on every case', () => {
  for (const [, totalSeconds] of cases) {
    assert.deepEqual(
      sol.convertSecondsBruteForce(totalSeconds),
      sol.convertSecondsOptimized(totalSeconds)
    );
  }
});
