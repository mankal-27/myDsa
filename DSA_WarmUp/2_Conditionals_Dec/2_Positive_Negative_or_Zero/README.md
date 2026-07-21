# Positive, Negative, or Zero

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Math
**File:** [`Positive_Negative_or_Zero.js`](./Positive_Negative_or_Zero.js)
**Tests:** [`Positive_Negative_or_Zero.test.js`](./Positive_Negative_or_Zero.test.js)

## Problem Statement

Given a number `num`, return `"Positive"` if it's greater than zero, `"Negative"` if it's less than zero, or `"Zero"` if it equals zero.

### Example 1

```
Input:  num = 5
Output: "Positive"
```

### Example 2

```
Input:  num = -5
Output: "Negative"
```

### Example 3

```
Input:  num = 0
Output: "Zero"
```

### Example 4

```
Input:  num = -0.001
Output: "Negative"
```

### Constraints

- `num` is a finite real number (may be an integer or have a fractional part).

## Use Case

A three-way sign check is the simplest possible example of "compute a value, then branch on more than two outcomes":

- **Comparators** — sort functions across every language return a negative number, zero, or a positive number to mean "less than," "equal," or "greater than." This exact three-way classification is the return contract of `Array.prototype.sort`'s comparator function.
- **Validation logic** — checking whether a balance, temperature, or offset is above, below, or exactly at a threshold shows up constantly in real applications (account balances, sensor readings, game scores).
- **Building block for larger decision trees** — this is the smallest possible example of a multi-branch conditional, the same shape you'll use (at a much larger scale) in state machines and rule-based systems.

## Concepts

- **Chained conditionals** — `if / else if / else` to distinguish three outcomes instead of two.
- **`Math.sign()`** — a built-in that collapses "is it positive, negative, or zero" into a single call returning `1`, `-1`, or `0` (and `NaN` for `NaN` — see the note below).
- **Comparison operators** — `>` and `<` against a literal `0`, and why comparing against `0` specifically (rather than checking truthiness) matters, since `0` is falsy in JS but so is `""`, `null`, `undefined`, etc. — sign-checking needs an actual numeric comparison, not a truthiness check.

## Approaches

Both approaches here are O(1) — like Even or Odd, this problem doesn't have a genuine "slow vs. fast" split, since there's no way to check a number's sign that isn't already constant time. The interesting comparison is stylistic: an explicit comparison chain vs. delegating to a built-in.

### Approach 1 — direct comparison chain

**Intuition:** The problem statement *is* the algorithm — "greater than zero," "less than zero," "equal to zero" translate directly into a chain of comparisons. No cleverness needed; this is the most literal possible implementation. (The actual implementation checks `=== 0` first rather than `> 0` first — same logic, different order, same result.)

**Solution:**

```js
positiveNegativeOrZeroApproach1(num) {
  if (num === 0) return "Zero";
  if (num < 0) {
    return "Negative";
  } else {
    return "Positive";
  }
}
```

**Dry Run** (`num = -0.001`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `num === 0`? | `-0.001 === 0` → `false` |
| 2 | `num < 0`? | `-0.001 < 0` → `true` |
| 3 | `return "Negative"` | |

Return `"Negative"`. ✓ matches Example 4.

### Approach 2 — `Math.sign()`

**Intuition:** JS already has a built-in whose entire job is "tell me the sign of a number" — `Math.sign(num)` returns `1` for positive, `-1` for negative, and `0` for zero. Instead of writing the three-way comparison yourself, hand it off and just translate the three possible return values into the required strings.

**Solution:**

```js
positiveNegativeOrZeroApproach2(num) {
  const sign = Math.sign(num);
  if (sign === 1) return "Positive";
  if (sign === -1) return "Negative";
  return "Zero";
}
```

**Dry Run** (`num = -0.001`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `Math.sign(-0.001)` | `-1` |
| 2 | `sign === 1`? | `false` |
| 3 | `sign === -1`? | `true` → `return "Negative"` |

Return `"Negative"`. ✓ matches Example 4 and Approach 1's result.

**A subtlety worth knowing:** `Math.sign(NaN)` returns `NaN` (not `0`), so if `num` could ever be `NaN`, both approaches above would silently classify it as `"Zero"` (Approach 1, since `NaN > 0` and `NaN < 0` are both `false`) or fall through the same "Zero" default (Approach 2, since `NaN === 1` and `NaN === -1` are both `false`). Neither is really correct — `NaN` is not zero. This problem's constraints assume `num` is always a valid finite number, so it's not handled explicitly, but it's the kind of edge case worth remembering before reusing this pattern elsewhere.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Direct comparison chain | O(1) | O(1) | At most two comparisons, regardless of input. |
| `Math.sign()` | O(1) | O(1) | One built-in call plus at most two comparisons against its result. |

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including on `-0` (which correctly returns `"Zero"` in both, since `-0 === 0` is `true` and `Math.sign(-0)` is `-0`, which is loosely `-0 !== 1` and `-0 !== -1`, falling through to the `"Zero"` default). Verified against 10 cases (all four examples, `-0`, tiny fractional values near zero in both directions, and larger magnitudes) plus a direct cross-check between both approaches, all in `Positive_Negative_or_Zero.test.js`.

## Key Takeaway

When two approaches are both O(1), the real question isn't "which is faster" — it's "which is clearer, and which matches how I'd explain this problem out loud." A direct comparison chain reads like the problem statement; reaching for `Math.sign()` reads like "I know a built-in exists for this." Both are valid instincts to build.
