# Check if Three Points are Collinear

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Geometry
**File:** [`Check_if_Three_Points_are_Collinear.js`](./Check_if_Three_Points_are_Collinear.js)

## Problem Statement

Given three points `(x1, y1)`, `(x2, y2)`, `(x3, y3)` in a 2D plane, return `true` if all three lie on the same straight line (are **collinear**), or `false` otherwise.

### Example 1

```
Input:  (x1, y1) = (1, 1), (x2, y2) = (2, 2), (x3, y3) = (3, 3)
Output: true   (all on the line y = x)
```

### Example 2

```
Input:  (x1, y1) = (1, 1), (x2, y2) = (2, 2), (x3, y3) = (3, 4)
Output: false
```

### Example 3

```
Input:  (x1, y1) = (0, 0), (x2, y2) = (0, 5), (x3, y3) = (0, 10)
Output: true   (a vertical line, x = 0)
```

### Example 4

```
Input:  (x1, y1) = (0, 0), (x2, y2) = (0, 5), (x3, y3) = (1, 10)
Output: false
```

### Constraints

- All coordinates are finite numbers (may be negative, zero, or fractional).
- The three points are not required to be distinct.

## Use Case

Collinearity checks are a small building block of computational geometry, used constantly under the hood:

- **Computer graphics & CAD** — detecting redundant points on a path, simplifying polylines (removing points that don't change the line's direction), and collision/intersection logic all rely on collinearity checks.
- **Cross product as a geometric primitive** — the cross-product approach below (Approach 2) is the same building block used in convex hull algorithms, polygon orientation checks (clockwise vs. counter-clockwise), and point-in-polygon tests — all of it built from this one small idea.
- **Why "the obvious approach" (slope) has a hidden trap** — comparing slopes seems like the natural way to check "same line," but it silently breaks on vertical lines (undefined slope, division by zero). This is a genuinely useful lesson: the most intuitive approach isn't always the most robust one, and recognizing *why* is more valuable than memorizing the fix.

## Concepts

- **Slope of a line** — `(y2 - y1) / (x2 - x1)`, and why this breaks down (division by zero) when two points share the same `x` — i.e. a vertical line.
- **Cross product (2D)** — `(x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)` computes (twice) the signed area of the triangle formed by the three points. If that area is exactly `0`, the "triangle" is flat — the three points lie on a line. This involves only multiplication and subtraction, never division.
- **Floating-point equality pitfalls** — comparing two slopes computed via division (`slope1 === slope2`) can fail to detect collinearity due to floating-point rounding, even when points are genuinely collinear; the cross-product approach sidesteps this because it never divides.

## Approaches

### Approach 1 — compare slopes

**Intuition:** Three points are on the same line exactly when the line through the first two points has the same steepness as the line through the last two — in other words, if you can't tell where one segment ends and the next begins just by looking at the slope. That's a direct, geometric translation of "collinear."

**Solution:**

```js
areCollinearApproach1(x1, y1, x2, y2, x3, y3) {
  if (x1 === x2) {
    // P1-P2 is a vertical line; P1P2P3 are collinear only if P3 shares the same x
    return x2 === x3;
  }
  const slope1 = (y2 - y1) / (x2 - x1);

  if (x2 === x3) {
    // P2-P3 would be vertical but P1-P2 wasn't (handled above) - can't match, not collinear
    return false;
  }
  const slope2 = (y3 - y2) / (x3 - x2);

  return slope1 === slope2;
}
```

Two separate vertical-line special cases are needed *before* you can safely divide — miss either one and the function throws division-by-zero results (`Infinity`, `-Infinity`, or `NaN`) instead of a clean `true`/`false`.

**Dry Run** (`(1,1), (2,2), (3,4)`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `x1 === x2`? | `1 === 2` → `false`, skip vertical-line case |
| 2 | `slope1 = (2-1)/(2-1)` | `1` |
| 3 | `x2 === x3`? | `2 === 3` → `false`, skip second vertical-line case |
| 4 | `slope2 = (4-2)/(3-2)` | `2` |
| 5 | `slope1 === slope2`? | `1 === 2` → `false` |

Return `false`. ✓ matches Example 2.

### Approach 2 — cross product / area method

**Intuition:** The area of the triangle formed by three points is `0` exactly when the three points don't actually form a triangle — they're squashed flat onto a single line. The 2D cross product `(x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)` computes twice that signed area directly, using only multiplication and subtraction — no division, so no vertical-line special case is ever needed.

**Solution:**

```js
areCollinearApproach2(x1, y1, x2, y2, x3, y3) {
  const crossProduct = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
  return crossProduct === 0;
}
```

**Dry Run** (`(0,0), (0,5), (1,10)`, Example 4 — a case that would need the vertical-line branch in Approach 1):

| Step | Expression | Value |
|---|---|---|
| 1 | `(x2 - x1) * (y3 - y1)` → `(0-0) * (10-0)` | `0 * 10 = 0` |
| 2 | `(x3 - x1) * (y2 - y1)` → `(1-0) * (5-0)` | `1 * 5 = 5` |
| 3 | `crossProduct = 0 - 5` | `-5` |
| 4 | `-5 === 0`? | `false` |

Return `false`. ✓ matches Example 4 and Approach 1's result — computed in one expression, with no branching on whether any segment happens to be vertical.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Compare slopes | O(1) | O(1) | A fixed number of arithmetic operations and up to two special-case branches, regardless of the coordinates involved. |
| Cross product | O(1) | O(1) | A fixed number of multiplications and subtractions — same complexity class as Approach 1, but structurally simpler (one expression, zero special cases, no division). |

Both are O(1) — the real difference here isn't speed, it's robustness: Approach 1 requires spotting and correctly handling the vertical-line edge case (miss it, and you get silently wrong or `NaN` results), while Approach 2's formula is correct for every possible configuration of three points without any special-casing at all.

## Your Turn

Implement `areCollinearApproach1(x1, y1, x2, y2, x3, y3)` and `areCollinearApproach2(x1, y1, x2, y2, x3, y3)` in `Check_if_Three_Points_are_Collinear.js`. Ping me when you're done (or stuck) and I'll review your implementation, then write the test file.
