# Prime Number Check

**Difficulty:** Easy
**Topics:** Loops, Math, Number Theory
**File:** [`Prime_Number_Check.js`](./Prime_Number_Check.js)
**Tests:** [`Prime_Number_Check.test.js`](./Prime_Number_Check.test.js)

## Problem Statement

Given an integer `n`, return `true` if `n` is a prime number, or `false` otherwise. A prime number is a number greater than `1` that has exactly two positive divisors: `1` and itself.

### Example 1

```
Input:  n = 7
Output: true   (divisors: 1, 7)
```

### Example 2

```
Input:  n = 15
Output: false  (divisors: 1, 3, 5, 15)
```

### Example 3

```
Input:  n = 2
Output: true   (the only even prime)
```

### Example 4

```
Input:  n = 1
Output: false  (by definition, 1 is not prime — it has only one divisor)
```

### Constraints

- `n` is an integer and may be negative, zero, or positive.

## Use Case

Primality testing is one of the most reused building blocks in number theory and cryptography:

- **Cryptography** — RSA and other public-key cryptosystems depend on generating large prime numbers and on the (very different, much harder) problem of factoring large composite numbers; primality testing is the first step in generating those primes.
- **Hashing and data structures** — hash table sizes are frequently chosen to be prime to reduce collision clustering, which relies on being able to check (or generate) primes efficiently.
- **A direct callback to Sum of All Divisors** — this problem's optimized approach reuses the exact same `√n` divisor-pair reasoning from that problem: "does `n` have a divisor pair other than `(1, n)` within `√n`" is precisely the question a primality check answers.

## Concepts

- **Divisibility test** — `n % i === 0` checks whether `i` divides `n` with no remainder.
- **Definition edge cases** — numbers less than `2` (negative numbers, `0`, and `1`) are never prime, by definition, and need to be handled before any loop runs.
- **The `√n` bound for divisor search** — reused directly from Sum of All Divisors: if `n` has a divisor greater than `√n`, it must be paired with a corresponding divisor smaller than `√n`. So if no divisor is found up to `√n`, none exists at all — `n` must be prime.
- **Skipping even numbers after checking 2** — once `2` has been ruled out as a divisor, every other even number is guaranteed not to be a divisor either (any even number is divisible by `2`, so if `2` doesn't divide `n`, no even number can). This halves the remaining work.

## Approaches

### Approach 1 — brute force: check every number from 2 to n - 1

**Intuition:** The most direct reading of the definition — try every possible divisor from `2` up to (but not including) `n`, and if any of them divides evenly, `n` isn't prime.

**Solution:**

```js
isPrimeApproach1(n) {
  if (n < 2) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

**Dry Run** (`n = 7`, Example 1):

| `i` | `7 % i === 0`? | result so far |
|---|---|---|
| 2 | no | keep going |
| 3 | no | keep going |
| 4 | no | keep going |
| 5 | no | keep going |
| 6 | no | keep going |

Loop ends (`i` reached `n`) without finding a divisor. Return `true`. ✓ matches Example 1.

**Dry Run** (`n = 15`, Example 2):

| `i` | `15 % i === 0`? | result |
|---|---|---|
| 2 | no | keep going |
| 3 | yes | return `false` immediately |

Return `false`. ✓ matches Example 2 — no need to check `4` through `14` once a divisor is found.

### Approach 2 — optimized: search only up to √n, skip even numbers after 2

**Intuition:** Reusing the `√n` divisor-pair idea from Sum of All Divisors — any divisor of `n` greater than `√n` would have to pair with one smaller than `√n`, so it's enough to search up to `√n`. As a further shortcut, handle `2` as a special case, then skip every other even candidate, since none of them can possibly divide `n` if `2` doesn't.

**Solution:**

```js
isPrimeApproach2(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
```

**Dry Run** (`n = 7`, Example 1 — loop runs while `i * i <= 7`):

| Step | Check | Result |
|---|---|---|
| `n < 2`? | `7 < 2` → no | keep going |
| `n === 2`? | no | keep going |
| `n % 2 === 0`? | `7 % 2 = 1` → no | keep going |
| `i = 3`: `3 * 3 = 9 <= 7`? | no → loop never runs | |

Loop body never executes. Return `true`. ✓ matches Example 1 and Approach 1's result — found in effectively zero iterations instead of 5.

**Dry Run** (`n = 15`, Example 2):

| Step | Check | Result |
|---|---|---|
| `n % 2 === 0`? | `15 % 2 = 1` → no | keep going |
| `i = 3`: `3 * 3 = 9 <= 15`? yes | `15 % 3 === 0`? yes → return `false` | |

Return `false`. ✓ matches Example 2, found on the very first candidate checked.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (2 to n-1) | O(n) | O(1) | Up to `n - 2` divisibility checks in the worst case (when `n` is prime and no early exit happens). |
| Optimized (√n, skip evens) | O(√n) | O(1) | The loop only runs while `i * i <= n`, i.e. roughly `√n / 2` iterations after skipping even candidates — a dramatic improvement for large `n`. |

For `n = 1,000,000`, that's roughly 1,000,000 checks in the worst case for the brute-force version versus around 500 for the optimized one.

## Implementation Notes

`isPrimeApproach1` had a bug: the loop condition was `i <= n` instead of `i < n`, so `i` eventually reached `n` itself — and `n % n === 0` triggered `return false` on every single input, including actual primes like `2`, `3`, and `7`. Fixed by changing the bound to `i < n`, so the loop only checks divisors strictly smaller than `n`.

`isPrimeApproach2` was correct as submitted — no bugs found.

Verified against 17 cases — negative numbers, `0`, `1`, the smallest even and odd primes, perfect squares, and a large prime (`997`) — plus a direct cross-check that both approaches agree on every case, all in `Prime_Number_Check.test.js`.

## Key Takeaway

`n % n === 0` is always true, so any loop searching for divisors of `n` up to and including `n` itself will always "find" one — `n` is a divisor of itself, just not one that disqualifies primality. Loop bounds that are supposed to mean "every number smaller than n" need a strict `<`, not `<=`; this is the same class of off-by-one mistake as the `i <= n` vs `i < n` distinction, just easy to miss because `n % n` silently returns a "valid-looking" `0` instead of erroring.
