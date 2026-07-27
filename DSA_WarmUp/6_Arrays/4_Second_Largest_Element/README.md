# Second Largest Element

**Difficulty:** Easy
**Topics:** Arrays, Loops, Sorting
**File:** [`Second_Largest_Element.js`](./Second_Largest_Element.js)
**Tests:** [`Second_Largest_Element.test.js`](./Second_Largest_Element.test.js)

## Problem Statement

Given an array of numbers `arr`, return the second largest **distinct** value in it. If `arr` has fewer than two distinct values — it's empty, has only one element, or every element is identical — there is no second largest, so return `undefined`.

### Example 1

```
Input:  arr = [3, 1, 4, 1, 5, 9, 2, 6]
Output: 6   (largest is 9, second largest is 6)
```

### Example 2

```
Input:  arr = [10, 10, 9]
Output: 9   (duplicates of the largest don't count as a distinct "second" value)
```

### Example 3

```
Input:  arr = [5, 5, 5]
Output: undefined  (only one distinct value exists)
```

### Example 4

```
Input:  arr = []
Output: undefined
```

### Constraints

- `arr` contains zero or more numbers (integers or floats), which may be negative, zero, or positive.

## Use Case

This problem is a direct follow-up to Largest Element in an Array, and it's a good example of how a small change in a problem statement ("second largest" instead of "largest") can meaningfully change both the algorithm and the edge cases:

- **Top-k style problems** — "second largest" is the smallest possible case of "find the k-th largest element," a problem family that shows up constantly (leaderboards, "runner-up" queries, top-k recommendations) and generalizes to heaps and quickselect for larger `k`.
- **Duplicates complicate "distinct" reasoning** — Example 2 (`[10, 10, 9]` → `9`, not `10`) is the crux of this problem: naively sorting and taking the second index breaks the moment the largest value repeats, which is exactly the kind of edge case that's easy to miss without deliberately testing for it.
- **A second look at "can we avoid sorting?"** — Largest Element showed that a full scan (`O(n)`) is unavoidable for finding the max. This problem asks a similar question one level up: does finding the *second* largest require a full `O(n log n)` sort, or can it still be done in a single `O(n)` pass? (Spoiler in the Complexity section below: it can.)

## Concepts

- **Deduping before ranking** — removing duplicate values (e.g. via `Set`) before sorting or comparing, so that repeated occurrences of the largest value don't get mistaken for "first and second place."
- **Sorting descending and indexing** — after deduping, the second largest distinct value sits at index `1` of a descending sort.
- **Tracking two running values in one pass** — maintaining both a running "largest so far" and "second largest so far" simultaneously, updating both correctly whenever a new largest is found (the old largest has to shift down into the second-largest slot, not get discarded).
- **Defining "no answer" clearly** — fewer than two distinct values means there's no second largest to report; this needs an explicit check rather than letting the code silently return something like `undefined` from an out-of-bounds array access (which would happen to work by accident here, but shouldn't be relied upon).

## Approaches

### Approach 1 — brute force: dedupe, sort descending, take index 1

**Intuition:** If duplicates are removed first, the question becomes simple: sort what's left from largest to smallest, and the second largest distinct value is sitting right at index `1`.

**Solution:**

```js
secondLargestApproach1(arr) {
  const unique = [...new Set(arr)].sort((a, b) => b - a);
  if (unique.length < 2) return undefined;
  return unique[1];
}
```

**Dry Run** (`arr = [10, 10, 9]`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `new Set(arr)` | `{10, 9}` (duplicate `10` collapses) |
| 2 | `[...set]` | `[10, 9]` |
| 3 | `.sort((a, b) => b - a)` | `[10, 9]` (already descending) |
| 4 | `unique.length < 2`? | no (`length === 2`) |
| 5 | `unique[1]` | `9` |

Return `9`. ✓ matches Example 2 — the duplicate `10` never gets mistaken for a distinct "second place."

### Approach 2 — optimized: single pass tracking largest and second largest

**Intuition:** Rather than sorting everything, walk through the array once, keeping track of both the largest value seen so far and the second largest. Whenever a new value beats the current largest, the *old* largest slides down into the second-largest slot before the new value takes the top spot; whenever a value beats only the second largest (and isn't equal to the current largest, to correctly skip duplicates), it updates just that slot.

**Solution:**

```js
secondLargestApproach2(arr) {
  let first = -Infinity;
  let second = -Infinity;
  for (const num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num < first && num > second) {
      second = num;
    }
  }
  return second === -Infinity ? undefined : second;
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, Example 1):

| `num` | `num > first`? | `num < first && num > second`? | `first` after | `second` after |
|---|---|---|---|---|
| — | — | — | `-Infinity` | `-Infinity` |
| 3 | yes | — | `3` | `-Infinity` |
| 1 | no | `1 < 3 && 1 > -Infinity` → yes | `3` | `1` |
| 4 | yes | — | `4` (old `first=3` shifts to `second`) | `3` |
| 1 | no | `1 < 4 && 1 > 3`? no | `4` | `3` |
| 5 | yes | — | `5` (old `first=4` shifts to `second`) | `4` |
| 9 | yes | — | `9` (old `first=5` shifts to `second`) | `5` |
| 2 | no | `2 < 9 && 2 > 5`? no | `9` | `5` |
| 6 | no | `6 < 9 && 6 > 5`? yes | `9` | `6` |

Return `6`. ✓ matches Example 1 and Approach 1's result — found in a single pass, no sorting required.

**Dry Run** (`arr = [10, 10, 9]`, Example 2 — the duplicate case):

| `num` | `num > first`? | `num < first && num > second`? | `first` after | `second` after |
|---|---|---|---|---|
| — | — | — | `-Infinity` | `-Infinity` |
| 10 | yes | — | `10` | `-Infinity` |
| 10 | no (`10 > 10` is false) | `10 < 10`? no → skip | `10` | `-Infinity` |
| 9 | no | `9 < 10 && 9 > -Infinity` → yes | `10` | `9` |

Return `9`. ✓ matches Example 2 — the repeated `10` is correctly ignored, since `num > first` requires *strictly* greater, so the second `10` updates neither slot.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (dedupe + sort) | O(n log n) | O(n) | Building the `Set` is `O(n)`, but sorting the deduplicated values dominates at `O(n log n)`; the `Set` and sorted array both take `O(n)` space in the worst case (all-distinct input). |
| Optimized (single pass) | O(n) | O(1) | One pass through the array, updating at most two variables per element — no sorting and no extra data structure needed. |

Unlike Largest Element (where `O(n)` was provably the best possible), this problem shows that adding "one more piece of ranking information" doesn't force an `O(n log n)` sort — tracking two running values in a single pass is enough, which generalizes to tracking the top `k` values with a small fixed-size structure (e.g. a min-heap of size `k`) instead of sorting the whole array, as `k` grows.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including the tricky duplicate-largest cases (`[10, 10, 9] → 9`, `[9, 9, 9, 8] → 8`), the no-second-largest cases (`[]`, `[7]`, `[5, 5, 5]` → all `undefined`), negatives, and floats. Verified against 11 cases plus a direct cross-check between both approaches, all in `Second_Largest_Element.test.js`.

## Key Takeaway

The single-pass approach's correctness hinges on one detail: `num > first` uses strict `>`, so a value equal to the current largest never triggers the "new largest found, shift the old one down" branch. Get that comparison wrong (say, `num >= first`) and a repeated largest value would incorrectly shift into the second-largest slot, turning `[10, 10, 9]` into `10` instead of `9`. A single sharp inequality is doing all the work of correctly handling duplicates, without needing a separate dedupe step at all.
