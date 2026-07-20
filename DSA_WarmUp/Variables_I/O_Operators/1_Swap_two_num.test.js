const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./1_Swap_two_num.js');

const sol = new Solution();

// Methods under test, mapped by name -> function reference
const methods = {
  swap: sol.swap.bind(sol),
  swapTwoNumWithTemp: sol.swapTwoNumWithTemp.bind(sol),
  swapTwoNumWithSum: sol.swapTwoNumWithSum.bind(sol),
  swapTwoNumWithXor: sol.swapTwoNumWithXor.bind(sol),
};

// [description, a, b, expected]
const cases = [
  ['example 1: positive numbers', 5, 7, [7, 5]],
  ['example 2: negative and positive', -3, 9, [9, -3]],
  ['both negative', -10, -20, [-20, -10]],
  ['one value is zero', 0, 42, [42, 0]],
  ['both values are zero', 0, 0, [0, 0]],
  ['equal non-zero values', 8, 8, [8, 8]],
  ['a greater than b', 100, 1, [1, 100]],
  ['32-bit signed min/max boundary', -2147483648, 2147483647, [2147483647, -2147483648]],
  ['both at max boundary', 2147483647, 2147483647, [2147483647, 2147483647]],
  ['both at min boundary', -2147483648, -2147483648, [-2147483648, -2147483648]],
];

for (const [methodName, fn] of Object.entries(methods)) {
  test(`Solution.${methodName}`, async (t) => {
    for (const [description, a, b, expected] of cases) {
      await t.test(description, () => {
        assert.deepEqual(fn(a, b), expected);
      });
    }
  });
}
