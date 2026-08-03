# Modular Arithmetic Functions

**Difficulty:** Easy–Medium
**Topics:** Math, Modular Arithmetic, Number Theory
**File:** [`mod.js`](./mod.js)
**Tests:** [`mod.test.js`](./mod.test.js)
**Related Chapter:** [Modular Arithmetic](../resources/math-modular-arithmetic.md)

## Problem Statement

Implement three utilities built on the modular-arithmetic identities from the [Modular Arithmetic](../resources/math-modular-arithmetic.md) chapter, all operating on `BigInt` values:

1. `power(base, exp, mod)` — compute `(base^exp) % mod` using binary exponentiation, without ever forming the full `base^exp` value.
2. `modInverse(a, mod)` — compute the modular multiplicative inverse of `a` under `mod` (i.e. the value `x` such that `(a * x) % mod === 1`), assuming `mod` is prime.
3. `modSubstract(a, b, mod)` — compute `(a - b) % mod`, always returning a non-negative result even when `a - b` is negative.

### Example 1

```
Input:  power(2n, 10n, 1000n)
Output: 24n        (2^10 = 1024, 1024 % 1000 = 24)
```

### Example 2

```
Input:  power(7n, 500n, 13n)
Output: 3n
```

### Example 3

```
Input:  a = 5n, mod = 1000000007n (MOD)
        inv = modInverse(a, mod)
Check:  (a * inv) % mod === 1n
```

### Example 4

```
Input:  modSubstract(3n, 8n, 5n)
Output: 0n        (3 - 8 = -5, which wraps to 0 mod 5)
```

### Example 5

```
Input:  modSubstract(1n, 2n, 5n)
Output: 4n        (1 - 2 = -1, which wraps to 4 mod 5)
```

### Constraints

- All arguments are `BigInt`.
- `mod` must be a positive `BigInt`; `modInverse` additionally requires `mod` to be **prime**.
- `power` and `modSubstract` are defined for `exp >= 0n` and any `a`, `b`.

## Use Case

- **`power`** is the exact technique from [Matrix Exponentiation](../resources/math-matrix-exponentiation.md)'s "fast exponentiation of numbers" section, combined with the mod-early-and-often habit from the Modular Arithmetic chapter — it's the standard building block behind any "compute a huge power, but only the remainder matters" problem (cryptographic-style computations, combinatorics answers given "mod 10^9 + 7").
- **`modInverse`** exists because division doesn't distribute over modulo the way addition, subtraction, and multiplication do — "dividing by `a` under a modulus" is instead defined as "multiplying by `a`'s modular inverse." Using `power(a, mod-2, mod)` to compute it is Fermat's Little Theorem in action: for a prime `mod`, `a^(mod-1) ≡ 1 (mod mod)`, so `a^(mod-2)` is exactly `a`'s inverse.
- **`modSubstract`** is the missing piece from the chapter's `modAdd`/`modMul` — subtraction is the one operation where a naive `(a - b) % mod` can go negative in JavaScript (per the chapter's documented `%` sign-of-dividend gotcha), so it needs the explicit `+ mod` guard.

## Concepts

- **Binary exponentiation (exponentiation by squaring)** — halving the exponent each iteration instead of multiplying `exp` times, bringing `O(exp)` down to `O(log(exp))`.
- **Reducing modulo at every step** — squaring `base` and immediately taking `% mod` keeps every intermediate value bounded by roughly `mod²`, instead of letting `base^exp` grow to hundreds of digits.
- **Fermat's Little Theorem** — for prime `mod` and `a` not divisible by `mod`, `a^(mod-1) ≡ 1 (mod mod)`; rearranging gives `a^(mod-2)` as `a`'s modular inverse.
- **BigInt bitwise operations** — `exp & 1n` reads the lowest bit to decide odd/even, and `exp >>= 1n` halves it, exactly mirroring the plain-number `exp % 2` / `Math.floor(exp / 2)` pattern from the Modular Arithmetic chapter, but using bit operations directly on `BigInt`.

## Approaches

### `power` — binary exponentiation with modulus reduction

**Intuition:** Reusing the base-squaring trick from fast exponentiation, but reducing `% mod` after every multiplication instead of once at the end — this keeps the numbers small throughout and avoids ever needing more precision than `BigInt` naturally provides.

**Solution:**

```js
function power(base, exp, mod){
    let result = 1n;
    base = base % mod;

    while(exp > 0n){
        if(exp & 1n){ //If current bit is 1
            result = (result * base) % mod;
        }
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}
```

**Dry Run** (`power(7n, 500n, 13n)`, Example 2 — tracking `exp` in binary, `500 = 111110100₂`):

