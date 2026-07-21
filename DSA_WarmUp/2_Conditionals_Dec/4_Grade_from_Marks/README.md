# Grade from Marks

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Arrays
**File:** [`Grade_from_Marks.js`](./Grade_from_Marks.js)
**Tests:** [`Grade_from_Marks.test.js`](./Grade_from_Marks.test.js)

## Problem Statement

Given an integer `marks` between 0 and 100, return the corresponding letter grade.

The grade bands are:

- `90` to `100` returns `"A"`
- `80` to `89` returns `"B"`
- `70` to `79` returns `"C"`
- `60` to `69` returns `"D"`
- below `60` returns `"F"`

### Example 1

```
Input:  marks = 95
Output: "A"
```

### Example 2

```
Input:  marks = 82
Output: "B"
```

### Example 3

```
Input:  marks = 60
Output: "D"
```

### Example 4

```
Input:  marks = 45
Output: "F"
```

### Constraints

- `0 <= marks <= 100`.

## Use Case

Mapping a continuous number onto one of several discrete bands ("bucketing") shows up everywhere once you look for it:

- **Tax brackets, shipping tiers, pricing plans** — "which bracket does this value fall into" is the exact same shape as this problem, just with different thresholds and labels.
- **Histograms and binning** — grouping data points into ranges (age groups, price ranges, score distributions) for visualization or analysis is this same lookup, applied to a whole dataset.
- **A preview of the chained-conditional-vs-binary-search tradeoff** — with only 5 bands, checking them one at a time is fine. If this problem had 100 finely-graded bands instead of 5, a linear `if/else if` chain would become genuinely slow (`O(n)` in the number of bands), and you'd want something like binary search over sorted thresholds (`O(log n)`) instead — a pattern covered later in this repo's Binary Search module. The array-lookup approach below is a taste of that idea: computing the right bucket directly with arithmetic instead of checking bands one at a time.

## Concepts

- **Chained conditionals** — `if / else if / else` ordered from the highest band down, so each check only needs to rule out "is it higher than this," not both bounds of the band.
- **Integer division for bucketing** — `Math.floor(marks / 10)` collapses a range of 10 values (e.g. `80`-`89`) down to a single bucket index (`8`), the same "peel off the unit" idea from the Convert Seconds and Divide problems, applied here to grade bands instead of time units.
- **Arrays as lookup tables** — using an array's index as the "key" instead of writing conditional logic, similar in spirit to the dispatch-table approach from the Area & Perimeter of Shapes problem.

## Approaches

Both approaches are O(1) — 5 fixed bands means there's no real complexity gap to close (see the Use Case note above for when there would be). The interesting comparison is stylistic: readable range-checks vs. a computed lookup.

### Approach 1 — chained conditionals

**Intuition:** Checking bands from highest to lowest means each condition only needs a single comparison — if `marks >= 90` didn't match, you already know it's below 90, so the next check (`>= 80`) doesn't need to also verify the upper bound. This ordering is what makes a single-sided comparison chain correct.

**Solution:**

```js
gradeFromMarksApproach1(marks) {
  if (marks >= 90) return "A";
  else if (marks >= 80) return "B";
  else if (marks >= 70) return "C";
  else if (marks >= 60) return "D";
  else return "F";
}
```

**Dry Run** (`marks = 82`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `marks >= 90`? | `82 >= 90` → `false` |
| 2 | `marks >= 80`? | `82 >= 80` → `true` |
| 3 | `return "B"` | |

Return `"B"`. ✓ matches Example 2.

### Approach 2 — bucket index + lookup array

**Intuition:** Every band here is exactly 10 marks wide (except the top one, which is 11 wide since it includes both 90-99 and 100). Dividing `marks` by 10 and flooring the result collapses each 10-wide band down to a single integer "bucket number" — `82` and `85` both become bucket `8`. Precompute the grade for each possible bucket once, store it in an array, and look it up by index instead of comparing ranges.

**Solution:**

```js
gradeFromMarksApproach2(marks) {
  const bands = ["F", "F", "F", "F", "F", "F", "D", "C", "B", "A", "A"];
  // index:        0    1    2    3    4    5   6    7    8    9   10
  // marks:       0-9 10-19 20-29 30-39 40-49 50-59 60-69 70-79 80-89 90-99 100
  const index = Math.floor(marks / 10);
  return bands[index];
}
```

**Dry Run** (`marks = 82`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `82 / 10` | `8.2` |
| 2 | `Math.floor(8.2)` | `8` |
| 3 | `bands[8]` | `"B"` |

Return `"B"`. ✓ matches Example 2 and Approach 1's result — one array lookup instead of two failed comparisons plus one successful one.

**Dry Run** (`marks = 100`, boundary case — worth tracing since 100 is the one value where the top band is 11 wide instead of 10):

| Step | Expression | Value |
|---|---|---|
| 1 | `100 / 10` | `10` |
| 2 | `Math.floor(10)` | `10` |
| 3 | `bands[10]` | `"A"` |

Return `"A"` — correct because `bands` has an explicit 11th entry (index `10`) just for this case, rather than assuming every bucket is exactly 10 marks wide.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Chained conditionals | O(1) | O(1) | At most 4 comparisons, regardless of `marks` — fixed by the number of bands (5), not by the size of `marks`. |
| Bucket index + lookup array | O(1) | O(1) | One division, one array index — the lookup array itself is a fixed size (11 entries), not something that grows with input. |

## Implementation Notes

Both approaches had a bug, and both bugs hit the exact same set of inputs: the band boundaries.

**Approach 1** used strict `>` instead of `>=` on every comparison (`marks > 90`, `marks > 80`, etc.), and additionally bounded the A band on both sides (`marks > 90 && marks < 100`). The combined effect: every exact boundary value — `60`, `70`, `80`, `90`, and `100` — fell through every single condition and landed on the `else` branch, incorrectly returning `"F"`. That includes Example 3 from the problem statement (`marks = 60` should return `"D"`), which would have failed against the given examples alone. Fixed by using `>=` throughout and removing the redundant upper bound on the A check (once you're checking bands from highest to lowest, ruling out "is it 90 or above" is enough — no need to also check "is it under 100").

**Approach 2**'s lookup array only had 10 entries (indices `0`-`9`), but `Math.floor(100 / 10)` is `10` — one past the end of the array — so `gradeFromMarksApproach2(100)` returned `undefined` instead of `"A"`. This is exactly the boundary case flagged in the README's dry run before implementation. Fixed by adding an 11th entry (`"A"` at index `10`) to cover the top band, which is 11 marks wide (`90`-`100`) rather than the usual 10.

Verified against 14 cases — both given examples and every band boundary on both sides — plus a direct cross-check between both approaches, all in `Grade_from_Marks.test.js`.

## Key Takeaway

Boundary values are where off-by-one bugs hide, and this problem had two independent ones that both happened to be invisible unless you specifically tested every threshold: `>` vs `>=` in a comparison chain, and an off-by-one array length in a lookup table. Testing only the "obviously in the middle of a band" values (like the problem's own examples, mostly) would have missed both — which is exactly why the test suite here deliberately checks every single boundary.
