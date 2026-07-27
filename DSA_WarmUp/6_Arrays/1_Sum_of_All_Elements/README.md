# Sum of All Elements

**Difficulty:** Easy
**Topics:** Arrays, Loops
**File:** [`Sum_of_All_Elements.js`](./Sum_of_All_Elements.js)
**Tests:** [`Sum_of_All_Elements.test.js`](./Sum_of_All_Elements.test.js)

## Problem Statement

Given an array of numbers `arr`, return the sum of all its elements. An empty array sums to `0`.

### Example 1

```
Input:  arr = [1, 2, 3, 4, 5]
Output: 15
```

### Example 2

```
Input:  arr = []
Output: 0
```

### Example 3

```
Input:  arr = [-1, -2, -3]
Output: -6
```

### Example 4

```
Input:  arr = [10]
Output: 10
```

### Constraints

- `arr` contains zero or more numbers (integers or floats), which may be negative, zero, or positive.

## Use Case

Summing an array is the simplest possible example of an *array reduction* — collapsing a whole collection down to a single value — and it's the entry point into this repo's Arrays module:

- **The "reduction" pattern generalizes everywhere** — sum, product, max, min, count, concatenation, and even building up an object or a string from an array all follow the same shape: start with an initial value, and fold each element into it one at a time. Once this shape clicks for a sum, it transfers directly to far more complex reduce-based problems.
- **Running totals and prefix sums** — this is the conceptual seed of the prefix-sum technique used constantly in subarray problems (range sum queries, "does a subarray exist that sums to k," and so on) — those all start from "can I compute a running sum as I go."
- **Loop vs. built-in tradeoffs** — comparing a hand-rolled accumulator loop against `Array.prototype.reduce` here previews a recurring theme in the Arrays module: JavaScript's array built-ins (`reduce`, `map`, `filter`, `some`, `every`) usually express the same logic as a loop, just packaged differently — worth knowing both, since not every environment or style guide favors one over the other.

## Concepts

- **Accumulator pattern** — track a running value (`sum`, initialized to `0`) and update it once per element.
- **Empty array as a base case** — a loop over an empty array simply never executes, so the initial accumulator value doubles as the correct answer for `arr = []`.
- **`Array.prototype.reduce`** — JavaScript's built-in for exactly this shape: `arr.reduce((accumulator, currentValue) => ..., initialValue)` runs the callback once per element, threading the accumulator through, and returns the final accumulated value.

## Approaches

### Approach 1 — manual loop with an accumulator

**Intuition:** Walk through the array one element at a time, keeping a running total that starts at `0` and picks up each element along the way.

**Solution:**

```js
sumOfAllElementsApproach1(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
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

Loop ends (`i` reached `arr.length`). Return `15`. ✓ matches Example 1.

### Approach 2 — `Array.prototype.reduce`

**Intuition:** `reduce` is built precisely for "fold every element into a single accumulated value" — hand it a callback that adds the current element to the running total, and an initial value of `0` (which also makes the empty-array case return `0` automatically, with no extra check needed).

**Solution:**

```js
sumOfAllElementsApproach2(arr) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}
```

**Dry Run** (`arr = [1, 2, 3, 4, 5]`, Example 1):

| Call | `acc` | `curr` | Returns |
|---|---|---|---|
| 1 | `0` (initial value) | `1` | `1` |
| 2 | `1` | `2` | `3` |
| 3 | `3` | `3` | `6` |
| 4 | `6` | `4` | `10` |
| 5 | `10` | `5` | `15` |

Return `15`. ✓ matches Example 1 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One addition per element, one accumulator variable regardless of array size. |
| `Array.prototype.reduce` | O(n) | O(1) | Same single pass under the hood — `reduce` is a built-in loop, not a different algorithm. |

Both approaches are the same time and space complexity here — this is another case (like Even or Odd and the Right-Angled Triangle) where the difference between "approaches" is stylistic/technique-based (manual loop vs. built-in), not a genuine complexity improvement, since summing every element inherently requires looking at each one exactly once.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including the empty-array case (`[]` → `0`), negatives that cancel out to `0`, and floats. Verified against 7 cases plus a direct cross-check between both approaches, all in `Sum_of_All_Elements.test.js`.

## Key Takeaway

The empty-array case needed no special handling in either approach — a `for` loop over `[]` simply never executes (leaving `sum` at its initial `0`), and `reduce` with an explicit initial value of `0` returns that initial value unchanged when there's nothing to fold in. Supplying an initial value to `reduce` isn't just a style choice here — without one, calling `reduce` on an empty array throws a `TypeError` instead of returning `0`.
