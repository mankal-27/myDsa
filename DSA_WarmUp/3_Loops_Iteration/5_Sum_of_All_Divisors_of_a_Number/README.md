# Sum of All Divisors of a Number

**Difficulty:** Easy
**Topics:** Loops, Math, Number Theory
**File:** [`Sum_of_All_Divisors_of_a_Number.js`](./Sum_of_All_Divisors_of_a_Number.js)
**Tests:** [`Sum_of_All_Divisors_of_a_Number.test.js`](./Sum_of_All_Divisors_of_a_Number.test.js)

## Problem Statement

Given a positive integer `n`, return the sum of all its divisors, including `1` and `n` itself.

### Example 1

```
Input:  n = 6
Output: 12   (1 + 2 + 3 + 6)
```

### Example 2

```
Input:  n = 28
Output: 56   (1 + 2 + 4 + 7 + 14 + 28)
```

### Example 3

```
Input:  n = 1
Output: 1
```

### Example 4

```
Input:  n = 7
Output: 8    (1 + 7 — 7 is prime, so it only has two divisors)
```

### Constraints

- `n` is a positive integer.

## Use Case

Divisor sums are a classic number-theory building block, and the divisor-pair trick behind the optimized approach is one of the most reused tricks in this entire repo:

- **Perfect numbers** — a number is "perfect" if the sum of its *proper* divisors (excluding itself) equals the number itself; `28` in Example 2 is exactly such a number (`1+2+4+7+14 = 28`), a classical concept that traces back to Euclid.
- **Primality testing** — checking "does `n` have exactly two divisors (1 and itself)" is the definition of a prime number, and the `O(√n)` divisor-pair loop below is the *exact same technique* used to test primality efficiently (instead of checking every number up to `n`, you only need to check up to `√n`).
- **The `√n` trick generalizes far beyond divisors** — any time you're looking for factor pairs of `n` (two numbers that multiply to give `n`), you only need to search up to `√n`, because factors always come in pairs straddling the square root. This shows up again in factorization problems and in optimizing brute-force solutions across many patterns.

## Concepts

- **Divisors and the modulo test** — `i` divides `n` exactly when `n % i === 0`.
- **Divisor pairs** — if `i` divides `n`, then `n / i` also divides `n`, and `i × (n / i) = n`. Divisors always come in pairs like this, except when `i === n / i` (i.e. `n` is a perfect square and `i` is its square root) — that divisor should only be counted once.
- **Why the search only needs to go up to `√n`** — for every divisor pair `(i, n/i)`, one of the two is always `≤ √n` and the other `≥ √n`. Checking every `i` up to `√n` and recording both members of each pair you find covers every divisor without ever checking past `√n`.

## Approaches

### Approach 1 — brute force: check every number from 1 to n

**Intuition:** A divisor of `n` is any number that divides it with no remainder — the most direct way to find them all is to test every candidate from `1` to `n` and keep the ones that work.

**Solution (as implemented):**

```js
sumOfDivisorsApproach1(n) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    if (n % i === 0) {
      sum += i;
    }
  }
  return sum;
}
```

**Dry Run** (`n = 6`, Example 1):

| `i` | `6 % i === 0`? | `sum` after |
|---|---|---|
| 0 | `6 % 0` is `NaN`, and `NaN === 0` is `false` → no | `0` |
| 1 | yes | `1` |
| 2 | yes | `3` |
| 3 | yes | `6` |
| 4 | no | `6` |
| 5 | no | `6` |
| 6 | yes | `12` |

Return `12`. ✓ matches Example 1.

Note: the loop starts at `i = 0` instead of `i = 1`. That extra iteration is harmless — `n % 0` evaluates to `NaN` in JavaScript, and `NaN === 0` is always `false`, so `i = 0` never adds anything to `sum`. It's one wasted comparison, not a correctness bug.

**Bonus — array-based variant:** the repo also includes `sumOfDivisorsApproachWithNoArrays(n)`, which takes the same brute-force idea but collects every divisor into an array first, then sums it with `reduce`:

