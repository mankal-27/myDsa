# Linear Search for a Target

**Difficulty:** Easy
**Topics:** Arrays, Loops, Searching
**File:** [`Linear_Search_for_a_Target.js`](./Linear_Search_for_a_Target.js)
**Tests:** [`Linear_Search_for_a_Target.test.js`](./Linear_Search_for_a_Target.test.js)

## Problem Statement

Given an array of numbers `arr` and a `target` value, return the index of the first occurrence of `target` in `arr`, or `-1` if it isn't present.

### Example 1

```
Input:  arr = [3, 1, 4, 1, 5, 9, 2, 6], target = 5
Output: 4
```

### Example 2

```
Input:  arr = [3, 1, 4, 1, 5, 9, 2, 6], target = 1
Output: 1   (first occurrence, even though 1 appears again at index 3)
```

### Example 3

```
Input:  arr = [3, 1, 4, 1, 5, 9, 2, 6], target = 100
Output: -1
```

### Example 4

```
Input:  arr = [], target = 1
Output: -1
```

### Constraints

- `arr` contains zero or more numbers, which may be negative, zero, or positive.
- `target` is a number.

## Use Case

This is the repo's first explicit "searching" problem, and it sets up the contrast that the very next problem in this module (binary search, once the array is sorted) will build on directly:

- **The universal fallback search** — linear search is the one search algorithm that works on *any* array, sorted or not, with no preconditions at all. Every "smarter" search algorithm (binary search, hashing, tree lookups) trades that generality for speed, by requiring some extra structure in the data first (sortedness, a hash table, a balanced tree).
- **First-occurrence semantics matter** — Example 2 highlights a detail worth being deliberate about: when a value appears more than once, does "found at index X" mean the *first* match, the *last* match, or *any* match? This problem picks "first," which is also what `indexOf` does — but it's a design decision, not an accident.
- **The direct setup for Binary Search** — this problem exists specifically so the next one (Binary Search on a sorted array) has something to be compared against: the same "is `target` in this array" question, answered in `O(n)` here versus `O(log n)` once the array is sorted.

## Concepts

- **Sequential scanning** — check each element in order, starting from index `0`, until the target is found or the array is exhausted.
- **Early exit on match** — return immediately once `target` is found, rather than continuing to scan the rest of the array unnecessarily.
- **Sentinel "not found" value** — returning `-1` for "not present" is a convention (not a coincidence) that matches `Array.prototype.indexOf`'s own behavior, and is used because `-1` can never be a valid array index.

## Approaches

### Approach 1 — manual loop, checking each element in order

**Intuition:** Walk through the array from the start, comparing each element to `target`. The moment a match is found, its index is the answer — no need to look further. If the loop finishes without a match, `target` isn't in the array.

**Solution:**

```js
linearSearchApproach1(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, `target = 5`, Example 1):

| `i` | `arr[i]` | `arr[i] === target`? |
|---|---|---|
| 0 | `3` | no |
| 1 | `1` | no |
| 2 | `4` | no |
| 3 | `1` | no |
| 4 | `5` | yes → return `4` |

Return `4`. ✓ matches Example 1.

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, `target = 1`, Example 2 — demonstrating first-occurrence behavior):

| `i` | `arr[i]` | `arr[i] === target`? |
|---|---|---|
| 0 | `3` | no |
| 1 | `1` | yes → return `1` immediately |

Return `1`, not `3` (the index of the *second* `1`). ✓ matches Example 2.

### Approach 2 — `Array.prototype.indexOf`

**Intuition:** `indexOf` already implements exactly this behavior as a built-in — a left-to-right scan returning the first matching index, or `-1` if nothing matches.

**Solution:**

```js
linearSearchApproach2(arr, target) {
  return arr.indexOf(target);
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, `target = 100`, Example 3): `indexOf` scans the entire array, finds no match, and returns `-1` directly.

