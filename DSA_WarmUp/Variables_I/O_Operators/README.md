# Swap Two Numbers

**Difficulty:** Easy
**Topics:** Variables, Input/Output, Operators
**File:** [`1_Swap_two_num.js`](./1_Swap_two_num.js)

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

Safe in JS since numbers don't overflow the same way as fixed-width integers in other languages, but generally avoided in interviews in favor of destructuring — it's harder to read and was really a workaround for languages without a spare register/variable.

### 4. XOR swap (bitwise, integers only)

```js
function swap(a, b) {
  a = a ^ b;
  b = a ^ b;
  a = a ^ b;
  return [a, b];
}
```

Only works correctly for integers, and breaks if `a` and `b` reference the same variable/memory location. Included for completeness — not recommended in practice.

## Key Takeaway

The trivial-looking "swap" problem is really a warm-up for two habits used constantly in DSA: choosing the right way to hold intermediate state (temp variable vs. no extra space) and returning multiple values cleanly from a function.
