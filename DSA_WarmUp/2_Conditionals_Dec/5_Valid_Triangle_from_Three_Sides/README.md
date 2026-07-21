# Valid Triangle from Three Sides

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Sorting
**File:** [`Valid_Triangle_from_Three_Sides.js`](./Valid_Triangle_from_Three_Sides.js)
**Tests:** [`Valid_Triangle_from_Three_Sides.test.js`](./Valid_Triangle_from_Three_Sides.test.js)

## Problem Statement

Given three positive numbers `a`, `b`, `c` representing the lengths of the three sides of a triangle, return `true` if they can form a valid triangle, or `false` otherwise.

Three side lengths form a valid triangle if and only if the sum of any two sides is strictly greater than the third side (the **triangle inequality**).

### Example 1

```
Input:  a = 3, b = 4, c = 5
Output: true
```

### Example 2

```
Input:  a = 1, b = 2, c = 3
Output: false   (1 + 2 = 3, not strictly greater — this is a degenerate, "flat" triangle)
```

### Example 3

```
Input:  a = 5, b = 1, c = 1
Output: false   (1 + 1 = 2, which is less than 5)
```

### Example 4

```
Input:  a = 7, b = 10, c = 5
Output: true
```

### Constraints

- `a`, `b`, `c` are positive numbers (may be integers or have a fractional part).

## Use Case

The triangle inequality isn't just geometry trivia — it's a named, reusable concept:

- **Geometry & graphics** — any code that constructs or validates triangles (mesh generation, collision detection, computational geometry) needs this exact check before doing anything else with three points or lengths.
- **Metric spaces & distance functions** — the triangle inequality (`d(x,z) <= d(x,y) + d(y,z)`) is a foundational property that any valid "distance function" must satisfy, and it shows up again when working with graph shortest-paths (Dijkstra's algorithm relies on it) and in machine learning (valid distance metrics for clustering).
- **Sorting to simplify a problem** — Approach 2 below is a small example of a bigger idea: sorting the input first can collapse several conditions into one. The exact same "sort first, then only check the extremes" trick reappears in problems like "3Sum" and interval-merging later in this repo's Two Pointers and Sliding Window modules.

## Concepts

- **The triangle inequality** — for sides `a <= b <= c` (sorted smallest to largest), only `a + b > c` needs to be checked; the other two combinations (`b + c > a`, `a + c > b`) are automatically true once you know `c` is the largest side and all sides are positive.
- **Boolean composition** — combining three comparisons with `&&`, all of which must hold for a valid triangle.
- **Sorting as a simplification tool** — `[a, b, c].sort((x, y) => x - y)` to guarantee a known order, trading "3 conditions in any order" for "1 condition once order is known."

## Approaches

Both approaches are O(1) here, since there are always exactly 3 sides — sorting 3 fixed elements doesn't grow with input the way sorting an array would. The interesting difference is how many comparisons each one needs, not their asymptotic complexity.

### Approach 1 — check all three conditions directly

**Intuition:** The triangle inequality rule is stated as "the sum of *any* two sides must exceed the third" — the most literal translation is to check all three pairings explicitly, without assuming anything about which side is largest.

**Solution:**

```js
isValidTriangleApproach1(a, b, c) {
  return (a + b > c) && (b + c > a) && (a + c > b);
}
```

**Dry Run** (`a = 3, b = 4, c = 5`, Example 1):

| Step | Expression | Value |
|---|---|---|
| 1 | `a + b > c` → `3 + 4 > 5` | `7 > 5` → `true` |
| 2 | `b + c > a` → `4 + 5 > 3` | `9 > 3` → `true` |
| 3 | `a + c > b` → `3 + 5 > 4` | `8 > 4` → `true` |
| 4 | `true && true && true` | `true` |

Return `true`. ✓ matches Example 1.

### Approach 2 — sort first, then check only the two smallest against the largest

**Intuition:** Once you know which side is the largest, two of the three checks become guaranteed: if `largest <= middle + smallest` is the only questionable one, then `middle + largest > smallest` and `smallest + largest > middle` are automatically true, because `largest` is at least as big as `middle` and `smallest` individually, and every side is positive. So sorting first and checking just one inequality is enough — no correctness lost, two-thirds of the comparisons saved.

**Solution:**

```js
isValidTriangleApproach2(a, b, c) {
  const sides = [a, b, c].sort((x, y) => x - y);
  const [smallest, middle, largest] = sides;
  return (smallest + middle) > largest;
}
```

**Dry Run** (`a = 5, b = 1, c = 1`, Example 3):

| Step | Expression | Value |
|---|---|---|
| 1 | `[5, 1, 1].sort((x, y) => x - y)` | `[1, 1, 5]` |
| 2 | `[smallest, middle, largest] = [1, 1, 5]` | `smallest = 1, middle = 1, largest = 5` |
| 3 | `smallest + middle > largest` → `1 + 1 > 5` | `2 > 5` → `false` |

Return `false`. ✓ matches Example 3 and Approach 1's result — one comparison instead of three, once the sides are known to be in order.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Check all three conditions | O(1) | O(1) | Three fixed comparisons, regardless of the magnitude of `a`, `b`, `c`. |
| Sort then check one condition | O(1) | O(1) | Sorting a fixed-size array of 3 elements is a constant number of comparisons (not `O(n log n)` — that only applies when the number of elements grows), plus one comparison after. |

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including on the degenerate case (`1, 2, 3`, where the sum exactly equals the third side rather than exceeding it) and fractional sides. Verified against 10 cases (all four examples, an equilateral triangle, a heavily invalid case, and fractional sides both valid and degenerate) plus a direct cross-check between both approaches, all in `Valid_Triangle_from_Three_Sides.test.js`.

## Key Takeaway

The degenerate case (`1 + 2 = 3`) is the one worth remembering here — it's tempting to use `>=` instead of `>` since "the sides just barely fit," but a triangle where two sides sum to *exactly* the third is flat (all three points lie on a single line), not a real triangle. Both approaches correctly used strict `>`, and it's exactly the kind of boundary a test suite should pin down explicitly rather than assume.
