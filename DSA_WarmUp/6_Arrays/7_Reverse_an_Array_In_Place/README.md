# Reverse an Array In Place

**Difficulty:** Easy
**Topics:** Arrays, Two Pointers
**File:** [`Reverse_an_Array_In_Place.js`](./Reverse_an_Array_In_Place.js)
**Tests:** [`Reverse_an_Array_In_Place.test.js`](./Reverse_an_Array_In_Place.test.js)

## Problem Statement

Given an array of numbers `arr`, reverse it **in place** (mutate `arr` directly, without allocating a new array to hold the final result) and return it. An empty array or single-element array reverses to itself unchanged.

### Example 1

```
Input:  arr = [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]
```

### Example 2

```
Input:  arr = [1, 2, 3, 4]
Output: [4, 3, 2, 1]
```

### Example 3

```
Input:  arr = []
Output: []
```

### Example 4

```
Input:  arr = [7]
Output: [7]
```

### Constraints

- `arr` contains zero or more numbers, which may be negative, zero, or positive.
- The array must be mutated directly ("in place") rather than solved by building and returning an entirely new array.

## Use Case

This is the repo's first explicit **two-pointer** problem, a pattern that reappears constantly throughout DSA once arrays and strings are involved:

- **The two-pointer pattern, introduced properly** — one pointer starting at the front, one at the back, moving toward each other and doing work at each step, is one of the most reused shapes in this field: palindrome checks, the "container with most water" problem, partitioning arrays, and merging sorted arrays all lean on this same left/right pointer idea.
- **"In place" as a real, meaningful constraint** — many problems (including some earlier in this repo) don't restrict how much extra space a solution uses. This problem does, deliberately, so the *space* complexity — not just time — becomes something to actively optimize, which is a distinct skill from optimizing time.
- **Swapping without a helper variable, as a preview** — the classic three-line temp-variable swap shown in Approach 2 here is the same swap technique from Swap Two Numbers (Module 1), just applied inside a loop instead of to two standalone variables — another example of an earlier concept being reused as a building block.

## Concepts

- **Two-pointer technique** — track two indices, `left` starting at `0` and `right` starting at `arr.length - 1`, moving them toward each other until they meet or cross.
- **In-place mutation vs. building a new array** — modifying the existing array's elements directly (`arr[i] = ...`) uses no extra array-sized memory, whereas building a full reversed copy first (even if it's copied back into the original array afterward) uses `O(n)` extra space along the way.
- **Swapping two values with a temporary variable** — `const temp = arr[left]; arr[left] = arr[right]; arr[right] = temp;` — the same idea as Swap Two Numbers, reused here to swap array elements instead of standalone variables.

## Approaches

### Approach 1 — brute force: build a reversed copy, then copy it back

**Intuition:** Read the array from back to front, pushing each element into a brand-new array — that new array is the reversed version. Then copy each value from the new array back into the original array's matching index, satisfying the "mutate in place" requirement even though a full extra array was needed along the way to get there.

**Solution:**

```js
reverseArrayApproach1(arr) {
  const n = arr.length;
  const reversed = [];
  for (let i = n - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  for (let i = 0; i < n; i++) {
    arr[i] = reversed[i];
  }
  return arr;
}
```

**Dry Run** (`arr = [1, 2, 3, 4, 5]`, Example 1):

| Step | `i` | Action | State |
|---|---|---|---|
| Build reversed | 4, 3, 2, 1, 0 | push `arr[i]` each time | `reversed = [5, 4, 3, 2, 1]` |
| Copy back | 0 | `arr[0] = reversed[0]` | `arr = [5, 2, 3, 4, 5]` |
| Copy back | 1 | `arr[1] = reversed[1]` | `arr = [5, 4, 3, 4, 5]` |
| Copy back | 2 | `arr[2] = reversed[2]` | `arr = [5, 4, 3, 4, 5]` |
| Copy back | 3 | `arr[3] = reversed[3]` | `arr = [5, 4, 3, 2, 5]` |
| Copy back | 4 | `arr[4] = reversed[4]` | `arr = [5, 4, 3, 2, 1]` |