```js
sumOfDivisorsApproachWithNoArrays(n) {
  let findDivisor = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      findDivisor.push(i);
    }
  }
  return findDivisor.reduce((acc, curr) => acc + curr, 0);
}
```

**Dry Run** (`n = 6`, Example 1): `findDivisor` fills up as `[1, 2, 3, 6]` while `i` runs from `1` to `6`, then `reduce` folds it into `1 + 2 + 3 + 6 = 12`. Same result as the accumulator version, just staged through an intermediate array instead of adding directly into `sum` as each divisor is found.

### Approach 2 — optimized: search only up to √n, adding divisor pairs

**Intuition:** Divisors come in pairs that multiply to `n` — for `6`, that's `(1, 6)` and `(2, 3)`. Once `i` passes `√n`, every divisor pair has already been found from its smaller side, so continuing to check further is redundant. Loop `i` only up to `√n`, and whenever `i` divides `n`, add *both* `i` and its partner `n / i` — except when they're the same number (`n` is a perfect square), which should only be added once.

**Solution:**

```js
sumOfDivisorsApproach2(n) {
  let sum = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      sum += i;
      const pair = n / i;
      if (pair !== i) {
        sum += pair;
      }
    }
  }
  return sum;
}
```

**Dry Run** (`n = 6`, Example 1 — loop only runs while `i * i <= 6`, i.e. `i = 1, 2`):

| `i` | `i * i <= 6`? | `6 % i === 0`? | `pair = 6 / i` | `pair !== i`? | `sum` after |
|---|---|---|---|---|---|
| 1 | `1 <= 6` yes | yes | `6` | yes → add both | `1 + 6 = 7` |
| 2 | `4 <= 6` yes | yes | `3` | yes → add both | `7 + 2 + 3 = 12` |
| 3 | `9 <= 6` no | loop ends | | | |

Return `12`. ✓ matches Example 1 and Approach 1's result — found in 2 iterations instead of 6.

**Dry Run** (`n = 36`, a perfect square, to show the `pair !== i` guard in action):

At `i = 6`: `6 * 6 = 36 <= 36` (last iteration), `36 % 6 === 0`, `pair = 36 / 6 = 6`. Since `pair === i` (`6 === 6`), only `6` is added once, not twice — otherwise the divisor `6` would be double-counted.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (check 1 to n) | O(n) | O(1) | One check per number from 1 to n, regardless of how many actually divide `n`. |
| Brute force, array variant | O(n) | O(k) | Same `O(n)` checks, but stores the `k` divisors found in an array before reducing — same time complexity, extra space proportional to how many divisors `n` has. |
| Optimized (√n divisor pairs) | O(√n) | O(1) | The loop only runs while `i * i <= n`, i.e. up to `√n` iterations — each iteration that finds a divisor accounts for two divisors at once (the pair), except at most one perfect-square divisor. |

For large `n`, this is a dramatic difference: `n = 1,000,000` means 1,000,000 iterations for the brute-force version versus roughly 1,000 for the optimized one.

## Implementation Notes

All three methods (`sumOfDivisorsApproachWithNoArrays`, `sumOfDivisorsApproach1`, `sumOfDivisorsApproach2`) were implemented correctly — no bugs found. `sumOfDivisorsApproach1`'s loop starting at `i = 0` instead of `i = 1` is harmless rather than a bug: `n % 0` is `NaN` in JavaScript, and `NaN === 0` is always `false`, so that iteration never adds anything to `sum`. Verified against 9 cases — including `n = 1`, a prime (`7`, `997`), and a perfect square (`36`) — plus a direct cross-check that all three approaches agree on every case, all in `Sum_of_All_Divisors_of_a_Number.test.js`.

## Key Takeaway

Starting a divisor-search loop at `i = 0` doesn't break anything in JavaScript specifically because `n % 0` is `NaN` rather than throwing or evaluating to `0` — a language-specific detail worth knowing, since the same `i = 0` start in a language with different modulo-by-zero semantics (or a language that throws a division error) would behave very differently. The array-based variant is a good reminder that `O(n)` time doesn't automatically mean `O(1)` space — collecting results into a structure before reducing costs space proportional to how many results there are, even when the time complexity is unchanged.