| Step | `exp` (before shift) | lowest bit | `result` updates? | `base` after squaring |
|---|---|---|---|---|
| 1 | 500 | 0 | no | `7² % 13 = 10` |
| 2 | 250 | 0 | no | `10² % 13 = 9` |
| 3 | 125 | 1 | `result = 1×9 % 13 = 9` | `9² % 13 = 3` |
| 4 | 62 | 0 | no | `3² % 13 = 9` |
| 5 | 31 | 1 | `result = 9×9 % 13 = 3` | `9² % 13 = 3` |
| 6 | 15 | 1 | `result = 3×3 % 13 = 9` | `3² % 13 = 9` |
| 7 | 7 | 1 | `result = 9×9 % 13 = 3` | `9² % 13 = 3` |
| 8 | 3 | 1 | `result = 3×3 % 13 = 9` | `3² % 13 = 9` |
| 9 | 1 | 1 | `result = 9×9 % 13 = 3` | (loop ends, `exp` becomes 0) |

Return `3n`. ✓ matches Example 2.

### `modInverse` — Fermat's Little Theorem via `power`

**Intuition:** For prime `mod`, Fermat's Little Theorem guarantees `a^(mod-1) ≡ 1 (mod mod)`. Splitting the exponent as `a^(mod-2) × a`, the value `a^(mod-2) mod mod` must be exactly the number that multiplies `a` back to `1` — the modular inverse — so it can be computed with the same `power` function already written.

**Solution:**

```js
function modInverse(a, mod){
    return power(a, mod-2n, mod);
}
```

**Dry Run** (`modInverse(2n, 13n)`): computes `power(2n, 11n, 13n) = 7n`, and indeed `(2 × 7) % 13 = 14 % 13 = 1`. ✓ `7` is `2`'s modular inverse under `13`.

### `modSubstract` — subtract, then guard against going negative

**Intuition:** `(a % mod) - (b % mod)` can land below zero even when `a` and `b` are both non-negative (e.g. `3 - 8 = -5`). Adding `mod` before the final `% mod` shifts any negative result back into the valid `[0, mod)` range without changing an already-non-negative result.

**Solution:**

```js
function modSubstract(a,b,mod){
    return ((a % mod) - (b % mod) + mod) % mod;
}
```

**Dry Run** (`modSubstract(1n, 2n, 5n)`, Example 5): `(1 % 5) - (2 % 5) + 5 = 1 - 2 + 5 = 4`, then `4 % 5 = 4`. ✓ matches Example 5.

## Complexity

| Function | Time | Space | Why |
|---|---|---|---|
| `power` | O(log(exp)) | O(1) | Each iteration halves `exp` via `>>= 1n`, so the loop runs `⌊log2(exp)⌋ + 1` times. |
| `modInverse` | O(log(mod)) | O(1) | Delegates entirely to `power` with an exponent of `mod - 2`. |
| `modSubstract` | O(1) | O(1) | A fixed number of arithmetic operations, independent of the size of `a`, `b`, or `mod`. |

## Implementation Notes

All three functions were verified: `power` was traced by hand against a step-by-step binary-exponentiation dry run and cross-checked with known modular-exponentiation results (including the `MOD = 10^9 + 7` scale this repo's [Modular Arithmetic](../resources/math-modular-arithmetic.md) chapter specifically calls out as needing `BigInt`, which this implementation correctly uses throughout); `modInverse` was verified by confirming `(a * modInverse(a, MOD)) % MOD === 1n` across several values of `a`, including one close to `MOD` itself; `modSubstract` was verified against cases where the raw subtraction does and doesn't go negative. **No bugs found** — the implementation was correct as submitted, including the `exp & 1n` / `exp >>= 1n` `BigInt` bitwise pattern, which is easy to get wrong (e.g. mixing in `Number` operators, which throw when mixed with `BigInt`) but was used correctly throughout.

One behavior worth documenting rather than "fixing": `modInverse(0n, mod)` returns `0n` rather than throwing, even though `0` has no modular inverse (there's no `x` with `0 * x ≡ 1`). The function has no explicit guard for this, so it silently returns a value that isn't a true inverse. This is captured as a documented test case rather than changed, since `mod.js` doesn't specify intended behavior for `a = 0` — worth keeping in mind if this function is ever called with an `a` that isn't known to be non-zero.

Verified in `mod.test.js` — 19 cases across all three functions, including the `MOD`-scale `power`/`modInverse` cases and the documented `a = 0` edge case for `modInverse`.

## Key Takeaway

`power`'s "reduce modulo at every step, not just at the end" is the one habit that makes every other function in this file (and this repo's [Modular Arithmetic](../resources/math-modular-arithmetic.md) chapter) actually work at realistic scale — without it, `modInverse`'s `a^(mod-2)` would need to compute a number with hundreds of millions of digits before ever taking a mod. The same lesson generalizes beyond modular arithmetic: whenever an operation is going to be reduced/filtered/bounded eventually, doing that reduction as early as possible — inside the loop, not after it — is usually what keeps an algorithm from quietly becoming impractical.
