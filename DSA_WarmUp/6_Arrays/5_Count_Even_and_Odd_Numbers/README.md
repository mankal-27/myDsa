# Count Even and Odd Numbers

**Difficulty:** Easy
**Topics:** Arrays, Loops
**File:** [`Count_Even_and_Odd_Numbers.js`](./Count_Even_and_Odd_Numbers.js)
**Tests:** [`Count_Even_and_Odd_Numbers.test.js`](./Count_Even_and_Odd_Numbers.test.js)

## Problem Statement

Given an array of integers `arr`, return an object `{ even, odd }` counting how many elements are even and how many are odd. `0` counts as even. An empty array returns `{ even: 0, odd: 0 }`.

### Example 1

```
Input:  arr = [1, 2, 3, 4, 5, 6]
Output: { even: 3, odd: 3 }
```

### Example 2

```
Input:  arr = []
Output: { even: 0, odd: 0 }
```

### Example 3

```
Input:  arr = [-3, -2, -1, 0]
Output: { even: 2, odd: 2 }   (-2 and 0 are even; -3 and -1 are odd)
```

### Example 4

```
Input:  arr = [2, 4, 6]
Output: { even: 3, odd: 0 }
```

### Constraints

- `arr` contains zero or more integers, which may be negative, zero, or positive.

## Use Case

This problem combines two ideas already covered elsewhere in this repo — the even/odd parity check from Module 2, and the array-reduction shape from Sum of All Elements — into a single "classify and tally" pass:

- **Classify-and-count is one of the most common array shapes in practice** — counting how many items fall into each of a small number of buckets (even/odd, pass/fail, in-stock/out-of-stock) shows up constantly in reporting, analytics, and validation logic, and it's always the same shape: one pass, a running tally per category.
- **Building on an earlier concept instead of re-deriving it** — the parity check here (`num % 2 === 0`) is exactly the logic from the Even or Odd problem in Module 2, reused as a building block rather than reinvented — a good habit to notice and repeat as the repo grows.
- **A stepping stone to `Array.prototype.reduce` building objects, not just numbers** — every previous `reduce` example in this repo (Sum, Average) folded values into a single number; this problem's optimized approach uses `reduce` to build up an object instead, which is a slightly more advanced but very common use of the same method.

## Concepts

- **Parity check reused** — `num % 2 === 0` for even, otherwise odd, exactly as established in the Even or Odd problem — including the fact that this works correctly for negative numbers and zero in JavaScript (`-3 % 2 === -1`, which is not `0`, so it's correctly classified as odd; `0 % 2 === 0`, so `0` is correctly classified as even).
- **Tallying into named counters** — instead of a single accumulator, this problem tracks two related counts at once.
- **`reduce` with an object accumulator** — the accumulator passed through `reduce` doesn't have to be a number; it can be an object (or array) that gets mutated or replaced on each step, as long as the same shape is returned every time.

## Approaches

### Approach 1 — manual loop with two counters

**Intuition:** Walk through the array once, and for each element, decide whether it's even or odd (reusing the exact same `% 2 === 0` check as the Even or Odd problem), incrementing the matching counter.

**Solution:**

```js
countEvenAndOddApproach1(arr) {
  let even = 0;
  let odd = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      even++;
    } else {
      odd++;
    }
  }
  return { even, odd };
}
```

**Dry Run** (`arr = [-3, -2, -1, 0]`, Example 3):

| `i` | `arr[i]` | `arr[i] % 2 === 0`? | `even` after | `odd` after |
|---|---|---|---|---|
| 0 | `-3` | `-3 % 2 = -1` → no | `0` | `1` |
| 1 | `-2` | `-2 % 2 = 0` → yes | `1` | `1` |
| 2 | `-1` | `-1 % 2 = -1` → no | `1` | `2` |
| 3 | `0` | `0 % 2 = 0` → yes | `2` | `2` |

Return `{ even: 2, odd: 2 }`. ✓ matches Example 3.

### Approach 2 — `Array.prototype.reduce` building the object in one pass

**Intuition:** Same classification logic, but instead of two separate outer-scope variables, thread a single `{ even, odd }` object through `reduce`, updating whichever count applies on each step and returning the same object for the next iteration.

**Solution:**

```js
countEvenAndOddApproach2(arr) {
  return arr.reduce(
    (acc, curr) => {
      if (curr % 2 === 0) {
        acc.even++;
      } else {
        acc.odd++;
      }
      return acc;
    },
    { even: 0, odd: 0 }
  );
}
```

**Dry Run** (`arr = [2, 4, 6]`, Example 4):

| Call | `acc` before | `curr` | `acc` after |
|---|---|---|---|
| 1 | `{ even: 0, odd: 0 }` | `2` | `{ even: 1, odd: 0 }` |
| 2 | `{ even: 1, odd: 0 }` | `4` | `{ even: 2, odd: 0 }` |
| 3 | `{ even: 2, odd: 0 }` | `6` | `{ even: 3, odd: 0 }` |

Return `{ even: 3, odd: 0 }`. ✓ matches Example 4 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One parity check per element, two counter variables regardless of array size. |
| `Array.prototype.reduce` | O(n) | O(1) | Same single pass and constant extra space — `reduce` is a built-in loop, threading one object through instead of two separate variables. |

Like several other "two approaches" pairs in this repo (Even or Odd, Right-Angled Triangle, Sum of All Elements), both approaches here are the same complexity — classifying every element requires looking at each one exactly once, so the difference is purely stylistic: two loose variables vs. one object accumulator.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including negative numbers, `0` correctly counted as even, an empty array, and single-element arrays. Verified against 7 cases plus a direct cross-check between both approaches, all in `Count_Even_and_Odd_Numbers.test.js`.

## Key Takeaway

The `reduce` version needed no special-casing for the empty array, for the same reason as Sum of All Elements: an explicit initial value (`{ even: 0, odd: 0 }`) is what `reduce` returns unchanged when there's nothing to fold in, rather than throwing. It's also a good example of `reduce`'s accumulator being a mutable object passed straight through the callback (`acc.even++; return acc;`) instead of always needing to construct a brand-new value each step — both are valid, but this problem only works cleanly because the same object reference is returned every time.
