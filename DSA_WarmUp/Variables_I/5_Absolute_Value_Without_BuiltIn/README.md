# Absolute Value Without Built-in

**Difficulty:** Easy
**Topics:** Variables, Operators, Conditionals, Bit Manipulation
**File:** [`Absolute_Value_Without_BuiltIn.js`](./Absolute_Value_Without_BuiltIn.js)
**Tests:** [`Absolute_Value_Without_BuiltIn.test.js`](./Absolute_Value_Without_BuiltIn.test.js)

## Problem Statement

Given an integer `num`, return its absolute value **without using `Math.abs()`** (or any other built-in absolute-value function).

### Example 1

```
Input:  num = -7
Output: 7
```

### Example 2

```
Input:  num = 5
Output: 5
```

### Example 3

```
Input:  num = 0
Output: 0
```

### Constraints

- `num` fits in the 32-bit signed integer range: `-2^31 <= num <= 2^31 - 1`.

## Use Case

Absolute value is a building block used everywhere in DSA, even though it rarely appears as a standalone interview question:

- **Distance/difference calculations** — `|a - b|` shows up in two-pointer problems, sliding window, and "closest pair" style problems.
- **Comparators and error margins** — sorting by proximity to a target, or checking if a computed value is "close enough" to an expected one (`|actual - expected| < epsilon`).
- **Bit manipulation fundamentals** — implementing it via two's complement (Approach 2 below) is a direct, hands-on introduction to how negative numbers are actually represented in binary, which is foundational for the Bit Manipulation pattern.

## Concepts

- **Conditionals / ternary operator** — branching on the sign of a number.
- **Unary negation (`-`)** — flipping the sign of a value.
- **Two's complement representation** — how negative integers are stored in binary, and how XOR + subtraction can flip a negative number to positive without an `if`.
- **Bitwise operators** — arithmetic right shift (`>>`) to extract a sign mask, XOR (`^`) to conditionally invert bits.

## Approaches

### Brute Force — conditional check

Check the sign directly and negate if needed:

```js
absoluteValueBruteForce(num) {
  if (num < 0) return -num;
  return num;
}
```

Simple and completely readable — this is genuinely how you should write this in real code. "Brute force" here just means "the direct approach," not something inefficient.

### Optimized — branchless bitwise trick (two's complement)

```js
absoluteValueOptimized(num) {
  const mask = num >> 31;       // all 1s (-1) if num is negative, all 0s (0) if non-negative
  return (num ^ mask) - mask;   // XOR flips every bit when mask is -1, then subtracting mask (-1) adds 1 back
}
```

Works because in two's complement, `-num` is `(~num) + 1`, i.e. `(num ^ -1) - (-1)`. When `num` is non-negative, `mask` is `0`, so this simplifies to `num - 0`, a no-op. No `if`, no branch — useful in performance-sensitive code where branch mispredictions matter, and a nice worked example of two's complement in action. Note: this only works correctly for 32-bit integers (the `>> 31` assumes a 32-bit sign bit) — it is not a general-purpose replacement for `Math.abs()` on arbitrary numbers.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (conditional) | O(1) | O(1) | Single comparison, at most one negation. |
| Optimized (bitwise) | O(1) | O(1) | Fixed number of bitwise operations, regardless of input. |

Both are already O(1) — this problem's brute-force/optimized split isn't about asymptotic complexity (there's nothing to improve there), it's about **branching vs. branchless computation**, which matters for performance in tight loops even when the Big-O is identical.

## Implementation Notes

`absoluteValueBruteForce` was correct as written. `absoluteValueOptimized` had one bug: it used `num >> 32` instead of `num >> 31`.

In JS, the bitwise shift operators only use the **low 5 bits** of the right-hand operand (since a 32-bit value only has 32 possible shift positions), so the shift amount is effectively `amount % 32`. That means `num >> 32` is silently the same as `num >> 0` — a no-op shift — so `mask` ended up equal to `num` itself instead of the sign mask (`-1` or `0`). This produced correct results only for the specific inputs where that no-op happened to work out (like already-negative or zero values) and silently wrong results for most positive numbers, e.g. `absoluteValueOptimized(5)` returned `-5`. Verified against 9 cases (both examples, sign flips, zero, and the 32-bit min/max boundaries) in `Absolute_Value_Without_BuiltIn.test.js` — all pass after the fix.

## Key Takeaway

Off-by-one bugs aren't just about loop bounds — they hit bit-shift amounts too, and they're especially dangerous there because JS silently wraps the shift amount modulo 32 instead of throwing an error, so a typo like `32` instead of `31` doesn't fail loudly. It fails quietly, on some inputs but not others, which is exactly the kind of bug a broad test suite (not just the two examples from the prompt) is built to catch.
