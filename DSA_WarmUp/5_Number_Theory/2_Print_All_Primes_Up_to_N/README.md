# Print All Primes Up to N

**Difficulty:** Medium
**Topics:** Loops, Math, Number Theory
**File:** [`Print_All_Primes_Up_to_N.js`](./Print_All_Primes_Up_to_N.js)
**Tests:** [`Print_All_Primes_Up_to_N.test.js`](./Print_All_Primes_Up_to_N.test.js)

## Problem Statement

Given an integer `n`, return an array of all prime numbers from `2` up to and including `n`, in ascending order. If `n < 2`, return an empty array (there are no primes to list).

### Example 1

```
Input:  n = 10
Output: [2, 3, 5, 7]
```

### Example 2

```
Input:  n = 20
Output: [2, 3, 5, 7, 11, 13, 17, 19]
```

### Example 3

```
Input:  n = 1
Output: []
```

### Example 4

```
Input:  n = 2
Output: [2]
```

### Constraints

- `n` is an integer and may be negative, zero, or positive.

## Use Case

This problem is the direct follow-up to Prime Number Check — instead of testing one number, it asks for *every* prime up to `n`, which changes the best strategy entirely:

- **Precomputing primes for repeated lookups** — many problems need to check primality of many numbers within a range (e.g. "how many primes are between 1 and 10,000?"). Sieving once up front and reusing the result is far cheaper than calling a single-number primality check `n` times.
- **The Sieve of Eratosthenes is one of the oldest known algorithms** — over 2,000 years old, and still the standard practical approach for generating primes in a bounded range, showing up in cryptography (prime generation), competitive programming, and number-theoretic research.
- **A concrete lesson in "don't call a per-item check n times when a bulk algorithm exists"** — running Prime Number Check's `isPrimeApproach2` once for every number from `2` to `n` looks efficient (each call is fast), but the sieve reorganizes the *entire computation* to eliminate almost all of that repeated work, which is a bigger structural win than optimizing each individual check.

## Concepts

- **Trial division per number** — reusing the `√n` primality check from Prime Number Check, applied to every candidate from `2` to `n`.
- **Sieve of Eratosthenes** — instead of testing each number independently, start from every known prime and mark off its multiples as composite; whatever's left unmarked is prime.
- **Marking multiples starting from `i * i`** — when sieving from a prime `i`, every multiple smaller than `i * i` (like `2*i`, `3*i`, ...) has already been marked off by a smaller prime factor, so the marking loop can safely start at `i * i` instead of `2 * i`.

## Approaches

### Approach 1 — brute force: trial-divide every number from 2 to n

**Intuition:** Check each candidate number from `2` to `n` independently — for each one, test whether any number up to its square root divides it, exactly like Prime Number Check's optimized approach, and collect the ones that pass.

**Solution:**

```js
printAllPrimesApproach1(n) {
  const primes = [];
  for (let num = 2; num <= n; num++) {
    if (isPrime(num)) {
      primes.push(num);
    }
  }
  return primes;

  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) return false;
    }
    return true;
  }
}
```

**Dry Run** (`n = 10`, Example 1):

| `num` | `isPrime(num)`? | `primes` after |
|---|---|---|
| 2 | yes | `[2]` |
| 3 | yes | `[2, 3]` |
| 4 | no (`4 % 2 === 0`) | `[2, 3]` |
| 5 | yes | `[2, 3, 5]` |
| 6 | no | `[2, 3, 5]` |
| 7 | yes | `[2, 3, 5, 7]` |
| 8 | no | `[2, 3, 5, 7]` |
| 9 | no (`9 % 3 === 0`) | `[2, 3, 5, 7]` |
| 10 | no | `[2, 3, 5, 7]` |

Return `[2, 3, 5, 7]`. ✓ matches Example 1.

### Approach 2 — optimized: Sieve of Eratosthenes

**Intuition:** Instead of testing each number in isolation, work forward: start with `2`, mark every multiple of `2` as composite, move to the next unmarked number (`3`), mark all its multiples, and so on. Anything still unmarked once you're done must be prime, since it was never a multiple of any smaller prime.

**Solution:**

```js
printAllPrimesApproach2(n) {
  if (n < 2) return [];
  const isComposite = new Array(n + 1).fill(false);
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]) {
      primes.push(i);
      for (let j = i * i; j <= n; j += i) {
        isComposite[j] = true;
      }
    }
  }
  return primes;
}
```

**Dry Run** (`n = 10`, Example 1):

| `i` | `isComposite[i]`? | action | `isComposite` marks added |
|---|---|---|---|
| 2 | false | push `2`; mark multiples from `2*2=4` | `4, 6, 8, 10` |
| 3 | false | push `3`; mark multiples from `3*3=9` | `9` |
| 4 | true (marked at `i=2`) | skip | — |
| 5 | false | push `5`; `5*5=25 > 10`, no marking needed | — |
| 6 | true | skip | — |
| 7 | false | push `7`; `7*7=49 > 10`, no marking needed | — |
| 8 | true | skip | — |
| 9 | true (marked at `i=3`) | skip | — |
| 10 | true | skip | — |

Return `[2, 3, 5, 7]`. ✓ matches Example 1 and Approach 1's result — every composite was marked by a smaller prime before it was ever reached, so no trial division was needed at all.

**Why start marking at `i * i`:** any multiple of `i` smaller than `i * i` (like `2i, 3i, ..., (i-1)i`) has a factor smaller than `i` and was already marked off when that smaller factor was processed. Starting at `i * i` skips redundant marking work.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (trial division per number) | O(n√n) | O(1) extra (excluding output) | Each of the `n` candidates costs up to `O(√num)` to test, roughly `O(n√n)` total. |
| Sieve of Eratosthenes | O(n log log n) | O(n) | Marking multiples of each prime costs `n/2 + n/3 + n/5 + ... ≈ n · log log n` total across all primes — the classic sieve bound — at the cost of an `O(n)` boolean array. |

For `n = 100,000`, the sieve is dramatically faster than repeated trial division, at the cost of allocating an `O(n)`-sized array up front — a clear example of trading space for a large time win.

## Implementation Notes

`printAllPrimesApproach2` (the sieve) had a bug: the inner marking loop was `for (let j = i*i; j <= n; j++)` — incrementing `j` by `1` instead of by `i`. That marks *every* number from `i*i` to `n` as composite, not just the multiples of `i`, so as soon as `i = 2` ran, every number from `4` onward got wiped out as "composite," including actual primes like `5`, `7`, `11`, and beyond (`printAllPrimesApproach2(100)` returned only `[2, 3]` before the fix). Fixed by changing the step to `j += i`, so only true multiples of `i` get marked.

`printAllPrimesApproach1` (trial division) was correct as submitted — no bugs found.

Verified against 10 cases — negative numbers, `0`, `1`, small primes, and ranges up to `n = 1000` — plus a direct cross-check that both approaches agree on the full prime list up to `1000`, all in `Print_All_Primes_Up_to_N.test.js`.

## Key Takeaway

A sieve's correctness lives entirely in its step size — `j += i` is what makes the loop mark *multiples of i* rather than *every number after i²*. It's an easy typo to make (`j++` looks so natural after writing dozens of other loops in this repo that increment by 1), and one that's easy to miss by eye, since the sieve still runs without errors and still returns *some* array — just the wrong one. This is exactly the kind of bug that a test comparing against a known reference (brute-force trial division, in this case) catches immediately, where eyeballing the code might not.
