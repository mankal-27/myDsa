# Leap Year Check

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Loops
**File:** [`Leap_Year_Check.js`](./Leap_Year_Check.js)
**Tests:** [`Leap_Year_Check.test.js`](./Leap_Year_Check.test.js)

## Problem Statement

Given an integer `year`, return `true` if it's a leap year, or `false` otherwise.

A year is a leap year if:

- it's divisible by 4, **except**
- century years (divisible by 100) are **not** leap years, **unless**
- they're also divisible by 400 (in which case they are).

### Example 1

```
Input:  year = 2024
Output: true   (divisible by 4, not a century year)
```

### Example 2

```
Input:  year = 1900
Output: false  (divisible by 100, but not by 400)
```

### Example 3

```
Input:  year = 2000
Output: true   (divisible by 100 AND by 400)
```

### Example 4

```
Input:  year = 2023
Output: false  (not divisible by 4)
```

### Constraints

- `year` is an integer (may be any value the Gregorian calendar rule applies to).

## Use Case

The leap year rule is a real, widely-implemented piece of business logic — not just a toy problem:

- **Date/calendar libraries** — every date library (and every database's date type) needs this exact three-tier rule to correctly compute days-in-February, day-of-year, and date arithmetic.
- **Nested exception rules** — "divisible by 4, except divisible by 100, except-the-exception divisible by 400" is a great small example of a rule with an exception *to* an exception. Recognizing and correctly encoding "except when" logic (rather than getting the precedence backwards) is a skill that generalizes to permissions systems, tax rules, discount logic — anywhere business rules have carve-outs.
- **Divisibility checks as a reusable building block** — this problem reuses the exact same "is `a` divisible by `b`" question from the Quotient & Remainder problem, just applied three times with different divisors and combined with boolean logic.

## Concepts

- **Boolean logic composition** — combining three divisibility checks with `&&` and `||` in the right precedence to encode "except" and "unless" correctly. Getting the parentheses wrong here is the single most common way to get this problem wrong.
- **Modulo (`%`)** — the standard, idiomatic way to check divisibility in JS.
- **Loops (brute-force approach)** — reusing the repeated-subtraction divisibility check from the Quotient & Remainder problem, applied here to three different divisors.

## Approaches

### Approach 1 — Brute Force: divisibility via repeated subtraction

**Intuition:** "Is `year` divisible by `4`" can be answered by repeatedly subtracting `4` from `year` until less than `4` remains — if exactly `0` is left, it divided evenly. This is the same technique from the Quotient & Remainder problem, reused here as a building block for three separate divisibility checks (by 4, by 100, by 400), which then get combined with the leap year rule's boolean logic.

**Solution:**

```js
isDivisibleBruteForce(n, divisor) {
  let remaining = Math.abs(n);
  while (remaining >= divisor) {
    remaining -= divisor;
  }
  return remaining === 0;
}

isLeapYearBruteForce(year) {
  const divisibleBy4 = this.isDivisibleBruteForce(year, 4);
  const divisibleBy100 = this.isDivisibleBruteForce(year, 100);
  const divisibleBy400 = this.isDivisibleBruteForce(year, 400);
  return divisibleBy4 && (!divisibleBy100 || divisibleBy400);
}
```

Correct, but each divisibility check costs a loop — and `isDivisibleBruteForce(year, 4)` alone takes roughly `year / 4` iterations, which adds up fast for realistic year values (over 500 iterations just to check `2024 % 4`).

**Dry Run** (a smaller made-up example, `isDivisibleBruteForce(12, 4)`, to keep the trace short — real years would take dozens to hundreds of iterations):

| Iteration | `remaining >= 4`? | `remaining -= 4` |
|---|---|---|
| 1 | `12 >= 4` → yes | `remaining = 8` |
| 2 | `8 >= 4` → yes | `remaining = 4` |
| 3 | `4 >= 4` → yes | `remaining = 0` |
| 4 | `0 >= 4` → no | loop ends |

`remaining === 0` → `true`. So `12` is divisible by `4`.

Applying that three times for `year = 2024`: `isDivisibleBruteForce(2024, 4)` → `true` (after 506 iterations), `isDivisibleBruteForce(2024, 100)` → `false`, `isDivisibleBruteForce(2024, 400)` → `false`. Then `isLeapYearBruteForce`: `divisibleBy4 (true) && (!divisibleBy100 (true) || divisibleBy400 (false))` → `true && (true || false)` → `true && true` → `true`. ✓ matches Example 1.

### Approach 2 — Optimized: modulo operator

**Intuition:** Every one of those repeated-subtraction loops is answering the exact same kind of question the `%` operator answers directly and instantly: "what's left over after removing as many whole `divisor`s as possible." Swap each `isDivisibleBruteForce(year, d)` call for `year % d === 0` and the three-loop version collapses into one boolean expression.

**Solution:**

```js
isLeapYearOptimized(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
```

**Dry Run** (`year = 1900`, Example 2 — the trickiest case, since it's divisible by 4 *and* by 100):

| Step | Expression | Value |
|---|---|---|
| 1 | `1900 % 4` | `0` → `year % 4 === 0` is `true` |
| 2 | `1900 % 100` | `0` → `year % 100 !== 0` is `false` |
| 3 | `1900 % 400` | `300` → `year % 400 === 0` is `false` |
| 4 | `false \|\| false` | `false` |
| 5 | `true && false` | `false` |

Return `false`. ✓ matches Example 2 — `1900` looks like it should be a leap year (divisible by 4) until the century-year exception kicks in, and it's *not* divisible by 400, so the exception isn't itself excepted.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (repeated subtraction) | O(year) | O(1) | Dominated by `isDivisibleBruteForce(year, 4)`, which takes roughly `year / 4` loop iterations — the two other divisibility checks (by 100, by 400) are comparatively cheap but still each their own loop. |
| Optimized (modulo) | O(1) | O(1) | Three modulo operations and two boolean comparisons, regardless of how large `year` is. |

## Implementation Notes

All three methods (`isDivisibleBruteForce`, `isLeapYearBruteForce`, `isLeapYearOptimized`) were implemented correctly — no bugs found, including on the trickiest cases: century years that aren't leap years (`1900`, `2100`, `-100`), century years that are (`2000`, `1600`, `2400`), and negative years. Verified against 13 cases plus a direct brute-force-vs-optimized agreement check, all in `Leap_Year_Check.test.js`.

## Key Takeaway

This problem is really a test of whether you can correctly encode "except when" logic with the right operator precedence — `divisibleBy4 && (!divisibleBy100 || divisibleBy400)` reads almost exactly like the English rule once you see it, but getting the parentheses wrong (or reaching for `&&` where `||` belongs) is an easy, silent way to get century years wrong while every other case still passes. Worth specifically testing the century-year cases rather than trusting that "it works for 2024" means it works in general.
