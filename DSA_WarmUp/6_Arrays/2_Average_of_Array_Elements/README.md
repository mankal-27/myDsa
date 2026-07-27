# Average of Array Elements

**Difficulty:** Easy
**Topics:** Arrays, Loops
**File:** [`Average_of_Array_Elements.js`](./Average_of_Array_Elements.js)
**Tests:** [`Average_of_Array_Elements.test.js`](./Average_of_Array_Elements.test.js)

## Problem Statement

Given an array of numbers `arr`, return the average (arithmetic mean) of its elements. To avoid dividing by zero, the average of an empty array is defined as `0` here.

### Example 1

```
Input:  arr = [1, 2, 3, 4, 5]
Output: 3
```

### Example 2

```
Input:  arr = []
Output: 0
```

### Example 3

```
Input:  arr = [-1, -2, -3]
Output: -2
```

### Example 4

```
Input:  arr = [2, 3]
Output: 2.5
```

### Constraints

- `arr` contains zero or more numbers (integers or floats), which may be negative, zero, or positive.

## Use Case

The average builds directly on top of the previous problem (Sum of All Elements) — it's the same reduction, plus one more step, and that "one more step" is where most of the interesting edge-case thinking lives:

- **The empty-input edge case is the real lesson here** — a sum has an obvious, safe answer for an empty array (`0`), but an average of zero numbers is mathematically undefined (`0 / 0` is `NaN`, not `0`). Deciding what a function should do on an input the formula doesn't actually cover is a recurring, important judgment call in problem-solving, not just an afterthought.
- **Running averages and streaming statistics** — computing an average by first summing everything is fine for a fixed array, but real systems (analytics dashboards, monitoring, incremental statistics) often need a *running* average as new data arrives one point at a time, without re-summing everything each time — a natural next problem once this one is solid.
- **Reusing a previous solution as a building block** — this problem is a good example of composing solutions: "average" is just "sum, then divide by count," so the sum logic from the previous problem carries over directly instead of being rewritten from scratch.

## Concepts

- **Arithmetic mean** — sum all elements, then divide by how many there are: `average = sum / count`.
- **Guarding against division by zero** — `arr.length === 0` needs to be checked and handled explicitly before dividing, since `0 / 0` evaluates to `NaN` in JavaScript rather than throwing an error (which makes it easy to silently miss if untested).
- **Reusing the sum step** — both approaches below are literally "the previous problem's approach, plus one division," reinforcing that solutions can build on each other instead of always starting from a blank slate.

## Approaches

### Approach 1 — manual loop with an accumulator, then divide

**Intuition:** Compute the sum with a running-total loop exactly like Sum of All Elements, then divide that sum by the number of elements to get the mean — checking for the empty-array case first so the division never happens against a count of `0`.

**Solution:**

```js
averageOfArrayApproach1(arr) {
  if (arr.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}
```

**Dry Run** (`arr = [1, 2, 3, 4, 5]`, Example 1):

| `i` | `arr[i]` | `sum` after |
|---|---|---|
| 0 | `1` | `1` |
| 1 | `2` | `3` |
| 2 | `3` | `6` |
| 3 | `4` | `10` |
| 4 | `5` | `15` |

Loop ends. `sum = 15`, `arr.length = 5`, so return `15 / 5 = 3`. ✓ matches Example 1.

### Approach 2 — `Array.prototype.reduce`, then divide

**Intuition:** Same idea as Approach 1, but computing the sum with `reduce` instead of a manual loop — the empty-array guard is still needed up front, since dividing by `arr.length` when it's `0` produces `NaN` regardless of how the sum was computed.

**Solution:**

```js
averageOfArrayApproach2(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
}
```

**Dry Run** (`arr = [2, 3]`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `arr.length === 0`? | no |
| 2 | `arr.reduce((acc, curr) => acc + curr, 0)` | `2 + 3 = 5` |
| 3 | `5 / arr.length` | `5 / 2 = 2.5` |

Return `2.5`. ✓ matches Example 4.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One addition per element to compute the sum, then a single division. |
| `Array.prototype.reduce` | O(n) | O(1) | Same single pass to accumulate the sum, then a single division — `reduce` is a built-in loop, not a different algorithm. |

Just like Sum of All Elements, both approaches here are the same time and space complexity — the difference is technique (manual loop vs. built-in), not a complexity improvement, since computing an average inherently requires visiting every element at least once.

## Implementation Notes

`averageOfArrayApproach1` had a critical bug: the loop condition was `i , arr.length` — a comma expression, which evaluates both operands and returns only the rightmost one (`arr.length`), completely ignoring `i`. Since `arr.length` stays constant and truthy for any non-empty array, the loop condition never becomes falsy, so the loop never terminated — an infinite loop that would hang on any non-empty input. Fixed by changing it to the intended comparison, `i < arr.length`.

`averageOfArrayApproach2` was correct as submitted — no bugs found.

Verified against 6 cases — the empty-array edge case, negatives, an uneven division producing a decimal, and floats — plus a direct cross-check that both approaches agree on every case, all in `Average_of_Array_Elements.test.js`.

## Key Takeaway

`i , arr.length` and `i < arr.length` look deceptively similar at a glance but mean completely different things — the comma operator silently discards everything but its last operand, so a stray comma where a comparison operator was intended doesn't cause a syntax error or an obvious crash; it just quietly breaks the loop's exit condition, in this case producing an infinite loop instead of a wrong answer. Bugs that don't throw and don't return an obviously-wrong value (they just hang) are exactly the kind that a timeout-protected test run catches immediately, but could otherwise be very confusing to debug by inspection alone.
