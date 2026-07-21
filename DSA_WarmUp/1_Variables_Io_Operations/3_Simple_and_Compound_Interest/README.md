# Simple Interest and Compound Interest

**Difficulty:** Easy
**Topics:** Variables, Operators, Math, Functions (default parameters)
**File:** [`Simple_and_Compound_Interest.js`](./Simple_and_Compound_Interest.js)
**Tests:** [`Simple_and_Compound_Interest.test.js`](./Simple_and_Compound_Interest.test.js)

## Problem Statement

Given a principal amount `principal`, an annual interest `rate` (as a percentage), and a duration `time` (in years), compute:

1. **Simple Interest** — interest calculated only on the original principal.
2. **Compound Interest** — interest calculated on the principal plus previously accumulated interest, compounded `compoundsPerYear` times per year (defaults to 1, i.e. annually).

Both results are rounded to 2 decimal places.

Formulas:

```
SI = (P * R * T) / 100

A  = P * (1 + (R / n) / 100) ^ (n * T)
CI = A - P
```

where `P` = principal, `R` = annual rate (%), `T` = time in years, `n` = number of times interest compounds per year.

### Example 1

```
Input:  principal = 1000, rate = 5, time = 2
simpleInterest   -> 100
compoundInterest -> 102.5   (compounded annually)
```

### Example 2

```
Input:  principal = 1000, rate = 8, time = 1, compoundsPerYear = 4
compoundInterest -> 82.43   (compounded quarterly)
```

### Example 3

```
Input:  principal = 1000, rate = 5, time = 1
simpleInterest   -> 50
compoundInterest -> 50   (SI and CI always match at T = 1 with annual compounding)
```

### Constraints

- `principal >= 0`, `rate >= 0`, `time >= 0`.
- `compoundsPerYear >= 1` (defaults to `1` when omitted).
- Result is rounded to 2 decimal places.

## Use Case

This pair of formulas is the foundation of virtually all real-world financial calculations, and it's also a clean, concrete example of **linear vs. exponential growth** — a distinction that shows up constantly once you move from warm-ups into actual algorithm analysis:

- **Banking & loans** — fixed deposits, savings accounts, and most loan/EMI calculators are built on these two formulas (or variations of them).
- **Linear vs. exponential growth intuition** — simple interest grows linearly with time (`SI ∝ T`), while compound interest grows exponentially (`CI` involves `T` in an exponent). Seeing this side by side with real numbers builds the same intuition needed to recognize `O(n)` vs `O(2^n)` growth later on.
- **Population/price growth modeling** — the compound interest formula is structurally identical to any "grows by X% per period" model (population growth, viral spread approximations, price inflation).
- **Default parameters & configurability** — `compoundsPerYear` is a great small example of designing a function that has a sensible default (annual) but stays flexible for other cases (quarterly, monthly, daily).

## Concepts

- **Variables** — holding intermediate values (`ratePerPeriod`, `numPeriods`, `amount`) to keep a multi-step formula readable instead of one dense expression.
- **Operators** — arithmetic operator precedence (`/`, `*`, `+`) and how parentheses control formula correctness.
- **Math** — `Math.pow(base, exponent)` for exponentiation, and the `Math.round(x * 100) / 100` pattern for 2-decimal rounding (same idiom used in the Temperature Converter problem).
- **Functions** — default parameter values (`compoundsPerYear = 1`) so callers can omit an argument and get sensible behavior.

## Code Review Notes (on the first draft)

Two things came up reviewing the initial solution, fixed in the final version below:

1. **`Math.floor` instead of `Math.round` in `simpleInterest`.** `Math.floor(x * 100) / 100` always truncates toward zero, which silently under-reports interest whenever the true value has a third decimal digit ≥ 5. Example: `principal = 100, rate = 6.005, time = 1` → the mathematically correct rounded value is `6.01`, but flooring gives `6`. Standard "round to N decimals" needs `Math.round`, not `Math.floor` — this is now covered by a dedicated test case.
2. **`finalSolution()` returned unbound function references, not computed values.** `return [this.simpleInterest, this.compoundInterest]` hands back the *functions themselves*, not the result of calling them — so `finalSolution()` never actually computed anything; the caller would have to invoke the returned functions manually. Replaced with `solve(principal, rate, time, compoundsPerYear)`, which calls both methods and returns `{ simpleInterest, compoundInterest }` directly.