Return `-1`. ✓ matches Example 3 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) worst case | O(1) | Scans up to every element once; exits early as soon as a match is found, so the *best* case (target at index 0) is O(1), but nothing rules out the target being last or absent. |
| `Array.prototype.indexOf` | O(n) worst case | O(1) | Same underlying scan — `indexOf` is a built-in linear search, not a different algorithm. |

Just like Largest Element in an Array, `O(n)` is the best possible guarantee for search on an **arbitrary, unsorted** array: with no way to rule out any element without checking it, the target could be anywhere (or nowhere), so the worst case can't be avoided in general. This is exactly what the very next problem (Binary Search) changes, by requiring the array to be sorted first — a stronger assumption that buys `O(log n)` search time in exchange.

## Bonus — Sentinel Linear Search

You asked whether there's a different, specific algorithm for this problem beyond "loop vs. built-in" — there is, and it's a genuine algorithmic variant of linear search itself, not just a different tool for the same loop: **sentinel linear search**.

**Intuition:** Approach 1's loop does *two* comparisons per iteration: `i < arr.length` (the bounds check) and `arr[i] === target` (the actual search check). Sentinel search eliminates the bounds check entirely by guaranteeing the loop will always find a match — by temporarily overwriting the array's last element with `target` itself before searching. Since `target` is now guaranteed to exist somewhere in the array, the loop only ever needs the one equality check; there's no way to run off the end. After the loop finds *a* match, the original last element is restored, and one final check distinguishes "found the real target" from "only found the sentinel we planted."

**Solution:**

```js
linearSearchBonusSentinel(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;

  const last = arr[n - 1];
  arr[n - 1] = target; // plant the sentinel

  let i = 0;
  while (arr[i] !== target) {
    i++;
  }

  arr[n - 1] = last; // restore the original array

  if (i < n - 1 || last === target) {
    return i;
  }
  return -1;
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, `target = 100`, Example 3 — target not actually present):

| Step | State |
|---|---|
| `n = 8`, `last = arr[7] = 6` | |
| Plant sentinel | `arr` becomes `[3, 1, 4, 1, 5, 9, 2, 100]` |
| Loop `while (arr[i] !== 100)` | runs until `i = 7` (the planted sentinel) — no bounds check needed at any step |
| Restore | `arr[7] = 6` again, back to `[3, 1, 4, 1, 5, 9, 2, 6]` |
| Check: `i < n - 1`? | `7 < 7` → no. `last === target`? | `6 === 100` → no |

Both checks fail, so return `-1`. ✓ matches Example 3 — the sentinel match at `i = 7` was correctly recognized as "only the planted value," not a real occurrence of `100`.

**Why this is a genuine algorithm variant, not just a rewrite:** it changes *what the loop has to check* on every iteration (one comparison instead of two), which is a real (constant-factor) speedup, not just a different way of writing the same computation — though it's still `O(n)` overall, since the sentinel only removes a redundant check per step, it doesn't let the algorithm skip examining elements. It also introduces a real practical tradeoff: it temporarily *mutates* the input array (restored before returning), which would be an unacceptable side effect if the array were shared or accessed concurrently — a good concrete example of a technique with a real speed benefit and a real cost, rather than a strictly-better replacement for Approach 1.

## Implementation Notes

Both approaches (`linearSearchApproach1`, `linearSearchApproach2`) were implemented correctly — no bugs found, including first-occurrence behavior on duplicates, the empty-array case, negatives, and the target sitting at the very last index. The bonus sentinel search was added and verified to match both approaches on every case, including confirming the input array is correctly restored to its original contents afterward. All verified in `Linear_Search_for_a_Target.test.js` (29 tests).

## Key Takeaway

Not every "better algorithm" question has a complexity-class answer — sentinel search doesn't change linear search's `O(n)` worst case at all, but it's still a legitimate, named algorithmic technique, because it reduces the *constant factor* (comparisons per iteration) at the cost of a real practical tradeoff (temporarily mutating shared state). Recognizing "this optimizes a constant factor, not the complexity class" is just as important a skill as recognizing when a genuine `O(n) → O(log n)` improvement (like the upcoming Binary Search) is available.
