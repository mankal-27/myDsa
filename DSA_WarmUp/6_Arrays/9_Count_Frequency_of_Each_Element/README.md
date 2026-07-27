# Count Frequency of Each Element

**Difficulty:** Easy
**Topics:** Arrays, Hashing
**File:** [`Count_Frequency_of_Each_Element.js`](./Count_Frequency_of_Each_Element.js)
**Tests:** [`Count_Frequency_of_Each_Element.test.js`](./Count_Frequency_of_Each_Element.test.js)

## Problem Statement

Given an array of numbers `arr`, return an object mapping each distinct value in `arr` to how many times it appears. An empty array returns an empty object `{}`.

### Example 1

```
Input:  arr = [1, 2, 2, 3, 3, 3]
Output: { 1: 1, 2: 2, 3: 3 }
```

### Example 2

```
Input:  arr = []
Output: {}
```

### Example 3

```
Input:  arr = [-1, -1, 2, 2, 2]
Output: { '-1': 2, '2': 3 }
```

### Example 4

```
Input:  arr = [4, 4, 4, 4]
Output: { 4: 4 }
```

### Constraints

- `arr` contains zero or more numbers, which may be negative, zero, or positive.

## Use Case

This is the repo's first proper introduction to **hashing** as a technique for beating a naive `O(n²)` approach, not just as a different style — the same kind of genuine complexity win seen back in Sum of All Divisors and the Sieve of Eratosthenes:

- **Frequency counting is everywhere** — word counts, histogram building, "find the most common element," anagram checks, and duplicate detection all reduce to exactly this operation: tally how many times each distinct value shows up.
- **A hash map turns "have I seen this before?" into O(1)** — the brute-force approach's core cost is answering "has this value already been counted?" by rescanning; a hash map answers that same question in constant time per lookup, which is *the* foundational idea behind why hash-based approaches dominate so many array/string problems.
- **A direct preview of two-sum-style problems** — the pattern "walk through once, build up a hash map as you go, using it to avoid a second nested loop" is the exact backbone of the classic Two Sum problem and dozens of variations on it, making this a good rehearsal before those show up.

## Concepts

- **Hash maps for O(1) average lookup and update** — a plain JavaScript object (or a `Map`) lets you check "does this key already exist?" and increment its value in constant time on average, rather than needing to search through previously-seen data.
- **The cost of "have I already handled this value?"** — the brute-force approach answers this by rescanning the whole array for every new distinct value; the optimized approach answers it by checking a hash map, which is the entire source of the complexity difference between the two.
- **The `freq[num] = (freq[num] || 0) + 1` idiom** — a common one-liner for "increment this key's count, treating a missing key as starting from 0."

## Approaches

### Approach 1 — brute force: rescan the array for each new distinct value

**Intuition:** For every element in the array, check whether its count has already been computed. If not, scan the *entire* array from the beginning to count exactly how many times that value appears, and record it. Once a value's count has been recorded, later occurrences of it are skipped (their count is already known).

**Solution:**

```js
countFrequencyApproach1(arr) {
  const freq = {};
  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    if (freq[num] === undefined) {
      let count = 0;
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] === num) {
          count++;
        }
      }
      freq[num] = count;
    }
  }
  return freq;
}
```

**Dry Run** (`arr = [1, 2, 2, 3, 3, 3]`, Example 1):

| `i` | `num = arr[i]` | Already counted? | Rescan needed? | `freq` after |
|---|---|---|---|---|
| 0 | `1` | no | yes — scan finds one `1` | `{ 1: 1 }` |
| 1 | `2` | no | yes — scan finds two `2`s | `{ 1: 1, 2: 2 }` |
| 2 | `2` | yes (`freq[2]` already `2`) | no, skip | `{ 1: 1, 2: 2 }` |
| 3 | `3` | no | yes — scan finds three `3`s | `{ 1: 1, 2: 2, 3: 3 }` |
| 4 | `3` | yes | no, skip | `{ 1: 1, 2: 2, 3: 3 }` |
| 5 | `3` | yes | no, skip | `{ 1: 1, 2: 2, 3: 3 }` |

Return `{ 1: 1, 2: 2, 3: 3 }`. ✓ matches Example 1 — but each new distinct value triggered a full rescan of the array.

### Approach 2 — optimized: single pass, tallying counts in a hash map

**Intuition:** Walk through the array exactly once. For each element, look up its current count in the hash map (or treat it as `0` if it hasn't been seen yet) and add `1`. No rescanning is ever needed, because the running tally is always up to date.

**Solution:**

```js
countFrequencyApproach2(arr) {
  const freq = {};
  for (const num of arr) {
    freq[num] = (freq[num] || 0) + 1;
  }
  return freq;
}
```

**Dry Run** (`arr = [-1, -1, 2, 2, 2]`, Example 3):

| `num` | `freq[num]` before | `freq[num]` after |
|---|---|---|
| `-1` | `undefined` → treated as `0` | `1` |
| `-1` | `1` | `2` |
| `2` | `undefined` → treated as `0` | `1` |
| `2` | `1` | `2` |
| `2` | `2` | `3` |

Return `{ '-1': 2, '2': 3 }`. ✓ matches Example 3 and Approach 1's result — found in a single left-to-right pass, no rescanning.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (rescan per distinct value) | O(n²) | O(k) | Worst case (all distinct elements): every element triggers a full `O(n)` rescan, giving `O(n) × O(n) = O(n²)`; `k` is the number of distinct values stored in the result. |
| Optimized (single-pass hash map) | O(n) | O(k) | One hash map lookup-and-increment per element — each is `O(1)` on average, so the whole pass is `O(n)`; same `O(k)` space for the result. |

This is a genuine complexity improvement, not just a stylistic one — the same category of win as Sum of All Divisors' `√n` trick or the Sieve of Eratosthenes: swapping out repeated linear rescans for constant-time hash map lookups turns a quadratic algorithm into a linear one, at no extra asymptotic space cost (both approaches store the same `O(k)`-sized result).

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including negative numbers as keys, an empty array, a single-element array, and an all-identical array. Verified against 6 cases plus a direct cross-check between both approaches, all in `Count_Frequency_of_Each_Element.test.js`.

## Key Takeaway

`freq[num] === undefined` (Approach 1) and `freq[num] || 0` (Approach 2) both lean on the same JavaScript behavior: accessing a missing object key returns `undefined` rather than throwing, which is what lets both approaches treat "never seen before" as a clean starting state without a separate existence check. The real difference between the two isn't that check — it's *how many times* the array gets scanned to arrive at the final counts: once (Approach 2) versus once per distinct value (Approach 1).