Return `[5, 4, 3, 2, 1]`. ✓ matches Example 1 — but a full-size `reversed` array was allocated to get there.

### Approach 2 — optimized: two-pointer swap, no extra array

**Intuition:** Reversing an array is really just swapping the first and last elements, then the second and second-to-last, and so on, until the two pointers meet in the middle. Every swap can happen directly within the original array — no second array is ever needed.

**Solution:**

```js
reverseArrayApproach2(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}
```

**Dry Run** (`arr = [1, 2, 3, 4, 5]`, Example 1):

| `left` | `right` | Swap | `arr` after |
|---|---|---|---|
| 0 | 4 | swap `arr[0]` and `arr[4]` | `[5, 2, 3, 4, 1]` |
| 1 | 3 | swap `arr[1]` and `arr[3]` | `[5, 4, 3, 2, 1]` |
| 2 | 2 | `left < right`? `2 < 2` → no, loop ends | `[5, 4, 3, 2, 1]` |

Return `[5, 4, 3, 2, 1]`. ✓ matches Example 1 and Approach 1's result — reached in 2 swaps instead of building and copying from a 5-element auxiliary array.

**Dry Run** (`arr = [1, 2, 3, 4]`, Example 2 — even length, to show the pointers cross without a middle element):

| `left` | `right` | Swap | `arr` after |
|---|---|---|---|
| 0 | 3 | swap `arr[0]` and `arr[3]` | `[4, 2, 3, 1]` |
| 1 | 2 | swap `arr[1]` and `arr[2]` | `[4, 3, 2, 1]` |
| 2 | 1 | `left < right`? `2 < 1` → no, loop ends | `[4, 3, 2, 1]` |

Return `[4, 3, 2, 1]`. ✓ matches Example 2 — for an even-length array, the pointers simply cross without ever landing on the same index; for an odd-length array (like Example 1), they meet exactly in the middle and that middle element never needs to move.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (build + copy back) | O(n) | O(n) | One pass to build the reversed array, one pass to copy it back — twice the work of Approach 2, and a full extra array's worth of memory along the way. |
| Optimized (two-pointer swap) | O(n) | O(1) | Only `n / 2` swaps total, each using a single temporary variable — no array-sized extra memory, regardless of how large `arr` is. |

Unlike some of the other "two approaches" pairs in this module (Sum, Average, Count Even/Odd), this is a genuine complexity improvement, not just a stylistic one — specifically in *space*: Approach 1 needs `O(n)` extra memory to stage the reversed values before writing them back, while Approach 2 reverses the array using only a constant amount of extra memory, no matter how large it is.

## Implementation Notes

Both approaches had an infinite-loop bug — same underlying mistake in two different places:

- `reverseArrayApproach1`'s reversed-copy loop was `for (let i = n - 1; i >= 0; i++)` — incrementing `i` instead of decrementing it. Since `i` starts at `n - 1` and only ever grows, `i >= 0` stays true forever, so the loop never terminated on any array longer than one element.
- `reverseArrayApproach2`'s two-pointer loop had `right++` instead of `right--`. With `left` incrementing and `right` also incrementing (rather than closing in from the other end), the gap between them never shrinks, so `left < right` also stays true forever — another infinite loop, plus `arr[right]` would eventually read out of bounds (`undefined`) and corrupt the array with `undefined` values before the loop hung.

Both were fixed by correcting the direction of the stray increment (`i--` and `right--` respectively). Verified against 6 cases — odd length, even length, empty array, single element, and negatives — plus a check that the two-pointer approach genuinely mutates the array in place (returns the same reference, not a copy), all in `Reverse_an_Array_In_Place.test.js`.

## Key Takeaway

Both bugs were the exact same class of mistake: a loop's step direction (`++` vs `--`) not matching the direction its bound is supposed to close from. When a loop is meant to count *down* to a floor (like `i >= 0`) or close a *gap* between two converging pointers (`left < right`), using `++` where `--` was intended doesn't produce a wrong answer — it produces a loop that runs forever, which is a more dangerous failure mode than a wrong result, since it hangs the program instead of just returning something incorrect. This is exactly the kind of bug a timeout-protected test run catches immediately.
