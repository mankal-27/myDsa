const test = require('node:test');
const assert = require('node:assert/strict');
const Solution = require('./Grade_from_Marks.js');

const sol = new Solution();

// [description, marks, expected]
const cases = [
  ['example 1: high A', 95, 'A'],
  ['example 2: mid B', 82, 'B'],
  ['example 3: lower boundary of D', 60, 'D'],
  ['example 4: F range', 45, 'F'],
  ['lower boundary of A', 90, 'A'],
  ['upper boundary (max marks)', 100, 'A'],
  ['lower boundary of B', 80, 'B'],
  ['lower boundary of C', 70, 'C'],
  ['upper boundary of B', 89, 'B'],
  ['upper boundary of C', 79, 'C'],
  ['upper boundary of D', 69, 'D'],
  ['upper boundary of F', 59, 'F'],
  ['minimum marks', 0, 'F'],
  ['just above zero', 1, 'F'],
];

test('Solution.gradeFromMarksApproach1', async (t) => {
  for (const [description, marks, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.gradeFromMarksApproach1(marks), expected);
    });
  }
});

test('Solution.gradeFromMarksApproach2', async (t) => {
  for (const [description, marks, expected] of cases) {
    await t.test(description, () => {
      assert.equal(sol.gradeFromMarksApproach2(marks), expected);
    });
  }
});

test('both approaches agree on every case', () => {
  for (const [, marks] of cases) {
    assert.equal(sol.gradeFromMarksApproach1(marks), sol.gradeFromMarksApproach2(marks));
  }
});
