# Temperature Converter

**Difficulty:** Easy
**Topics:** Variables, Conditionals, Operators, Math
**File:** [`Temperature_Converter.js`](./Temperature_Converter.js)
**Tests:** [`Temperature_Converter.test.js`](./Temperature_Converter.test.js)

## Problem Statement

Given a temperature `temp` and the scale it's currently measured in (`scale`, either `"C"` for Celsius or `"F"` for Fahrenheit), convert it to the other scale and return the result rounded to 2 decimal places.

- If `scale === "C"`, `temp` is in Celsius — convert to Fahrenheit: `F = (C * 9/5) + 32`
- Otherwise, `temp` is in Fahrenheit — convert to Celsius: `C = (F - 32) * 5/9`

### Example 1

```
Input:  temp = 0, scale = "C"
Output: 32
```

### Example 2

```
Input:  temp = 212, scale = "F"
Output: 100
```

### Example 3

```
Input:  temp = 98.6, scale = "F"
Output: 37
```

### Constraints

- `temp` is a finite number (may be negative, zero, or fractional).
- `scale` is either `"C"` or `"F"`.
- Result is rounded to 2 decimal places.

## Use Case

This looks like a trivial formula problem, but the pattern it teaches — branching on an input flag to pick one of several fixed formulas, then normalizing the output — shows up constantly:

- **Unit conversion systems** — currency conversion, distance (miles/km), weight (lbs/kg), all follow the same "pick formula based on a flag, then round/format" shape.
- **Input validation & normalization** — real-world versions of this need to validate `scale` is one of the expected values and handle malformed input, a habit worth building early.
- **Floating-point rounding** — the `Math.round(x * 100) / 100` trick for fixed-decimal rounding is used anywhere financial or scientific values need consistent precision (avoiding floating-point display noise like `97.87999999999998`).

## Concepts

- **Variables** — using `let` for a value computed conditionally, versus `const` for values that don't change.
- **Conditionals** — branching behavior based on an input flag (`if`/`else`).
- **Operators** — arithmetic operator precedence, and the easy-to-miss difference between `=` (assignment) and `-`/`==`/`===` (subtraction/comparison). The original draft of this file had `(temp = 32)` instead of `(temp - 32)` — a single-character typo that silently overwrote `temp` instead of subtracting from it.
- **Math** — `Math.round()` combined with a `* 100 / 100` scaling trick to round to a fixed number of decimal places (JS has no built-in "round to N decimals" function).

## Solution

```js
class Solution {
  tempConverter(temp, scale) {
    let result;
    if (scale === "C") {
      result = (temp * 9 / 5) + 32;   // Celsius -> Fahrenheit
    } else {
      result = (temp - 32) * 5 / 9;   // Fahrenheit -> Celsius
    }
    return Math.round(result * 100) / 100;
  }
}
```

## Complexity

| | Complexity | Why |
|---|---|---|
| Time | O(1) | A fixed number of arithmetic operations regardless of input size — no loops, no recursion. |
| Space | O(1) | One local variable (`result`); no data structures that grow with input. |

## Key Takeaway

A good reminder that `=` and `-` sitting one key apart on the keyboard can produce code that runs without errors but computes something entirely different — this is exactly the kind of bug unit tests catch immediately and manual testing easily misses.
