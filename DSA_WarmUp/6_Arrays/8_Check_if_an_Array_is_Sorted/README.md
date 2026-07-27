# Check if an Array is Sorted

**Difficulty:** Easy
**Topics:** Arrays, Loops
**File:** [`Check_if_an_Array_is_Sorted.js`](./Check_if_an_Array_is_Sorted.js)
**Tests:** [`Check_if_an_Array_is_Sorted.test.js`](./Check_if_an_Array_is_Sorted.test.js)

## Problem Statement

Given an array of numbers `arr`, return `true` if it is sorted in **non-decreasing** order (each element is greater than or equal to the one before it), or `false` otherwise. An empty array or a single-element array counts as sorted.

### Example 1

```
Input:  arr = [1, 2, 3, 4, 5]
Output: true
```

### Example 2

```
Input:  arr = [5, 4, 3, 2, 1]
Output: false
```

### Example 3

```
Input:  arr = [1, 1, 2, 3]
Output: true   (equal adjacent elements are still "non-decreasing")
```

### Example 4

```
Input:  arr = [1, 2, 2, 3, 1]
Output: false   (the last element breaks the non-decreasing order)
```

### Constraints

- `arr` contains zero or more numbers, which may be negative, zero, or positive.

## Use Case

Checking whether an array is already sorted is a small problem with an outsized role: it's the gate that decides whether a much faster algorithm becomes available at all:

- **The direct bridge to Binary Search** — several problems back, this repo noted that Binary Search only works on a sorted array. This problem is precisely how you'd verify that precondition holds before trusting a binary search's result — skip this check, and a binary search on an unsorted array can silently return a wrong answer instead of erroring.
- **A cheap sanity check before expensive assumptions** — many algorithms (binary search, merge steps, certain greedy strategies) assume sorted input as a precondition. Verifying that assumption is `O(n)` — far cheaper than the `O(n log n)` it would cost to sort from scratch, so it's always worth checking first rather than blindly re-sorting "just in case."
- **"Sorted" needs a precise definition** — Example 3 vs. Example 4 highlights that "sorted" here specifically means non-decreasing (`>=`), not strictly increasing (`>`); duplicates are allowed to repeat without breaking sortedness, which is a small but important detail to get right.

## Concepts

- **Adjacent-pair comparison** — a sorted array (non-decreasing) means every element is `>=` the one immediately before it; checking this reduces to comparing each adjacent pair exactly once.
- **Early exit on the first violation** — as soon as one adjacent pair is found out of order, the array can't be sorted, and there's no need to check anything further.
- **Vacuous truth for small arrays** — an empty array and a single-element array both trivially satisfy "every adjacent pair is in order," since there are no adjacent pairs to violate that condition — so both count as sorted by definition, not as a special case that needs extra logic.
- **`Array.prototype.every`** — returns `true` only if every element satisfies a condition, short-circuiting to `false` the moment one doesn't, which maps directly onto "check every adjacent pair."

## Approaches

### Approach 1 — manual loop comparing each element to the previous one

**Intuition:** Walk through the array starting from the second element, comparing each one to its predecessor. If any element is smaller than the one before it, the non-decreasing order is broken and the array isn't sorted; making it through the whole array without finding a violation means it is.

**Solution:**

```js
isSortedApproach1(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}
```

**Dry Run** (`arr = [1, 2, 2, 3, 1]`, Example 4):

| `i` | `arr[i]` | `arr[i - 1]` | `arr[i] < arr[i - 1]`? |
|---|---|---|---|
| 1 | `2` | `1` | no |
| 2 | `2` | `2` | no (`2 < 2` is false) |
| 3 | `3` | `2` | no |
| 4 | `1` | `3` | yes → return `false` immediately |

Return `false`. ✓ matches Example 4 — the final `1` breaks the order, even though everything before it was non-decreasing.

### Approach 2 — `Array.prototype.every`

**Intuition:** `every` already expresses "check a condition holds for every element" directly — the condition here is "this element is either the first one, or it's `>=` the element before it," which captures both the base case (index `0` has no predecessor to compare against) and the adjacent-pair check in a single expression.

**Solution:**

```js
isSortedApproach2(arr) {
  return arr.every((val, i) => i === 0 || val >= arr[i - 1]);
}
```

**Dry Run** (`arr = [1, 1, 2, 3]`, Example 3):

| `i` | `val` | `i === 0`? | `val >= arr[i - 1]`? | Passes? |
|---|---|---|---|---|
| 0 | `1` | yes | (skipped, short-circuits true) | yes |
| 1 | `1` | no | `1 >= 1` → yes | yes |
| 2 | `2` | no | `2 >= 1` → yes | yes |
| 3 | `3` | no | `3 >= 2` → yes | yes |

