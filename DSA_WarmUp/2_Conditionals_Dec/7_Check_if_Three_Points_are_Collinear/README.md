# Check if Three Points are Collinear

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Geometry
**File:** [`Check_if_Three_Points_are_Collinear.js`](./Check_if_Three_Points_are_Collinear.js)
**Tests:** [`Check_if_Three_Points_are_Collinear.test.js`](./Check_if_Three_Points_are_Collinear.test.js)

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
  // If any two of the three points coincide exactly, they're trivially collinear -
  // there's no well-defined slope to compare, and points are allowed to repeat.
  if ((x1 === x2 && y1 === y2) || (x2 === x3 && y2 === y3) || (x1 === x3 && y1 === y3)) {
    return true;
  }

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

Three separate special cases are needed *before* you can safely divide: repeated points (handled first, since a repeated point makes "slope" meaningless rather than merely undefined) and two flavors of vertical line. Miss any of them and the function either throws division-by-zero results (`Infinity`, `-Infinity`, `NaN`) or — as the very first draft of this did — misclassifies a repeated point as "not collinear" by incorrectly treating it as a vertical-line case.

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

## Implementation Notes

The first draft of `areCollinearApproach1` had a real bug, caught by exercising the "points don't need to be distinct" constraint: for `(2,3), (2,3), (5,7)` — where P1 and P2 are the exact same point — it incorrectly returned `false`. The reason: `x1 === x2` was `true` (since P1 and P2 share every coordinate, they trivially share `x` too), so the code took the "this is a vertical line" branch and checked `x2 === x3` (`2 === 5`), which is `false`. But P1-P2 isn't actually a vertical line here — it's not a line at all, since two coincident points don't define a direction. Mathematically, a repeated point plus any third point is always trivially collinear (the "triangle" they'd form has zero area no matter where the third point is), which is exactly what `areCollinearApproach2`'s cross-product formula already returned correctly, with no special-casing needed.

Fixed by adding an explicit check for coincident points *before* the vertical-line logic, returning `true` immediately if any two of the three points are identical. `areCollinearApproach2` needed no changes — the cross-product formula handled this case correctly from the start, which is exactly the robustness advantage described above.

Verified against 13 cases (all four examples, negative coordinates, and every combination of which two points coincide) plus a direct cross-check between both approaches, all in `Check_if_Three_Points_are_Collinear.test.js`.

## Key Takeaway

"Two points coincide" and "two points share the same x-coordinate" sound similar but mean different things — one says the points are identical, the other says they're vertically stacked but still distinct. Conflating them is exactly the kind of subtle bug the cross-product formula avoids by never asking about slope or verticality in the first place; it just measures area, and area doesn't care why three points happen to be arranged the way they are.
