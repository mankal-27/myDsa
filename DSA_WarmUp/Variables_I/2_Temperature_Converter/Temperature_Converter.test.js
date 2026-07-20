const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Temperature_Converter.js');

const sol = new Solution();

// [description, temp, scale, expected]
const cases = [
  ['freezing point, C to F', 0, 'C', 32],
  ['boiling point, C to F', 100, 'C', 212],
  ['boiling point, F to C', 212, 'F', 100],
  ['freezing point, F to C', 32, 'F', 0],
  ['body temp, F to C (rounded)', 98.6, 'F', 37],
  ['negative Celsius', -40, 'C', -40], // -40 is the same in both scales
  ['negative Fahrenheit', -40, 'F', -40],
  ['fractional Celsius', 36.6, 'C', 97.88],
  ['zero Fahrenheit', 0, 'F', -17.78],
  ['room temp, C to F', 20, 'C', 68],
];

test('Solution.tempConverter', async (t) => {
  for (const [description, temp, scale, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.tempConverter(temp, scale), expected);
    });
  }
});
