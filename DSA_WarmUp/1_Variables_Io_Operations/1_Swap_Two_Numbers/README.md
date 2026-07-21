# Swap Two Numbers

**Difficulty:** Easy
**Topics:** Variables, Input/Output, Operators
**File:** [`Swap_Two_Numbers.js`](./Swap_Two_Numbers.js)
**Tests:** [`Swap_Two_Numbers.test.js`](./Swap_Two_Numbers.test.js)

## Problem Statement

Given two numbers `a` and `b`, swap their values and return the result as a two-element array `[b, a]`.

In other words, the value that started in `a` should appear in the second position, and the value that started in `b` should appear in the first position.

### Example 1

```
Input:  a = 5, b = 7
Output: [7, 5]
```

### Example 2

```
Input:  a = -3, b = 9
Output: [9, -3]
```

### Constraints

- Both `a` and `b` fit in the 32-bit signed integer range: `-2^31 <= a, b <= 2^31 - 1`.
- The values may be negative, zero, or equal to each other.

## Use Case

Swapping is one of the most-used primitives in DSA, not a problem you'll see standalone in interviews but one you'll write inline constantly:

- **Sorting algorithms** — bubble sort, selection sort, quicksort's partition step, and heapsort all swap array elements in place to avoid extra memory.
- **In-place array manipulation** — reversing an array/string, rotating an array, or the two-pointer technique all rely on swapping elements at two indices.
- **Graph/tree algorithms** — swapping child pointers (mirroring a binary tree) or adjacency list entries.
- **Register-constrained systems** — the arithmetic/XOR variants below originated in embedded/assembly programming where a spare register wasn't always available; understanding them helps when reasoning about space complexity in constrained environments.

## Concepts

- **Variables** — declaring and reassigning values with `let`/`const`, and understanding that `const` bindings can't be reassigned (so a temp-variable swap needs `let`).
- **Operators** — using arithmetic (`+`, `-`) or bitwise (`^`) operators to swap without a temporary variable.
- **I/O basics** — taking two inputs and producing a single combined output (an array/tuple), which is the pattern used throughout DSA for returning multiple values from one function.

## Approaches

### 1. Using a temporary variable (most common, safest)

```js
function swap(a, b) {
  const temp = a;
  a = b;
  b = temp;
  return [a, b];
}
```

Time: O(1), Space: O(1).

### 2. Destructuring assignment (idiomatic JS)

```js
function swap(a, b) {
  [a, b] = [b, a];
  return [a, b];
}
```

Time: O(1), Space: O(1) — JS handles the swap under the hood without an explicit temp variable.

### 3. Arithmetic, no temp variable (works for numbers, watch for overflow in other languages)

```js
function swap(a, b) {
  a = a + b;
  b = a - b;
  a = a - b;
  return [a, b];
}
```

**Time: O(1), Space: O(1)** — no auxiliary variable used. Safe in JS since numbers don't overflow the same way as fixed-width integers in other languages, but generally avoided in interviews in favor of destructuring — it's harder to read and was really a workaround for languages without a spare register/variable.

### 4. XOR swap (bitwise, integers only)

```js
function swap(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}
```

**Time: O(1), Space: O(1)** — no auxiliary variable used. Only works correctly for integers, and breaks if `a` and `b` reference the same variable/memory location. Included for completeness — not recommended in practice.

## Complexity Summary

| Approach | Time | Space | Notes |
|---|---|---|---|
| Temporary variable | O(1) | O(1) extra (1 variable) | Clearest, safest, works for any type |
| Destructuring | O(1) | O(1) | Idiomatic JS, no explicit temp needed |
| Arithmetic (no temp) | O(1) | O(1), 0 extra variables | Numbers only; readability tradeoff |
| XOR (bitwise) | O(1) | O(1), 0 extra variables | Integers only; breaks on same-reference swap |

All four approaches are constant time and constant space — the difference between them is readability and whether they need an extra variable, not asymptotic complexity.

## Key Takeaway

The trivial-looking "swap" problem is really a warm-up for two habits used constantly in DSA: choosing the right way to hold intermediate state (temp variable vs. no extra space) and returning multiple values cleanly from a function.
