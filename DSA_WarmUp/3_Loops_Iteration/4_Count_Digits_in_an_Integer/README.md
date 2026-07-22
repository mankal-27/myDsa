# Count Digits in an Integer

**Difficulty:** Easy
**Topics:** Loops, Math (logarithms)
**File:** [`Count_Digits_in_an_Integer.js`](./Count_Digits_in_an_Integer.js)
**Tests:** [`Count_Digits_in_an_Integer.test.js`](./Count_Digits_in_an_Integer.test.js)

## Problem Statement

Given an integer `num` (which may be negative), return the number of digits it has. `num = 0` has `1` digit, and the minus sign on a negative number doesn't count as a digit.

### Example 1

```
Input:  num = 12345
Output: 5
```

### Example 2

```
Input:  num = 0
Output: 1
```

### Example 3

```
Input:  num = -987
Output: 3
```

### Example 4

```
Input:  num = 7
Output: 1
```

### Constraints

- `num` is an integer and may be negative, zero, or positive.

## Use Case

Counting digits sounds trivial, but the technique behind the optimized approach — using logarithms to answer a counting question — generalizes surprisingly far:

- **Input validation & formatting** — checking whether a number fits in a fixed-width display (a 4-digit PIN, a 10-digit phone number) starts with counting its digits.
- **Logarithms as a "how many times can this be divided" shortcut** — `log10(n)` answers "how many powers of 10 fit into `n`," which is exactly what the digit-counting loop is doing one division at a time. The same idea (`log_b(n)` counting how many times `n` can be divided by `b`) reappears constantly in complexity analysis itself — it's *why* binary search is `O(log n)`.
- **A genuine floating-point cautionary tale** — this is one of the few problems in this repo where the "optimized" formula can silently misfire due to floating-point rounding, making it a good, concrete case study for why closed-form math shortcuts still deserve a healthy amount of suspicion.

## Concepts

- **Repeated integer division** — dividing by 10 and counting iterations until nothing is left, the same "peel off one unit at a time" shape from Convert Seconds and the Quotient & Remainder problem.
- **`Math.log10()`** — the number of digits in a positive integer `n` is `floor(log10(n)) + 1` (e.g. `log10(999) ≈ 2.9996`, floor to `2`, `+1 = 3` digits; `log10(1000) = 3` exactly, floor to `3`, `+1 = 4` digits).
- **Floating-point precision with logarithms** — computing a logarithm as `Math.log(n) / Math.LN10` (rather than the dedicated `Math.log10`) can return a value like `2.9999999999999996` for an exact power of 10 instead of precisely `3`, which silently flips `floor(...) + 1` to the wrong answer. `Math.log10` is specifically implemented to avoid this for exact powers of ten, but it's a sharp edge worth knowing about before reaching for logarithms in place of a loop.

## Approaches

### Approach 1 — brute force: repeated division

**Intuition:** Counting digits is counting how many times you can strip off a "tens place" before nothing's left — divide by 10, note that you removed one digit, repeat until the number reaches 0.

**Solution:**

```js
countDigitsApproach1(num) {
  num = Math.abs(num);
  if (num === 0) return 1;
  let count = 0;
  while (num > 0) {
    num = Math.floor(num / 10);
    count++;
  }
  return count;
}
```

**Dry Run** (`num = -987`, Example 3):

| Iteration | `num` before | `num = Math.floor(num / 10)` | `count` after |
|---|---|---|---|
| — | `987` (after `Math.abs(-987)`) | — | `0` |
| 1 | `987` | `98` | `1` |
| 2 | `98` | `9` | `2` |
| 3 | `9` | `0` | `3` |

Loop ends (`num = 0`). Return `3`. ✓ matches Example 3.

### Approach 2 — optimized: `Math.log10` formula

**Intuition:** The number of digits in a positive integer `n` is exactly how many powers of 10 fit at or below it, plus one — which is precisely what `log10(n)` measures. Flooring it and adding 1 gives the digit count in one calculation, no loop needed.

**Solution:**

```js
countDigitsApproach2(num) {
  num = Math.abs(num);
  if (num === 0) return 1;
  return Math.floor(Math.log10(num)) + 1;
}
```

**Dry Run** (`num = -987`, Example 3):

| Step | Expression | Value |
|---|---|---|
| 1 | `num = Math.abs(-987)` | `987` |
| 2 | `Math.log10(987)` | `≈ 2.9943` |
| 3 | `Math.floor(2.9943)` | `2` |
| 4 | `2 + 1` | `3` |

Return `3`. ✓ matches Example 3 and Approach 1's result, in one calculation instead of a 3-iteration loop.

**The floating-point trap this approach needs to avoid:** computing the same logarithm as `Math.log(num) / Math.LN10` instead of using `Math.log10` directly can return a value just *barely* under a whole number for exact powers of 10 — e.g. `Math.log(1000) / Math.LN10` evaluates to `2.9999999999999996` instead of exactly `3`, which `Math.floor(...) + 1` turns into `3` instead of the correct `4`. `Math.log10` is implemented to special-case exact powers of ten and avoid this — but it's a good reminder that a "clean" mathematical formula can still be fragile once floating-point arithmetic gets involved, unlike the brute-force loop, which is immune to this issue entirely (integer division and comparison have no rounding ambiguity here).

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (repeated division) | O(d) = O(log₁₀ n) | O(1) | One iteration per digit — for a `d`-digit number, that's `d` divisions. |
| Optimized (`Math.log10`) | O(1) | O(1) | A single logarithm call and a couple of arithmetic operations, independent of how many digits `num` has. |

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including on every exact power of ten from `10` through `1000000` (the exact values where `Math.log10` needs to avoid the floating-point trap described above) and on negative numbers. Verified against 13 cases plus a direct cross-check between both approaches, all in `Count_Digits_in_an_Integer.test.js`.

## Key Takeaway

`Math.log10` earned its keep here specifically *because* it gets the exact-power-of-ten cases right where the naive `Math.log(n) / Math.LN10` wouldn't — a good reminder to reach for the dedicated built-in (`Math.log10`, `Math.log2`, `Math.hypot`, etc.) instead of reconstructing it from more general pieces, since the specialized version often carries precision guarantees the general formula doesn't.
