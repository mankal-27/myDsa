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

**Intuition:** You can't just write `a = b; b = a;` — by the time the second line runs, `a` already holds `b`'s value, so you've lost the original `a` forever. The fix is to park the original `a` somewhere safe (a temporary variable) before overwriting it.

**Solution:**

```js
function swap(a, b) {
  const temp = a;
  a = b;
  b = temp;
  return [a, b];
}
```

**Dry Run** (`a = 5, b = 7`):

| Step | Statement | `temp` | `a` | `b` |
|---|---|---|---|---|
| 1 | `const temp = a;` | `5` | `5` | `7` |
| 2 | `a = b;` | `5` | `7` | `7` |
| 3 | `b = temp;` | `5` | `7` | `5` |

Return `[a, b]` → `[7, 5]`. ✓ matches Example 1.

Time: O(1), Space: O(1).

### 2. Destructuring assignment (idiomatic JS)

**Intuition:** JS's array destructuring evaluates the right-hand side (`[b, a]`) completely — building a temporary array `[7, 5]` — *before* assigning anything back to `a` and `b`. That temporary array is doing the same job as `temp` in Approach 1, just handled implicitly by the language instead of a variable you manage yourself.

**Solution:**

```js
function swap(a, b) {
  [a, b] = [b, a];
  return [a, b];
}
```

**Dry Run** (`a = 5, b = 7`):

| Step | What happens | `a` | `b` |
|---|---|---|---|
| 1 | Evaluate right-hand side `[b, a]` → `[7, 5]` (a hidden temporary array) | `5` | `7` |
| 2 | Destructure: `a = 7` (first element) | `7` | `7` |
| 3 | Destructure: `b = 5` (second element) | `7` | `5` |

Return `[a, b]` → `[7, 5]`. ✓ matches Example 1.

Time: O(1), Space: O(1) — JS handles the swap under the hood without an explicit temp variable.

### 3. Arithmetic, no temp variable (works for numbers, watch for overflow in other languages)

**Intuition:** If you encode both values inside `a` using addition, you can recover each original value with a subtraction — `a + b` holds enough information to reconstruct either number once you know the other one. This trades a variable for three extra arithmetic operations.

**Solution:**

```js
function swap(a, b) {
  a = a + b;
  b = a - b;
  a = a - b;
  return [a, b];
}
```

**Dry Run** (`a = 5, b = 7`):

| Step | Statement | `a` | `b` |
|---|---|---|---|
| 0 | initial | `5` | `7` |
| 1 | `a = a + b;` → `5 + 7` | `12` | `7` |
| 2 | `b = a - b;` → `12 - 7` | `12` | `5` |
| 3 | `a = a - b;` → `12 - 5` | `7` | `5` |

Return `[a, b]` → `[7, 5]`. ✓ matches Example 1.

**Time: O(1), Space: O(1)** — no auxiliary variable used. Safe in JS since numbers don't overflow the same way as fixed-width integers in other languages, but generally avoided in interviews in favor of destructuring — it's harder to read and was really a workaround for languages without a spare register/variable.

### 4. XOR swap (bitwise, integers only)

**Intuition:** XOR is its own inverse: `x ^ y ^ y === x`. Packing both values into `a` via XOR (instead of addition) lets you "unpack" each original value the same way Approach 3 does with addition/subtraction — but using bits instead of arithmetic, so there's no overflow risk at all.

**Solution:**

```js
function swap(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}
```

**Dry Run** (`a = 5 (0b101), b = 7 (0b111)`):

| Step | Statement | `a` (binary) | `b` (binary) |
|---|---|---|---|
| 0 | initial | `101` (5) | `111` (7) |
| 1 | `a = a ^ b;` → `101 ^ 111` | `010` (2) | `111` (7) |
| 2 | `b = a ^ b;` → `010 ^ 111` | `010` (2) | `101` (5) |
| 3 | `a = a ^ b;` → `010 ^ 101` | `111` (7) | `101` (5) |

Return `[a, b]` → `[7, 5]`. ✓ matches Example 1.

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