Every element passes. Return `true`. ✓ matches Example 3 and Approach 1's result — the repeated `1` doesn't break non-decreasing order.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One comparison per adjacent pair, exiting early on the first violation. |
| `Array.prototype.every` | O(n) | O(1) | Same adjacent-pair check under the hood — `every` is a built-in loop with early-exit behavior, not a different algorithm. |

Like Even or Odd and several other pairs in this repo, both approaches here are the same complexity — verifying non-decreasing order requires checking every adjacent pair at least once in the worst case (a fully sorted array), so the difference is technique (manual loop vs. built-in), not a complexity improvement.

## Bonus — Divide and Conquer

You asked whether a more efficient algorithm exists here — the honest answer, like Largest Element, is no: `O(n)` is already optimal, since verifying non-decreasing order requires examining every adjacent pair at least once (skip one pair, and that's exactly where a violation could be hiding). But there is a genuinely *different algorithmic strategy* that's worth knowing, even though it doesn't beat `O(n)`: checking sortedness via **divide and conquer**.

**Intuition:** Instead of scanning left to right, split the array into a left half and a right half (sharing one overlapping element at the boundary), recursively check that each half is sorted, and combine the two results with `&&`. Because sortedness is transitive, if the left half is internally sorted and the right half is internally sorted and they share their boundary element, the whole array is sorted — no explicit separate check is needed for the seam between the two halves, since it's covered by one of the two recursive calls.

**Solution:**

```js
isSortedBonusDivideConquer(arr, lo = 0, hi = arr.length - 1) {
  if (hi <= lo) return true; // 0 or 1 element in this range - trivially sorted
  if (hi - lo === 1) return arr[lo] <= arr[hi]; // exactly 2 elements - direct comparison
  const mid = Math.floor((lo + hi) / 2);
  return (
    this.isSortedBonusDivideConquer(arr, lo, mid) &&
    this.isSortedBonusDivideConquer(arr, mid, hi) // note: starts at mid, not mid + 1
  );
}
```

**Dry Run** (`arr = [1, 2, 2, 3, 1]`, Example 4, indices `lo = 0, hi = 4`):

| Call | Range | `mid` | Result |
|---|---|---|---|
| Top call | `[0, 4]` | `2` | splits into `[0, 2]` and `[2, 4]` |
| Left half | `[0, 2]` → `arr[0..2] = [1, 2, 2]` | `1` | splits into `[0,1]` (`1<=2` → true) and `[1,2]` (`2<=2` → true) → `true` |
| Right half | `[2, 4]` → `arr[2..4] = [2, 3, 1]` | `3` | splits into `[2,3]` (`2<=3` → true) and `[3,4]` (`3<=1` → **false**) → `false` |
| Combine | `true && false` | | `false` |

Return `false`. ✓ matches Example 4 and Approaches 1/2's result — the violation between index `3` (`3`) and index `4` (`1`) is caught inside the right-half recursion, at the exact boundary that overlapping ranges were designed to cover.

**Why this is worth knowing despite being the same `O(n)`:** the recursion `T(n) = 2·T(n/2) + O(1)` still resolves to `O(n)` overall (by the same reasoning as merge sort's merge step, minus the merge cost) — so there's no complexity-class win here, matching the "no algorithm can do better than O(n)" conclusion above. What it *does* demonstrate is a different way of decomposing the same problem: this is the exact recursive shape used by merge sort and many divide-and-conquer algorithms, and unlike the left-to-right scan, the two halves here have no dependency on each other — they could genuinely be checked in parallel on separate threads/cores, which the sequential scan cannot do. It's a good early preview of "same complexity, different shape, different practical tradeoffs" before divide-and-conquer sorting shows up later in this repo.

## Implementation Notes

`isSortedApproach1` and `isSortedApproach2` were both implemented correctly — no bugs found, including the equal-adjacent-elements case, the empty and single-element base cases, and negatives. The bonus divide-and-conquer approach was added and verified to agree with both on every case, including a 100,000-element array (both fully sorted and with a single violation inserted partway through). All verified in `Check_if_an_Array_is_Sorted.test.js` (35 tests).

## Key Takeaway

Divide and conquer here is a genuine second answer to "is there a different implementation," even though it doesn't change the Big-O — the lesson is that "more efficient" isn't the only axis worth asking about. A different decomposition strategy can offer real practical value (parallelizability, or a natural fit with recursive data structures) without winning on asymptotic complexity, and recognizing that distinction is as important as spotting an actual `O(n) → O(log n)` improvement.
