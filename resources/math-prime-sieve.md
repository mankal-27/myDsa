# Prime Sieve

## Why It Matters

"Is this number prime?" and "give me every prime up to N" sound like the same problem, but they call for genuinely different tools — and picking the wrong one is the difference between an instant answer and a program that never finishes. This repo's own [`Prime Number Check`](../DSA_WarmUp/5_Number_Theory/1_Prime_Number_Check/README.md) and [`Print All Primes Up to N`](../DSA_WarmUp/5_Number_Theory/2_Print_All_Primes_Up_to_N/README.md) problems are direct hands-on versions of the first two approaches covered here — this chapter fills in the theory behind why each one is shaped the way it is, plus a third technique neither of those problems needed yet.

## Approach 1: Trial Division (Checking One Number)

A number `m` is prime if it's greater than 1 and has no divisors other than 1 and itself. The direct way to check is trial division: test whether any number from `2` up to `m` divides `m` evenly.

The key optimization — already used in this repo's `Prime_Number_Check.js` — is that you never need to check past `√m`. Divisors of `m` always come in pairs that multiply to `m` (for `12`: `2×6`, `3×4`); if `m` had any divisor larger than `√m`, its paired partner would have to be *smaller* than `√m`, so it would already have been caught. No divisor below `√m` means none exists at all.

```js
function isPrime(m) {
  if (m < 2) return false;
  if (m === 2) return true;
  if (m % 2 === 0) return false;
  for (let i = 3; i * i <= m; i += 2) {
    if (m % i === 0) return false;
  }
  return true;
}
```

This costs `O(√m)` time and `O(1)` space — cheap for testing one number, or even a handful of numbers. It gets wasteful fast when you need primality for *every* number in a range, because each check restarts from scratch with no memory of previous checks.

## Approach 2: Sieve of Eratosthenes (Checking a Whole Range)

When the question is "give me every prime up to `n`," the Sieve of Eratosthenes beats repeated trial division by flipping the strategy: instead of asking "is this prime?" for each number individually, it starts by assuming everything is prime and crosses out composites in bulk.

1. Create a boolean array of size `n + 1`, all initialized to "prime" (true).
2. Starting from `p = 2`, if `p` is still marked prime, cross out every multiple of `p` starting at `p × p` (not `2p`) — `p², p²+p, p²+2p, ...`.
3. Move to the next number still marked prime, repeat.
4. Once `p × p > n`, stop — nothing left to cross out.

**Why start at `p × p`, not `2p`?** Every smaller multiple of `p` (like `2p`, `3p`, ...) already has a smaller prime factor and was already crossed out by an earlier, smaller `p`. For example, when processing `p = 5`: `10 = 2×5` was already crossed out by `2`, and `15 = 3×5` was already crossed out by `3` — the first genuinely *new* number `5` is responsible for is `25 = 5×5`.

```js
function sieveOfEratosthenes(n) {
  const isComposite = new Array(n + 1).fill(false);
  const primes = [];
  for (let p = 2; p * p <= n; p++) {
    if (!isComposite[p]) {
      for (let multiple = p * p; multiple <= n; multiple += p) {
        isComposite[multiple] = true;
      }
    }
  }
  for (let i = 2; i <= n; i++) {
    if (!isComposite[i]) primes.push(i);
  }
  return primes;
}
```

This repo's [`Print All Primes Up to N`](../DSA_WarmUp/5_Number_Theory/2_Print_All_Primes_Up_to_N/README.md) implements exactly this — and its documented bug (incrementing the inner loop by `1` instead of `p`) is a good illustration of how easy it is to accidentally degrade the sieve back into much slower territory.

### Worked Example: Sieving up to 30

`√30 ≈ 5.48`, so only `p = 2, 3, 5` ever start a crossing-out pass:

- `p = 2`: cross out `4, 6, 8, 10, ..., 30`.
- `p = 3`: start at `9` (`3×3`); cross out `9, 12, 15, ..., 30` (many already crossed out by `2`).
- `p = 5`: start at `25` (`5×5`); cross out `25, 30` (`30` already crossed out).
- `p = 7` would start at `49 > 30` — the sieve stops.

What survives: `2, 3, 5, 7, 11, 13, 17, 19, 23, 29` — every prime up to 30.

### Complexity

Each prime `p` contributes roughly `n / p` crossing-out operations. Summing `n/p` over all primes `p ≤ n` converges to `O(n log log n)` — very close to linear, and dramatically cheaper than running `O(√n)` trial division separately for every one of the `n` numbers (which would cost `O(n√n)` total). Space is `O(n)` for the boolean array.

## Approach 3: Smallest Prime Factor (SPF) Sieve

A variant of the same sieve answers a stronger question: not just "is `x` prime," but "what is `x`'s full prime factorization" — for potentially many different values of `x`, all bounded by the same `n`.

