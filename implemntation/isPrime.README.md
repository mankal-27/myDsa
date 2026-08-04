# Prime Sieve Functions

**Difficulty:** Medium
**Topics:** Math, Number Theory, Sieve of Eratosthenes
**File:** [`isPrime.js`](./isPrime.js)
**Tests:** [`isPrime.test.js`](./isPrime.test.js)
**Related Chapter:** [Prime Sieve](../resources/math-prime-sieve.md)

## Problem Statement

Implement four utilities covering all three approaches from the [Prime Sieve](../resources/math-prime-sieve.md) chapter:

1. `isPrime(n)` — trial division primality check, optimized with the 6k±1 pattern.
2. `countPrimes(n)` — Sieve of Eratosthenes: return the number of primes strictly less than `n`.
3. `buildSPF(n)` — build a Smallest Prime Factor sieve for every number up to `n`.
4. `factorize(x, spf)` — return the full prime factorization of `x`, using a precomputed `spf` array.

### Example 1

```
Input:  isPrime(17)
Output: true
```

### Example 2

```
Input:  countPrimes(10)
Output: 4        (2, 3, 5, 7 are the primes strictly less than 10)
```

### Example 3

```
Input:  spf = buildSPF(100)
        factorize(84, spf)
Output: [2, 2, 3, 7]        (84 = 2^2 * 3 * 7)
```

### Constraints

- `isPrime` and `countPrimes` expect non-negative integers.
- `buildSPF(n)` builds the sieve for all integers `0..n` inclusive.
- `factorize(x, spf)` requires `x <= n`, where `n` is the bound `spf` was built with.

## Use Case

This file is the hands-on version of all three techniques from the [Prime Sieve](../resources/math-prime-sieve.md) chapter, applied together rather than in isolation: `isPrime` for checking a single number cheaply, `countPrimes` for the classic "how many primes in this whole range" sieve (this is exactly LeetCode 204, Count Primes, referenced in that chapter), and `buildSPF`/`factorize` for the stronger "give me the full factorization, for many numbers, cheaply" tool — the same one-time-preprocessing-then-cheap-queries trade-off this repo has already seen with hash maps and frequency counting.

## Concepts

- **Trial division with the 6k±1 optimization** — beyond just stopping at `√n`, every prime greater than 3 is of the form `6k ± 1`, so checking only candidates `5, 7, 11, 13, 17, 19, ...` (stepping by 6 and checking `i` and `i+2`) skips roughly two-thirds of the candidates a naive `i++` loop would check.
- **Sieve of Eratosthenes** — mark composites in bulk across an entire range instead of testing each number individually.
- **Smallest Prime Factor (SPF) sieve** — a variant sieve that records, for every number, its smallest prime factor, enabling fast repeated factorization afterward.
- **Variable shadowing** — a local variable can have the same name as an outer-scope function, silently hiding it for the rest of that function's body; this is exactly the source of one of the bugs below.
- **Array indexing vs. function calls** — `arr[i]` (indexing) and `fn(i)` (calling) use different syntax for a reason; mixing them up only surfaces at runtime, and only if the wrong-typed value is actually called or indexed.

## Approaches

### `isPrime` — trial division with 6k±1 stepping

**Intuition:** Every integer greater than 3 can be written as `6k`, `6k+1`, `6k+2`, `6k+3`, `6k+4`, or `6k+5` — and `6k`, `6k+2`, `6k+4` are even, `6k+3` is divisible by 3, so the *only* candidates that can possibly be prime (beyond 2 and 3 themselves) are of the form `6k+1` or `6k+5` (equivalently `6k-1`). Checking `i` and `i+2` while stepping `i` by 6 covers exactly those candidates, up to `√n`.

**Solution:**

```js
function isPrime(n){
    if(n <= 1) return false;
    if(n <= 3) return true;
    if(n % 2 === 0 || n % 3 === 0) return false;
    for(let i = 5 ; i*i <= n ; i += 6){
        if(n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}
```

**Dry Run** (`isPrime(49)`): `49 > 3`, not divisible by 2 or 3. Loop: `i = 5`, `5*5 = 25 <= 49`, check `49 % 5` (4, no) and `49 % 7` (0 — yes!). Return `false`. ✓ `49 = 7 × 7` is not prime.

### `countPrimes` — Sieve of Eratosthenes

**Intuition:** Start by assuming every number from `2` to `n-1` is prime, then cross out multiples of each prime found, starting at `p*p` (smaller multiples were already crossed out by smaller primes). Whatever survives is prime.

**Solution (as fixed — see Implementation Notes):**

```js
function countPrimes(n){
    if(n <= 2) return 0;
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;

    for(let p = 2; p * p < n ; p++){
        if(isPrime[p]){
            for(let j = p * p; j < n ; j += p){
                isPrime[j] = false;
            }
        }
    }
    return isPrime.filter(Boolean).length;
}
```

