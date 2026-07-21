# Quotient and Remainder of a Division

**Difficulty:** Easy
**Topics:** Variables, Operators, Loops, Bit Manipulation (bonus)
**File:** [`Quotient_and_Remainder_of_Division.js`](./Quotient_and_Remainder_of_Division.js)
**Tests:** [`Quotient_and_Remainder_of_Division.test.js`](./Quotient_and_Remainder_of_Division.test.js)

## Problem Statement

Given two integers `dividend` and `divisor` (`divisor != 0`), return `[quotient, remainder]` using **truncating division** — the quotient rounds toward zero, and the remainder takes the sign of the `dividend`. This is the same convention JS's native `/` (combined with `Math.trunc`) and `%` operators already use.

### Example 1

```
Input:  dividend = 13, divisor = 4
Output: [3, 1]
```

### Example 2

```
Input:  dividend = -13, divisor = 4
Output: [-3, -1]
```

### Example 3

```
Input:  dividend = 13, divisor = -4
Output: [-3, 1]
```

### Example 4

```
Input:  dividend = 0, divisor = 5
Output: [0, 0]
```

### Constraints

- `dividend` and `divisor` are integers.
- `divisor != 0`.
- Either value may be negative.

## Use Case

Division and remainder are two of the most heavily used operations in DSA, well beyond arithmetic problems:

- **Hashing** — `key % tableSize` is the standard way to map a key into a fixed number of buckets in a hash table.
- **Cyclic/circular structures** — indexing into a circular buffer or circular queue (`index % length`), or wraparound logic in general.
- **The repeated-subtraction (brute force) approach is literally how division is implemented at the hardware level** for architectures without a dedicated divide instruction, and the doubling trick mentioned below is the exact technique behind LeetCode's classic "Divide Two Integers" problem (dividing without using `/` at all) and behind fast exponentiation-style algorithms in general.

## Concepts

- **Truncating vs. flooring division** — JS's `/` + `Math.trunc` rounds toward zero (`-13 / 4` truncates to `-3`), which differs from "floored" division used in some languages (e.g. Python's `//` would give `-4` for the same input). Knowing which convention a problem expects matters.
- **Sign handling** — working out the sign of the quotient and remainder independently of the magnitude calculation.
- **Loops** — using a `while` loop to repeatedly subtract until nothing is left to subtract.
- **Bit shifting (bonus)** — doubling a value with `<<` is a cheap way to "guess" how many divisor-multiples fit at once instead of subtracting one at a time.

## Approaches

### Brute Force — repeated subtraction

Subtract `divisor` from `dividend` repeatedly, counting how many times it takes:

```js
divideBruteForce(dividend, divisor) {
  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const divisorAbs = Math.abs(divisor);

  let quotient = 0;
  while (remaining >= divisorAbs) {
    remaining -= divisorAbs;
    quotient++;
  }

  quotient = negative ? -quotient : quotient;
  const remainder = dividend < 0 ? -remaining : remaining;
  return [quotient, remainder];
}
```

Correct, but painfully slow when the quotient is large — dividing `1000000` by `1` takes a million subtractions to compute an answer that's obvious at a glance.

### Optimized — native `/` and `%`

```js
divideOptimized(dividend, divisor) {
  const quotient = Math.trunc(dividend / divisor);
  const remainder = dividend % divisor;
  return [quotient, remainder];
}
```

One division, one modulo — done. This is how you'd actually write this in real code.

### Bonus — doubling (exponential subtraction)

A middle ground between the two, and the core trick behind LeetCode's "Divide Two Integers": instead of subtracting `divisor` one copy at a time, double it (`divisor`, `2×divisor`, `4×divisor`, ...) as long as it still fits, subtract the largest multiple that fits, and repeat. This is the same "collapse a loop of repeated operations into repeated doubling" idea used for fast exponentiation:

```js
divideDoubling(dividend, divisor) {
  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const divisorAbs = Math.abs(divisor);

  let quotient = 0;
  while (remaining >= divisorAbs) {
    let multiple = divisorAbs;
    let count = 1;
    while (remaining >= (multiple << 1)) {
      multiple <<= 1;
      count <<= 1;
    }
    remaining -= multiple;
    quotient += count;
  }

  quotient = negative ? -quotient : quotient;
  const remainder = dividend < 0 ? -remaining : remaining;
  return [quotient, remainder];
}
```

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (repeated subtraction) | O(dividend / divisor) | O(1) | One loop iteration per unit of quotient — degenerates badly when the quotient is large (e.g. dividing by 1). |
| Optimized (native `/`, `%`) | O(1) | O(1) | Hardware/engine-level division, constant time regardless of input size. |
| Bonus (doubling) | O(log(dividend / divisor)) | O(1) | Each outer-loop pass at least doubles how much is subtracted, so the number of passes grows logarithmically instead of linearly with the quotient. |

## Implementation Notes

`divideOptimized` had one bug: it used `Math.abs(dividend / divisor)` instead of `Math.trunc(dividend / divisor)`. `Math.abs` only strips the sign — it does nothing to the decimal portion, so `13 / 4` stayed `3.25` instead of truncating to `3`, and because it's `abs`, the result was also always non-negative, losing the correct sign for cases like `13 / -4` (which should give a *negative* quotient, `-3`). Fixed to `Math.trunc`, which both truncates toward zero and preserves sign correctly (`Math.trunc(13 / -4) === -3`).


## Key Takeaway

`Math.abs` and `Math.trunc` solve two completely different problems — one removes the sign, the other removes the decimal — and it's easy to reach for the wrong one when you're thinking "I just want a clean positive-ish integer out of this." Worth double-checking which one a formula actually needs before wiring it in.
