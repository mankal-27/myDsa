# Multiplication Table of a Number

**Difficulty:** Easy
**Topics:** Loops, Operators, Arrays
**File:** [`Multiplication_Table_of_a_Number.js`](./Multiplication_Table_of_a_Number.js)
**Tests:** [`Multiplication_Table_of_a_Number.test.js`](./Multiplication_Table_of_a_Number.test.js)

## Problem Statement

Given a number `num` and an upper bound `upTo` (defaults to `10`), return an array `[num*1, num*2, ..., num*upTo]` — the multiplication table of `num`.

### Example 1

```
Input:  num = 5
Output: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
```

### Example 2

```
Input:  num = 3, upTo = 5
Output: [3, 6, 9, 12, 15]
```

### Example 3

```
Input:  num = -4, upTo = 3
Output: [-4, -8, -12]
```

### Constraints

- `num` is any integer (may be negative, zero, or positive).
- `upTo` is a positive integer, defaulting to `10` when omitted.

## Use Case

Generating a table by repeating one operation over a range is a loop pattern you'll reuse constantly:

- **Precomputed lookup tables** — caching `f(1), f(2), ..., f(n)` ahead of time (multiplication tables, powers of two, factorials) so later lookups are O(1) instead of recomputed each time — a technique that shows up again in dynamic programming.
- **Repeated addition vs. multiplication** — Approach 2 below revisits the same "repeated addition *is* multiplication" idea from the Simple Interest problem, but in reverse: instead of collapsing a loop of additions into one multiplication, it deliberately builds the table using only addition, which is exactly how multiplication is implemented in hardware that lacks a dedicated multiply instruction (and how you'd compute it by hand as a kid, before memorizing tables).
- **Default parameters revisited** — `upTo = 10` mirrors the `compoundsPerYear = 1` default from the Simple & Compound Interest problem: a sensible default (a standard 1-10 times table) that stays overridable.

## Concepts

- **Loops with array accumulation** — the same `for` + `.push()` shape from Print Numbers from 1 to N, applied here to `num * i` instead of `i` itself.
- **Multiplication as repeated addition** — `num * i` and "add `num` to a running total, `i` times" compute the same thing; one uses the `*` operator directly, the other builds it up manually.
- **Default parameters** — `upTo = 10` lets the function work with just one argument for the common case (a standard times-table) while still supporting a custom range.

## Approaches

Both approaches are O(upTo) — there's no complexity gap to close here (each entry requires exactly one unit of work either way). The interesting difference is *how* each entry gets computed: one multiplication vs. one running addition.

### Approach 1 — direct multiplication in a loop

**Intuition:** The problem statement defines each entry directly as `num * i` — the most literal implementation just computes exactly that, once per value of `i` from `1` to `upTo`.

**Solution:**

```js
multiplicationTableApproach1(num, upTo = 10) {
  const result = [];
  for (let i = 1; i <= upTo; i++) {
    result.push(num * i);
  }
  return result;
}
```

**Dry Run** (`num = 3, upTo = 5`, Example 2):

| Iteration (`i`) | `num * i` | `result` after |
|---|---|---|
| 1 | `3 * 1 = 3` | `[3]` |
| 2 | `3 * 2 = 6` | `[3, 6]` |
| 3 | `3 * 3 = 9` | `[3, 6, 9]` |
| 4 | `3 * 4 = 12` | `[3, 6, 9, 12]` |
| 5 | `3 * 5 = 15` | `[3, 6, 9, 12, 15]` |

Loop ends (`i = 6 > upTo = 5`). Return `[3, 6, 9, 12, 15]`. ✓ matches Example 2.

### Approach 2 — repeated addition (no `*` operator)

**Intuition:** Each entry in the table is exactly `num` more than the previous one (`num*2` is `num*1 + num`, `num*3` is `num*2 + num`, and so on) — so instead of multiplying, keep a running total and add `num` to it once per iteration. This is literally what multiplication *means* for whole numbers, computed the long way.

**Solution:**

```js
multiplicationTableApproach2(num, upTo = 10) {
  const result = [];
  let running = 0;
  for (let i = 1; i <= upTo; i++) {
    running += num;
    result.push(running);
  }
  return result;
}
```

**Dry Run** (`num = 3, upTo = 5`):

| Iteration (`i`) | `running += num` | `running` after | `result` after |
|---|---|---|---|
| 1 | `0 + 3` | `3` | `[3]` |
| 2 | `3 + 3` | `6` | `[3, 6]` |
| 3 | `6 + 3` | `9` | `[3, 6, 9]` |
| 4 | `9 + 3` | `12` | `[3, 6, 9, 12]` |
| 5 | `12 + 3` | `15` | `[3, 6, 9, 12, 15]` |

Return `[3, 6, 9, 12, 15]`. ✓ matches Example 2 and Approach 1's result — same table, built by accumulating instead of multiplying.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Direct multiplication | O(upTo) | O(upTo) | One multiplication and one push per entry; space is for the output array. |
| Repeated addition | O(upTo) | O(upTo) | One addition and one push per entry — same complexity class as Approach 1, since a single multiplication and a single addition are both O(1) operations; the difference is conceptual, not asymptotic. |

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including on `num = 0` (a table of all zeros), a single-entry table (`upTo = 1`), a negative `num`, and the default `upTo` case. Verified against 6 cases plus a direct cross-check between both approaches, all in `Multiplication_Table_of_a_Number.test.js`.

## Key Takeaway

Two approaches that look meaningfully different in code (`num * i` vs. an accumulating `running += num`) turn out to be the exact same amount of work asymptotically — a good reminder that "different technique" doesn't automatically mean "different complexity." The value here was conceptual (seeing multiplication as repeated addition explicitly), not a performance win.
