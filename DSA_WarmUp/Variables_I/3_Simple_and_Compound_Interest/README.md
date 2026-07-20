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

**Brute force** — simulate it year by year, adding the same flat interest amount each time. Only works for whole-number `time` (you can't loop 2.5 times):

```js
simpleInterestBruteForce(principal, rate, time) {
  let totalInterest = 0;
  for (let year = 1; year <= time; year++) {
    totalInterest += (principal * rate) / 100;
  }
  return Math.round(totalInterest * 100) / 100;
}
```

**Optimized** — simple interest grows *linearly*, so summing the same amount `T` times is just `amount * T`. No loop needed:

```js
simpleInterest(principal, rate, time) {
  const si = (principal * rate * time) / 100;
  return Math.round(si * 100) / 100;
}
```

### Compound Interest

**Brute force** — simulate period by period, re-applying the interest rate to the *growing* amount each time. This is literally how compounding works in real life:

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

**Optimized** — repeated multiplication by the same factor *is* exponentiation. Collapse the whole loop into one call:

```js
compoundInterest(principal, rate, time, compoundsPerYear = 1) {
  const ratePerPeriod = (rate / compoundsPerYear) / 100;
  const numPeriods = compoundsPerYear * time;
  const amount = principal * Math.pow(1 + ratePerPeriod, numPeriods);
  const ci = amount - principal;
  return Math.round(ci * 100) / 100;
}
```

**Bonus — manual fast exponentiation** (in case `Math.pow` is off the table, e.g. an interview asks you to implement power yourself). Same binary-exponentiation technique used for modular exponentiation and matrix power in more advanced problems:

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