## Approaches

### Simple Interest

**Brute force**

**Intuition:** Simple interest is defined as "the same flat amount of interest, every year." The most literal way to compute that is to actually add that flat amount once per year, in a loop — you're simulating the definition directly instead of jumping to the shortcut formula.

**Solution:**

```js
simpleInterestBruteForce(principal, rate, time) {
  let totalInterest = 0;
  for (let year = 1; year <= time; year++) {
    totalInterest += (principal * rate) / 100;
  }
  return Math.round(totalInterest * 100) / 100;
}
```

**Dry Run** (`principal = 1000, rate = 5, time = 2`, Example 1):

| Iteration (`year`) | `principal * rate / 100` added | `totalInterest` after |
|---|---|---|
| 1 | `1000 * 5 / 100 = 50` | `50` |
| 2 | `1000 * 5 / 100 = 50` | `100` |

Loop ends (`year = 3 > time = 2`). Return `Math.round(100 * 100) / 100 = 100`. ✓ matches Example 1.

**Optimized**

**Intuition:** The brute-force loop adds the exact same amount (`principal * rate / 100`) on every single iteration — nothing changes between years. Whenever a loop adds the same fixed value `T` times, that's just multiplication in disguise: `amount + amount + ... (T times) = amount * T`.

**Solution:**

```js
simpleInterest(principal, rate, time) {
  const si = (principal * rate * time) / 100;
  return Math.round(si * 100) / 100;
}
```

**Dry Run** (`principal = 1000, rate = 5, time = 2`):

| Step | Expression | Value |
|---|---|---|
| 1 | `principal * rate * time` | `1000 * 5 * 2 = 10000` |
| 2 | `10000 / 100` | `100` |
| 3 | `Math.round(100 * 100) / 100` | `100` |

Return `100`. ✓ matches Example 1, in one step instead of a 2-iteration loop.

### Compound Interest

**Brute force**

**Intuition:** Compound interest is defined as "each period's interest gets added to the principal before the next period's interest is calculated" — so the most direct translation of that definition is a loop that actually grows the amount, period by period, exactly as the definition describes.

**Solution:**

```js
compoundInterestBruteForce(principal, rate, time, compoundsPerYear = 1) {
  let amount = principal;
  const ratePerPeriod = (rate / compoundsPerYear) / 100;
  const numPeriods = compoundsPerYear * time;
  for (let i = 0; i < numPeriods; i++) {
    amount += amount * ratePerPeriod;
  }
  return Math.round((amount - principal) * 100) / 100;
}
```

**Dry Run** (`principal = 1000, rate = 5, time = 2, compoundsPerYear = 1`, Example 1):

`ratePerPeriod = 5 / 1 / 100 = 0.05`, `numPeriods = 1 * 2 = 2`.

| Iteration (`i`) | `amount * ratePerPeriod` added | `amount` after |
|---|---|---|
| start | — | `1000` |
| 0 | `1000 * 0.05 = 50` | `1050` |
| 1 | `1050 * 0.05 = 52.5` | `1102.5` |

Loop ends (`i = 2` = `numPeriods`). Return `Math.round((1102.5 - 1000) * 100) / 100 = 102.5`. ✓ matches Example 1. Notice period 2 adds `52.5`, not `50` — that's the "interest on interest" that makes this compound rather than simple.

**Optimized**

**Intuition:** Look at what the loop is really doing: `amount *= (1 + ratePerPeriod)` on every iteration, `numPeriods` times in a row. Multiplying the same factor by itself repeatedly is exactly what exponentiation *is* — so the whole loop collapses into `amount * (1 + ratePerPeriod) ^ numPeriods`.

**Solution:**

```js
compoundInterest(principal, rate, time, compoundsPerYear = 1) {
  const ratePerPeriod = (rate / compoundsPerYear) / 100;
  const numPeriods = compoundsPerYear * time;
  const amount = principal * Math.pow(1 + ratePerPeriod, numPeriods);
  const ci = amount - principal;
  return Math.round(ci * 100) / 100;
}
```

**Dry Run** (`principal = 1000, rate = 5, time = 2, compoundsPerYear = 1`):