Instead of a boolean flag, build an array where `spf[x]` stores the *smallest* prime that divides `x`:

```js
function buildSpfSieve(n) {
  const spf = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) { // i has no smaller factor recorded yet -- it's prime
      for (let multiple = i; multiple <= n; multiple += i) {
        if (spf[multiple] === 0) spf[multiple] = i;
      }
    }
  }
  return spf;
}

function primeFactorization(x, spf) {
  const factors = [];
  while (x > 1) {
    factors.push(spf[x]);
    x = x / spf[x];
  }
  return factors;
}

const spf = buildSpfSieve(100);
primeFactorization(84, spf); // [2, 2, 3, 7]  -- 84 = 2^2 * 3 * 7
```

Building the SPF array still costs `O(n log log n)` — the same shape as the plain sieve — paid once. After that, factorizing any single number `x ≤ n` costs only `O(log x)`: each division by `spf[x]` at least halves `x` in the worst case (since the smallest prime factor is at most `√x`, or `x` is prime itself and the loop ends in one step), so the factor count is bounded by `log x`.

## Choosing Between the Three

| Approach | Setup cost | Cost per query | Best for |
|---|---|---|---|
| Trial Division | none | `O(√m)` | Checking one number, or very few, especially large/unbounded ones |
| Sieve of Eratosthenes | `O(n log log n)` | `O(1)` lookup | Knowing primality for *many* numbers up to a fixed bound `n` |
| SPF Sieve | `O(n log log n)` | `O(log x)` factorization | Full prime factorization for *many* numbers up to a shared bound `n` |

The pattern is the same trade-off seen throughout this repo's Arrays module: pay a one-time preprocessing cost to turn many expensive repeated queries into cheap ones. Trial division still wins when you only ever need one answer — building a sieve just to check whether a single large number is prime is pure overhead.

## Real-World Problems & Solutions

### 1. Filtering Candidate Numbers Before an Expensive Check

**Scenario:** A key-generation routine needs to find large prime candidates. Full primality testing on large numbers is expensive — most candidates are obviously composite (divisible by small primes) and shouldn't reach the expensive test at all.

```js
const smallPrimes = sieveOfEratosthenes(1000); // precomputed once

function quickReject(candidate) {
  return smallPrimes.some(p => candidate % p === 0 && candidate !== p);
}
```

Sieving the small primes once and trial-dividing each candidate by just those (instead of every integer up to `√candidate`) throws out the vast majority of composites almost instantly, so the expensive full primality test only runs on the numbers that survive this cheap filter — a real technique used ahead of expensive probabilistic primality tests in cryptographic key generation.

### 2. Counting Primes in a Range for a Puzzle Game

**Scenario:** A number-puzzle game needs to repeatedly answer "how many primes are there up to N?" for many different, changing values of N.

```js
function primeCountTable(maxN) {
  const primes = sieveOfEratosthenes(maxN);
  const countUpTo = new Array(maxN + 1).fill(0);
  let idx = 0;
  for (let i = 2; i <= maxN; i++) {
    if (idx < primes.length && primes[idx] === i) idx++;
    countUpTo[i] = idx;
  }
  return countUpTo;
}

const table = primeCountTable(30);
table[30]; // 10 -- ten primes at or below 30
table[10]; // 4  -- 2, 3, 5, 7
```

Sieving once and building a running-count table turns every subsequent "how many primes ≤ N" query into an `O(1)` array lookup — essential once the game needs to answer this repeatedly rather than once.

### 3. Bulk-Simplifying Many Fractions

**Scenario:** A spreadsheet tool needs to reduce hundreds of fractions to lowest terms, where the numerators and denominators share a common upper bound.

```js
const spfTable = buildSpfSieve(10000);

function primeFactorMultiset(x) {
  const factors = {};
  for (const p of primeFactorization(x, spfTable)) {
    factors[p] = (factors[p] || 0) + 1;
  }
  return factors;
}

primeFactorMultiset(360); // { '2': 3, '3': 2, '5': 1 }  -- 360 = 2^3 * 3^2 * 5
```

With the SPF sieve built once, factorizing each of the hundreds of numerator/denominator values costs only `O(log x)` instead of `O(√x)` trial division per number — the same pattern as [GCD and LCM](math-gcd-lcm.md)'s fraction-simplifying example, but scaled to many fractions sharing a common bound.

## Key Takeaway

The single most important idea in this chapter is the shift from "test one number" to "eliminate composites in bulk" — trial division treats every number as an isolated question, while the sieve exploits the fact that a composite's smallest factor was already known by the time you reach it. That's the same principle that makes hash maps beat repeated linear scans elsewhere in this repo: precompute once, query cheaply many times.
