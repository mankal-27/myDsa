# Right-Angled Triangle of Stars

**Difficulty:** Easy
**Topics:** Loops, Pattern Printing, Strings
**File:** [`Right-Angled_Triangle_of_Stars.js`](./Right-Angled_Triangle_of_Stars.js)
**Tests:** [`Right-Angled_Triangle_of_Stars.test.js`](./Right-Angled_Triangle_of_Stars.test.js)

## Problem Statement

Given a positive integer `n`, return an array of `n` strings representing a right-angled triangle of stars: row `i` (1-indexed) contains exactly `i` `'*'` characters.

### Example 1

```
Input:  n = 3
Output: ["*", "**", "***"]

Printed:
*
**
***
```

### Example 2

```
Input:  n = 5
Output: ["*", "**", "***", "****", "*****"]

Printed:
*
**
***
****
*****
```

### Example 3

```
Input:  n = 1
Output: ["*"]
```

### Constraints

- `n` is a positive integer.

## Use Case

Pattern printing is the first place most people encounter *nested loops with a relationship between the outer and inner index* — the inner loop's bound depends on the outer loop's current value, instead of always running a fixed number of times:

- **Nested-loop index relationships** — this is the simplest possible case of "the inner loop depends on the outer loop," a shape that reappears in far more complex forms in grid/matrix problems, dynamic programming table-filling, and combinatorics (e.g. generating all pairs `i < j`).
- **Building strings incrementally vs. all at once** — comparing a manual character-by-character build against a single built-in call (`repeat`) is a small, concrete example of a pattern that shows up everywhere in DSA: a general-purpose loop-based technique vs. a specialized built-in that does the same work in one step.
- **Visual/spatial reasoning about loop bounds** — figuring out exactly which loop variable controls rows vs. columns, and what the inner bound should be in terms of the outer variable, is a skill that carries directly into every other pattern-printing problem (inverted triangles, pyramids, diamonds, Pascal's triangle).

## Concepts

- **Nested loops** — an outer loop controls which row is being built (`i` from `1` to `n`), and an inner loop (or equivalent) controls how many stars go in that row.
- **Row-dependent inner bound** — the inner loop's stopping condition depends on the outer loop's current index (`j <= i`), which is what makes the shape a triangle instead of a rectangle.
- **String accumulation** — building up a string one character at a time (`row += "*"`) versus constructing it in a single step (`"*".repeat(i)`).

## Approaches

### Approach 1 — nested loops: build each row character by character

**Intuition:** Row `i` needs exactly `i` stars. The most direct way to produce that is an inner loop that runs `i` times, appending one `'*'` on each iteration, while an outer loop moves through each row from `1` to `n`.

**Solution:**

```js
rightAngledTriangleApproach1(n) {
  const rows = [];
  for (let i = 1; i <= n; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
      row += "*";
    }
    rows.push(row);
  }
  return rows;
}
```

**Dry Run** (`n = 3`, Example 1):

| `i` (outer) | inner loop `j` runs | `row` built | `rows` after |
|---|---|---|---|
| 1 | `j = 1` | `"*"` | `["*"]` |
| 2 | `j = 1, 2` | `"**"` | `["*", "**"]` |
| 3 | `j = 1, 2, 3` | `"***"` | `["*", "**", "***"]` |

Return `["*", "**", "***"]`. ✓ matches Example 1.

### Approach 2 — optimized: single loop using `String.prototype.repeat`

**Intuition:** Row `i` is just the character `'*'` repeated `i` times — JavaScript's built-in `repeat` does exactly that in one call, removing the need for an inner loop entirely.

**Solution:**

```js
rightAngledTriangleApproach2(n) {
  const rows = [];
  for (let i = 1; i <= n; i++) {
    rows.push("*".repeat(i));
  }
  return rows;
}
```

**Dry Run** (`n = 3`, Example 1):

| `i` | `"*".repeat(i)` | `rows` after |
|---|---|---|
| 1 | `"*"` | `["*"]` |
| 2 | `"**"` | `["*", "**"]` |
| 3 | `"***"` | `["*", "**", "***"]` |

Return `["*", "**", "***"]`. ✓ matches Example 1 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Nested loops | O(n²) | O(n²) | The inner loop runs `1 + 2 + ... + n = n(n+1)/2` times total across all rows, and the output itself holds `O(n²)` characters (unavoidable — that's the size of the triangle). |
| `String.prototype.repeat` | O(n²) | O(n²) | `repeat` still has to produce `i` characters for each row internally, so the total work done is the same `O(n²)` — the difference here is stylistic (one built-in call vs. a manual inner loop), not a complexity improvement, since the output size itself forces at least `O(n²)` work. |

Unlike most "brute force vs. optimized" pairs in this repo, both approaches here are the same time complexity — the output itself has `O(n²)` characters, so no approach can do better than that. The real difference is technique: hand-rolled inner loop vs. a built-in string method.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, verified against `n = 1, 2, 3, 5, 10` in `Right-Angled_Triangle_of_Stars.test.js`.

The return value is an array of row strings (`["*", "**", "***"]`), not printed output — that's intentional, since it's what makes the result easy to assert against in tests. To actually see the triangle shape printed in a terminal, join the array with newlines: `console.log(result.join('\n'))`.

## Key Takeaway

Returning structured data (an array of strings) rather than printing directly keeps the solution testable — the caller decides how to display it (`join('\n')` for a terminal, one `<div>` per row for a UI, etc.), instead of the function baking in one specific output format.