**Dry Run** (`countPrimes(10)`, Example 2): sieve array indices `0..9`, `isPrime[0]=isPrime[1]=false`. `p=2`: `4 < 10`, `isPrime[2]` true → cross out `4, 6, 8`. `p=3`: `9 < 10`, `isPrime[3]` true → cross out `9`. `p=4`: `16 < 10` is false, loop stops. Surviving `true` entries: indices `2, 3, 5, 7` — four primes. ✓ matches Example 2.

### `buildSPF` / `factorize` — Smallest Prime Factor sieve

**Intuition:** Instead of a boolean "is composite" flag, `spf[i]` stores `i`'s smallest prime factor (initialized to `i` itself, meaning "no smaller factor found yet"). Once built, factorizing any `x` is just repeatedly dividing by `spf[x]` and looking up the quotient's `spf` again, until `x` reaches `1`.

**Solution (as fixed — see Implementation Notes):**

```js
function buildSPF(n){
    const spf = Array.from({ length: n + 1}, (_, i) => i);

    for(let p = 2 ; p * p <= n ; p++){
        if(spf[p] === p){
            for(let j = p * p ; j <=n; j += p){
                if(spf[j] === j){
                    spf[j] = p;
                }
            }
        }
    }
    return spf;
}

function factorize(x, spf){
    const factors = [];
    while( x > 1){
        factors.push(spf[x]);
        x = Math.floor(x / spf[x]);
    }
    return factors;
}
```

**Dry Run** (`factorize(84, spf)`, Example 3): `spf[84] = 2` → push `2`, `x = 84/2 = 42`. `spf[42] = 2` → push `2`, `x = 21`. `spf[21] = 3` → push `3`, `x = 7`. `spf[7] = 7` (7 is prime) → push `7`, `x = 1`. Loop stops. Return `[2, 2, 3, 7]`. ✓ matches Example 3 (`84 = 2² × 3 × 7`).

## Complexity

| Function | Time | Space | Why |
|---|---|---|---|
| `isPrime` | O(√n) | O(1) | The 6k±1 stepping still checks up to `√n`, just roughly a third as many candidates as checking every integer. |
| `countPrimes` | O(n log log n) | O(n) | Standard Sieve of Eratosthenes bound (see the [Prime Sieve](../resources/math-prime-sieve.md) chapter for the derivation). |
| `buildSPF` | O(n log log n) | O(n) | Same sieve shape as `countPrimes`, recording a prime instead of a boolean at each composite's first marking. |
| `factorize` | O(log x) | O(log x) | Each division by `spf[x]` reduces `x` by at least half in the worst case, so the factor count (and loop length) is bounded by `log x`. |

## Implementation Notes

Two real bugs were found and fixed, both confirmed by execution (both crashed immediately rather than producing a subtly wrong answer):

1. **`countPrimes` called `isPrime(p)` where it meant `isPrime[p]`.** Inside `countPrimes`, `const isPrime = new Array(n).fill(true)` declares a *local* array named `isPrime`, which shadows the outer `isPrime` function for the rest of `countPrimes`'s body — so `isPrime(p)`, which reads as "call the primality-check function," actually means "call this array as if it were a function." Running `countPrimes(10)` before the fix threw `TypeError: isPrime is not a function` immediately — not a wrong count, a hard crash on every input. The intent was always array indexing (checking whether index `p` is still marked prime in the local sieve), so the fix was `isPrime(p)` → `isPrime[p]`.

2. **`factorize` called `spf(x)` where it meant `spf[x]`.** `spf` is the array returned by `buildSPF`, and `Math.floor(x / spf(x))` tried to call that array as a function instead of indexing into it. This threw `TypeError: spf is not a function` on the very first factorization attempt — again a hard crash, not a silent wrong answer, since JavaScript treats calling a non-function value as an immediate `TypeError`. Fixed to `spf[x]`, matching the correct indexing already used one line above (`factors.push(spf[x])`).

Both bugs are the same shape: a value obtained via `[...]` (array indexing) was later referenced with `(...)` (a function call) instead, and in both cases a same-named function existed elsewhere in the file, making the mistake an easy one to type without JavaScript's own syntax catching it. `isPrime` (trial division) and `buildSPF` were correct as submitted. Verified in `isPrime.test.js` (32 cases), including `isPrime` checked against a reference implementation for every integer from 0 to 200, `countPrimes` checked against known prime-counting values up to 1000 (168 primes below 1000), and every `factorize` result checked by multiplying its factors back together to confirm they reconstruct the original number.

## Key Takeaway

Both bugs here would have been caught instantly by actually running the code once — `TypeError: ... is not a function` is about as loud a failure signal as JavaScript gives, which is exactly why "verify by execution, not by eye" catches this class of mistake so reliably: reading `isPrime(p)` in isolation looks completely reasonable (it's a real function, spelled correctly), and the bug is only visible once you know *which* `isPrime` is in scope at that point in the code. Whenever a local variable reuses the name of an outer function (or vice versa), a fast, no-cost habit is to give the local one a distinct name (`isPrimeSieve`, `sieve`, `composite`) — not because the shadowing is illegal, but because it removes the exact ambiguity that let this bug hide in plain sight.