| Step | Expression | Value |
|---|---|---|
| 1 | `ratePerPeriod = 5 / 1 / 100` | `0.05` |
| 2 | `numPeriods = 1 * 2` | `2` |
| 3 | `Math.pow(1.05, 2)` | `1.1025` |
| 4 | `amount = 1000 * 1.1025` | `1102.5` |
| 5 | `ci = 1102.5 - 1000` | `102.5` |
| 6 | `Math.round(102.5 * 100) / 100` | `102.5` |

Return `102.5`. ✓ matches Example 1 and the brute-force result above, in one call instead of a 2-iteration loop.

**Bonus — manual fast exponentiation** (in case `Math.pow` is off the table, e.g. an interview asks you to implement power yourself)

**Intuition:** Instead of multiplying `base` by itself `exp` times one at a time (that's `compoundInterestBruteForce`'s job), notice that `base^exp = (base^(exp/2))^2` — you can get the answer for a *full* exponent by solving for *half* the exponent and squaring it. Each recursive call halves the problem size, so the number of calls needed grows logarithmically instead of linearly. This is the same binary-exponentiation technique used for modular exponentiation and matrix power in more advanced problems.

**Solution:**

```js
compoundInterestFastPower(principal, rate, time, compoundsPerYear = 1) {
  const ratePerPeriod = (rate / compoundsPerYear) / 100;
  const numPeriods = compoundsPerYear * time;

  const fastPow = (base, exp) => {
    if (exp === 0) return 1;
    const half = fastPow(base, Math.floor(exp / 2));
    const halfSquared = half * half;
    return exp % 2 === 0 ? halfSquared : halfSquared * base;
  };

  const amount = principal * fastPow(1 + ratePerPeriod, numPeriods);
  return Math.round((amount - principal) * 100) / 100;
}
```

**Dry Run** — tracing just `fastPow(1.05, 2)` from the example above (`base = 1.05, exp = 2`):

| Call | `exp` | Recurses into | Returns |
|---|---|---|---|
| `fastPow(1.05, 2)` | `2` (even) | `fastPow(1.05, 1)` | `half² = 1.05² = 1.1025` |
| `fastPow(1.05, 1)` | `1` (odd) | `fastPow(1.05, 0)` | `half² * base = 1 * 1.05 = 1.05` |
| `fastPow(1.05, 0)` | `0` (base case) | — | `1` |

Unwinding: `fastPow(1.05, 0) = 1` → `fastPow(1.05, 1) = 1² * 1.05 = 1.05` → `fastPow(1.05, 2) = 1.05² = 1.1025`. Same `1.1025` as `Math.pow(1.05, 2)` above, reached in 3 recursive calls instead of 2 loop iterations — the gap grows dramatically for large exponents (e.g. `numPeriods = 1000` takes about 10 calls here vs. 1000 loop iterations in the brute-force version).

## Complexity

| Method | Time | Space | Why |
|---|---|---|---|
| `simpleInterestBruteForce` | O(T) | O(1) | One loop iteration per year. |
| `simpleInterest` | O(1) | O(1) | Linear growth collapses to a single multiplication — no loop needed. |
| `compoundInterestBruteForce` | O(n·T) | O(1) | One loop iteration per compounding period (`n` periods/year × `T` years). |
| `compoundInterest` | O(1)* | O(1) | Delegates to the engine's `Math.pow`. *Treated as constant time for fixed-size numeric input; internally comparable to the fast-power technique below. |
| `compoundInterestFastPower` | O(log(n·T)) | O(log(n·T)) | Binary exponentiation halves the exponent each recursive call instead of looping once per period — the same jump from O(n) to O(log n) you'll see again in binary search and divide-and-conquer problems. |

The brute-force → optimized jump here is the same one you'll see repeatedly in DSA: a loop that does the same multiplicative operation `n` times can often be replaced by exponentiation, cutting O(n) down to O(1) (or O(log n) if you implement the power function yourself instead of relying on a language built-in).

## Key Takeaway

Same numbers, same time period, but two very different growth curves: simple interest is a straight line, compound interest is a curve that gets steeper the longer it runs. And the brute-force-to-optimized jump for compound interest — replacing a "multiply by the same factor, N times" loop with one exponentiation call — is the exact same pattern behind binary exponentiation, a technique that shows up again in modular arithmetic, matrix exponentiation, and fast power problems throughout DSA.
