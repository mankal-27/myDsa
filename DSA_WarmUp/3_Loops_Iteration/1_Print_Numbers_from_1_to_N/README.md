# Print Numbers from 1 to N

**Difficulty:** Easy
**Topics:** Loops, Recursion, Arrays
**File:** [`Print_Numbers_from_1_to_N.js`](./Print_Numbers_from_1_to_N.js)
**Tests:** [`Print_Numbers_from_1_to_N.test.js`](./Print_Numbers_from_1_to_N.test.js)

## Problem Statement

Given a non-negative integer `n`, return an array containing the numbers from `1` to `n`, in order. If `n` is `0`, return an empty array.

### Example 1

```
Input:  n = 5
Output: [1, 2, 3, 4, 5]
```

### Example 2

```
Input:  n = 1
Output: [1]
```

### Example 3

```
Input:  n = 0
Output: []
```

### Constraints

- `n` is a non-negative integer.

## Use Case

This is the "hello world" of loops, but the shape of it — iterate, accumulate — is the single most-repeated pattern in all of DSA:

- **Every array-building algorithm** starts here — this exact loop shape (`for`, accumulate into a result) is the skeleton underneath map/filter/reduce implementations, prefix sums, sliding windows, and far more.
- **Iterative vs. recursive equivalence** — this problem can be solved identically well with a loop or with recursion, making it a clean first example of the tradeoff explored more deeply in the Recursion & Backtracking module: recursion often reads more elegantly, but costs call-stack space and (in JS specifically) risks hitting a stack size limit that a loop never would.
- **JS's lack of tail-call optimization** — the JavaScript for DSA reference chapter in this repo already flags that JS engines don't reliably optimize tail recursion, so deep recursion can throw `Maximum call stack size exceeded`. This problem is the first place in the repo where that limitation becomes directly observable — try `printNumbersApproach2` with a very large `n`.

## Concepts

- **`for` loop mechanics** — initialization (`let i = 1`), condition (`i <= n`), and increment (`i++`), and how changing any one of the three changes what gets included.
- **Accumulating into an array** — building up a result with `.push()` inside a loop, the most common way to construct output incrementally.
- **Recursion with an accumulator** — passing the "result so far" as a parameter (`result = []`) instead of concatenating return values, which avoids an easy-to-miss performance trap (see the note below).
- **Call stack depth** — every recursive call adds a frame to the call stack; for large `n`, that stack can grow large enough to hit the engine's limit, which a loop-based version never approaches (a loop is O(1) stack depth, regardless of `n`).

## Approaches

### Approach 1 — iterative (`for` loop)

**Intuition:** "Print numbers 1 to n" is the definition of a loop: start at 1, do something (record the number), move to the next one, stop after n. There's no cleverness needed — this is what `for` loops exist for.

**Solution:**

```js
printNumbersApproach1(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }
  return result;
}
```

**Dry Run** (`n = 5`, Example 1):

| Iteration (`i`) | `i <= 5`? | `result.push(i)` | `result` after |
|---|---|---|---|
| 1 | yes | push `1` | `[1]` |
| 2 | yes | push `2` | `[1, 2]` |
| 3 | yes | push `3` | `[1, 2, 3]` |
| 4 | yes | push `4` | `[1, 2, 3, 4]` |
| 5 | yes | push `5` | `[1, 2, 3, 4, 5]` |
| 6 | no (`6 <= 5` is false) | loop ends | |

Return `[1, 2, 3, 4, 5]`. ✓ matches Example 1.

### Approach 2 — recursive (with an accumulator)

**Intuition:** "The numbers from 1 to n" is "the numbers from 1 to n-1, plus n" — a recursive definition. The naive way to write that (`return [...recurse(n-1), n]`) rebuilds a growing array with the spread operator on *every* call, which quietly turns an O(n) problem into O(n²) (each spread copies the whole array-so-far). Passing the in-progress result as a parameter instead — an **accumulator** — means each call does one `push` (O(1)) rather than one full copy, keeping the total work at O(n).

**Solution:**

```js
printNumbersApproach2(n, current = 1, result = []) {
  if (current > n) {
    return result;
  }
  result.push(current);
  return this.printNumbersApproach2(n, current + 1, result);
}
```

**Dry Run** (`n = 5`, Example 1):

| Call | `current` | `current > n`? | Action | `result` after |
|---|---|---|---|---|
| `printNumbersApproach2(5, 1, [])` | `1` | no | push `1`, recurse with `current = 2` | `[1]` |
| `printNumbersApproach2(5, 2, [1])` | `2` | no | push `2`, recurse with `current = 3` | `[1, 2]` |
| `printNumbersApproach2(5, 3, [1,2])` | `3` | no | push `3`, recurse with `current = 4` | `[1, 2, 3]` |
| `printNumbersApproach2(5, 4, [1,2,3])` | `4` | no | push `4`, recurse with `current = 5` | `[1, 2, 3, 4]` |
| `printNumbersApproach2(5, 5, [1,2,3,4])` | `5` | no | push `5`, recurse with `current = 6` | `[1, 2, 3, 4, 5]` |
| `printNumbersApproach2(5, 6, [1,2,3,4,5])` | `6` | yes (`6 > 5`) | return `result` as-is | `[1, 2, 3, 4, 5]` |

Return `[1, 2, 3, 4, 5]`. ✓ matches Example 1 and Approach 1's result — same answer, but built through 6 stacked function calls instead of one loop.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Iterative (`for` loop) | O(n) | O(n) | One `push` per number from 1 to n; space is for the output array itself, with O(1) auxiliary space beyond that (just the loop counter). |
| Recursive (with accumulator) | O(n) | O(n) + O(n) call stack | Same O(n) work as the loop, but each recursive call adds a stack frame that isn't freed until the base case returns — for very large `n`, this can exhaust the call stack in a way the loop never would (JS engines don't reliably optimize this into a loop under the hood). |
| *Naive recursive (spread, not implemented here)* | *O(n²)* | *O(n) call stack + O(n) per copy* | *Mentioned as a pitfall to avoid: `[...recurse(n-1), n]` copies the entire array-so-far on every call.* |

## Implementation Notes

`printNumbersApproach1` had an off-by-one bug: the loop started at `i = 0` instead of `i = 1` (`for (let i = 0; i <= n; i++)`), so `n = 5` returned `[0, 1, 2, 3, 4, 5]` — six elements starting from `0` — instead of the correct `[1, 2, 3, 4, 5]`. Fixed by starting the loop at `i = 1`.

`printNumbersApproach2` (the recursive, accumulator-passing version) was correct as written — no bugs found.

Verified against 6 cases (all three examples, plus `n = 2, 3, 10`) plus a direct cross-check between both approaches, all in `Print_Numbers_from_1_to_N.test.js`.

## Key Takeaway

"Start the loop at the right number" sounds trivial, but `i = 0` vs `i = 1` is one of the most common sources of off-by-one bugs in loop-based code — and unlike some off-by-one bugs, this one doesn't crash or throw; it just silently produces an extra, wrong element at the front of the array. Worth a habit of double-checking a loop's starting value against the problem's stated range, not just its ending condition.
