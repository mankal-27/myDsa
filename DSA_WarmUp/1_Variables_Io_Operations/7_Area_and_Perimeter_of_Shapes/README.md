# Area and Perimeter of Shapes

**Difficulty:** Easy
**Topics:** Variables, Operators, Conditionals, Objects, Math (square root)
**File:** [`Area_and_Perimeter_of_Shapes.js`](./Area_and_Perimeter_of_Shapes.js)
**Tests:** [`Area_and_Perimeter_of_Shapes.test.js`](./Area_and_Perimeter_of_Shapes.test.js)

## Problem Statement

Write a function `areaAndPerimeter(shape, dims)` that returns the area and the perimeter of a 2D shape as a two-element array `[area, perimeter]`, with each value rounded to two decimal places.

The `shape` argument is a string naming one of four supported shapes, and `dims` is an array of the numbers that describe it:

- `"rectangle"` with `dims = [length, width]`. Area is `length * width`, and perimeter is `2 * (length + width)`.
- `"square"` with `dims = [side]`. Area is `side * side`, and perimeter is `4 * side`.
- `"circle"` with `dims = [radius]`. Area is `PI * radius * radius`, and the perimeter is the circumference `2 * PI * radius`. Use `PI = 3.14159`.
- `"triangle"` with `dims = [a, b, c]`. Perimeter is `a + b + c`, and area comes from Heron's formula: let `s = (a + b + c) / 2`, then area is `sqrt(s * (s - a) * (s - b) * (s - c))`.

### Example 1

```
Input:  shape = "rectangle", dims = [5, 3]
Output: [15, 16]
```

### Example 2

```
Input:  shape = "square", dims = [4]
Output: [16, 16]
```

### Example 3

```
Input:  shape = "circle", dims = [7]
Output: [153.94, 43.98]
```

### Example 4

```
Input:  shape = "triangle", dims = [3, 4, 5]
Output: [6, 12]
```

### Constraints

- `shape` is one of `"rectangle"`, `"square"`, `"circle"`, `"triangle"`.
- `dims` contains positive numbers matching the shape's required count (2, 1, 1, or 3 respectively).
- For `"triangle"`, the three sides always form a valid triangle.
- Use `PI = 3.14159` (not `Math.PI`) for circle calculations, and round both results to 2 decimal places.

## Use Case

This is a small "shape calculator," but the two things it exercises show up constantly in real code:

- **Dispatching on a type/kind string** — routing to different logic based on a `type` field is everywhere: rendering different UI components based on a `type` prop, handling different event types in an event system, or processing different payment methods in checkout code. The if/else-chain vs. dispatch-table tradeoff you'll see below applies directly to all of these.
- **Computing square roots without a built-in** — Heron's formula needs `sqrt`, and implementing square root yourself (Newton's method / the Babylonian method) is a classic, genuinely useful numerical technique — it's the same idea behind LeetCode's "Sqrt(x)" problem, and Newton's method itself generalizes to finding roots of much more complex functions.

## Concepts

- **String-based dispatch** — `if/else if` chains vs. object-literal lookup tables (`{ rectangle: fn, square: fn, ... }`) as two ways to route based on a string value.
- **Destructuring** — pulling `length, width` or `a, b, c` out of the `dims` array with array destructuring (`const [a, b, c] = dims;`) instead of manual indexing.
- **Newton's method (Babylonian method) for square roots** — iteratively refining a guess (`guess = (guess + x / guess) / 2`) until it's close enough to the true square root, converging remarkably fast (quadratic convergence).
- **Rounding** — the same `Math.round(x * 100) / 100` idiom used in earlier problems, applied to two separate return values.

## Approaches

### Brute Force — if/else dispatch + manual square root

```js
function sqrtApprox(x, precision = 1e-10) {
  if (x === 0) return 0;
  let guess = x;
  while (Math.abs(guess * guess - x) > precision) {
    guess = (guess + x / guess) / 2;
  }
  return guess;
}

areaAndPerimeterBruteForce(shape, dims) {
  const round2 = (n) => Math.round(n * 100) / 100;

  if (shape === "rectangle") {
    const [length, width] = dims;
    return [round2(length * width), round2(2 * (length + width))];
  } else if (shape === "square") {
    const [side] = dims;
    return [round2(side * side), round2(4 * side)];
  } else if (shape === "circle") {
    const PI = 3.14159;
    const [radius] = dims;
    return [round2(PI * radius * radius), round2(2 * PI * radius)];
  } else if (shape === "triangle") {
    const [a, b, c] = dims;
    const s = (a + b + c) / 2;
    const area = sqrtApprox(s * (s - a) * (s - b) * (s - c));
    return [round2(area), round2(a + b + c)];
  }
}
```

Works, but two things don't scale: the `if/else if` chain grows linearly with every new shape you add, and `sqrtApprox` does dozens of iterations to compute something `Math.sqrt` gets in one native call.

### Optimized — dispatch table + `Math.sqrt`

```js
areaAndPerimeterOptimized(shape, dims) {
  const PI = 3.14159;
  const round2 = (n) => Math.round(n * 100) / 100;

  const shapes = {
    rectangle: ([length, width]) => [length * width, 2 * (length + width)],
    square: ([side]) => [side * side, 4 * side],
    circle: ([radius]) => [PI * radius * radius, 2 * PI * radius],
    triangle: ([a, b, c]) => {
      const s = (a + b + c) / 2;
      return [Math.sqrt(s * (s - a) * (s - b) * (s - c)), a + b + c];
    },
  };

  const [area, perimeter] = shapes[shape](dims);
  return [round2(area), round2(perimeter)];
}
```

Adding a new shape means adding one entry to the object, not another `else if` branch — and `Math.sqrt` replaces dozens of manual iterations with one call.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (if/else + manual sqrt) | O(1) shape dispatch, O(log(1/precision)) for `sqrtApprox` on the triangle case | O(1) | The `if/else if` chain itself is still O(1) (fixed number of branches), but Newton's method needs a handful of iterations to converge instead of returning instantly — the interesting cost here isn't the dispatch, it's the manual square root. |
| Optimized (dispatch table + `Math.sqrt`) | O(1) | O(1) | Object property lookup is O(1) regardless of how many shapes are registered, and `Math.sqrt` is a single native operation. |

## Implementation Notes

Both `areaAndPerimeterBruteForce` and `areaAndPerimeterOptimized` were implemented correctly — no bugs found. The brute-force version extracted the Newton's-method square root into its own `sqrt(x, precision)` method rather than a local function, which is a nice touch: it's reusable outside `areaAndPerimeterBruteForce` and made it easy to test the approximation directly against `Math.sqrt`.

Verified against 10 cases (all four shapes, the given examples, decimal inputs, and an equilateral triangle) plus a direct brute-force-vs-optimized agreement check and a standalone check that the manual `sqrt` stays within `1e-9` of `Math.sqrt`, all in `Area_and_Perimeter_of_Shapes.test.js`.

## Key Takeaway

Two independent "brute force → optimized" jumps stacked in one problem: if/else chains collapsing into a dispatch table (a scalability win — adding a shape means adding one object entry, not another branch), and a hand-rolled iterative square root collapsing into one native `Math.sqrt` call (a performance win). Worth noticing when a problem is actually hiding more than one optimization opportunity.
