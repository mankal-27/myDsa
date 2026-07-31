# Big O Notation

## Why It Matters

Code that runs fine on a 10-element test array can crash, hang, or time out the moment it meets a 10-million-row production table. Big O is the tool for predicting that outcome *before* it happens — it describes how the amount of work an algorithm does grows as the input grows, independent of the machine it runs on or how fast that machine is today. It's also the question you'll be asked in almost every technical interview right after "does this work": *what's the time and space complexity?*

This chapter covers what Big O actually measures, the complexity classes you'll run into constantly, how memory usage gets the same treatment, the mechanical rules for working out Big O from a piece of code, and four real-world scenarios worked through end to end.

## What Is Big O?

Big O describes the **growth trend** of an algorithm's work relative to its input size, usually called `n`. It does not tell you how many milliseconds a function takes — it tells you the shape of the curve: if `n` doubles, does the work stay the same, double, quadruple, or explode?

Two properties make this useful:

- **Machine-independent** — a laptop and a data-center server disagree on raw speed, but they agree on the *shape* of an O(n²) curve versus an O(n) curve. Big O survives across hardware, languages, and runtimes.
- **Asymptotic** — it describes behavior as `n` gets large, not the exact op-count for one specific `n`. Constant setup costs and small-input quirks get intentionally ignored (see Rules 3 and 4 below).

The complexity classes you'll meet most often, roughly ordered from "barely notices bigger input" to "explodes almost immediately":

| Complexity | Name | If `n` doubles... |
|---|---|---|
| O(1) | Constant | nothing changes |
| O(log n) | Logarithmic | one extra step |
| O(n) | Linear | work doubles |
| O(n log n) | Linearithmic | slightly more than doubles |
| O(n²) | Quadratic | work quadruples |
| O(2ⁿ) | Exponential | work *squares* |
| O(n!) | Factorial | grows faster than any of the above |

## The Common Time Complexities

### O(1) — Constant Time

A fixed number of operations, no matter how large the input gets.

```js
function firstElement(arr) {
  return arr[0]; // one lookup, whether arr has 3 items or 3 million
}
```

Array/object index access is the textbook example — the engine jumps straight to a memory offset rather than scanning anything. Checking membership in a `Set` or `Map` is O(1) on average for the same reason (hashing computes a bucket directly, instead of searching for it).

### O(log n) — Logarithmic Time

Each step throws away a constant *fraction* of the remaining input — usually half — so the work needed barely grows even as `n` grows enormously.

```js
function binarySearch(sortedArr, target) {
  let lo = 0, hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

The step count barely moves as the input explodes:

| Input size | Max steps to find (or rule out) the target |
|---|---|
| 8 | 3 |
| 1,000 | 10 |
| 1,000,000 | 20 |
| 1,000,000,000 | 30 |

Going from a thousand items to a billion only costs 20 extra comparisons. Searching a balanced binary search tree is O(log n) for the same reason — one comparison per level eliminates the other subtree entirely.

### O(n) — Linear Time

Work scales directly with input size — visit every element once, do a fixed amount of work per element.

```js
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}
```

`n` elements, `n` comparisons. Summing an array, printing a linked list, or traversing every node of a tree all fall here for the same reason: touch each item once, do constant work per touch.

This repo's [`Largest Element in an Array`](../DSA_WarmUp/6_Arrays/3_Largest_Element_in_an_Array/README.md) problem proves something stronger than "this particular approach is O(n)" — it argues O(n) is the *best possible* complexity for finding a max in an unordered array. Any algorithm that skips even one element risks missing the true maximum, so every element must be examined at least once.

### O(n log n) — Linearithmic Time

A mix of a "split repeatedly" cost (`log n` levels) and a "touch everything at each level" cost (`n` work per level). Multiply the two and you get `n log n`.

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}
```

Merge sort halves the array repeatedly (`log n` levels of splitting), and merging back together touches all `n` elements at every level. `n` work × `log n` levels = O(n log n) — noticeably better than the quadratic sorts below, and the complexity most efficient general-purpose sorting algorithms land on.

### O(n²) — Quadratic Time

Nested loops where the inner loop runs roughly `n` times for each of the outer loop's `n` iterations — `n × n` total operations.

```js
function hasCloseDuplicate(arr, maxGap) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && j - i <= maxGap) return true;
    }
  }
  return false;
}
```

Bubble sort, selection sort, and insertion sort's worst case all live here — each compares or shifts elements inside a nested loop. The cost is manageable for small `n` but turns brutal fast:

| `n` | Roughly this many operations |
|---|---|
| 1,000 | ~1,000,000 |
| 10,000 | ~100,000,000 |

Quadratic time is often the *first correct* solution to a problem, and the signal to look for a hash-map or sorting-based trick that removes the inner loop — exactly what happens in [`Count Frequency of Each Element`](../DSA_WarmUp/6_Arrays/9_Count_Frequency_of_Each_Element/README.md), where scanning the whole array for every distinct value (O(n²)-ish) is replaced by a single-pass frequency map (O(n)).

### O(2ⁿ) — Exponential Time

Shows up when a recursive function makes a *fixed number of new calls per element*, so the total call count doubles with every added element — the mirror image of binary search's halving.

```js
function allSubsets(arr, i = 0, current = []) {
  if (i === arr.length) return [current];
  const without = allSubsets(arr, i + 1, current);
  const withIt = allSubsets(arr, i + 1, [...current, arr[i]]);
  return [...without, ...withIt];
}
```

Every element gets an independent "include it or don't" choice, so `n` elements produce `2ⁿ` subsets:

| `n` | Subsets |
|---|---|
| 20 | ~1 million |
| 30 | ~1 billion |
| 40 | ~1 trillion |

Thirty elements already blows past what's reasonable to fully enumerate. Exponential algorithms are usually acceptable only for small, bounded `n` (small feature-flag combinations, small subset-sum problems) — for anything larger, techniques like memoization or dynamic programming often collapse the redundant recomputation and bring the true complexity down to something polynomial.

### O(n!) — Factorial Time

The steepest common complexity: every possible ordering of `n` items.

```js
function allPermutations(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of allPermutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}
```

`n!` grows almost incomprehensibly fast: `5! = 120`, `10! ≈ 3.6 million`, `15! >` one trillion. Generating every route order for a 12-stop delivery run, or every seating arrangement for a 10-person table, both land here — fine as a demo on paper, unusable as `n` climbs past the teens without a smarter approach (branch-and-bound, heuristics, or reframing the problem entirely).

## Comparing Growth Rates

Putting operation counts side by side makes the gap concrete:

| Complexity | Example | n = 10 | n = 100 | n = 1,000 |
|---|---|---|---|---|
| O(1) | array index access | 1 | 1 | 1 |
| O(log n) | binary search | ~3 | ~7 | ~10 |
| O(n) | find the max | 10 | 100 | 1,000 |
| O(n log n) | merge sort | ~33 | ~664 | ~9,966 |
| O(n²) | bubble sort | 100 | 10,000 | 1,000,000 |
| O(2ⁿ) | all subsets | 1,024 | astronomical | astronomical |
| O(n!) | all permutations | ~3.6 million | astronomical | astronomical |

The top three rows stay usable no matter how large `n` gets. The bottom two stop being computable well before `n` reaches a few dozen.

## Space Complexity

Big O also measures *memory*, not just time — how much **extra** space an algorithm needs beyond the input itself. That extra space usually comes from auxiliary data structures (new arrays, hash maps, sets) or from the recursion call stack.

- **O(1) — constant space.** `findMax` above only ever tracks one `max` variable, regardless of array size.
- **O(n) — linear space.** Building a new array of, say, every even number found in the input allocates space proportional to how many qualify — up to O(n) in the worst case.
- **O(n²) — quadratic space.** An `n × n` adjacency matrix or dynamic-programming table stores one cell per pair of inputs.
- **O(log n) — logarithmic space.** Typically comes from recursion depth in a divide-and-conquer algorithm that halves its problem each call (see below).

### The Hidden Cost: The Recursion Call Stack

Every recursive call pushes a new frame onto the call stack, and that frame stays allocated until the call returns. This cost is easy to miss because it's never written explicitly — no `new Array()` anywhere in sight — but it's real memory, and for deep enough recursion it can crash a program with a stack overflow even when the *time* complexity looks fine.

The stack depth is set by the **shape** of the recursion, not by how much total work it does:

- Recursive binary search halves the range each call, so at most `log₂n` frames are ever active at once — O(log n) space, matching its time complexity.
- Naive recursive Fibonacci branches into two calls per level and does O(2ⁿ) total work, but only *one root-to-leaf path* of calls is on the stack at any instant — so its space is O(n), dramatically better than its time complexity.
- Depth-first search on a tree costs O(height) stack space: O(log n) for a balanced tree, but O(n) for a completely skewed one (effectively a linked list).

This repo's [`Sum of First N Natural Numbers (Recursive)`](../DSA_WarmUp/8_Recursion/1_Sum_of_First_N_Natural_Numbers/README.md) problem demonstrates this directly: the recursive approach is O(n) time *and* O(n) space (one stack frame per call, all waiting on the one below it), while Gauss's closed-form formula computes the same answer in O(1) time and O(1) space — no calls stacked up at all.

## Four Rules for Calculating Big O

Reading complexity off of real code comes down to four mechanical rules.

**Rule 1 — Sequential blocks add.** Back-to-back, unrelated blocks of work sum their complexities.

```js
function summarize(listA, listB) {
  const total = listA.reduce((s, x) => s + x, 0); // O(m)
  const sorted = [...listB].sort((a, b) => a - b);  // O(n log n)
  return { total, sorted };
}
```

This is `O(m) + O(n log n)`. Because `m` and `n` are independent input sizes here, neither term is dropped — collapsing them would hide which input actually drives the cost.

**Rule 2 — Nested operations multiply.** An outer loop of size `n` wrapping an inner loop of size `m` costs `O(n × m)` — this is exactly why the quadratic examples above cost `n × n`.

**Rule 3 — Drop constant factors.** `O(2n)`, `O(n / 3)`, and `O(n + 100)` are all still `O(n)` — a constant multiplier or additive constant doesn't change the growth *shape*, only the starting altitude. `O(2n²)` simplifies to `O(n²)`.

**Rule 4 — Drop lower-order terms.** Keep only the fastest-growing term in a sum; at large `n` the smaller terms become irrelevant by comparison. `O(n² + n + 100)` simplifies to `O(n²)` — at `n = 1,000,000`, the `n²` term is a trillion while `n` is only a million and the constant is stuck at 100. `O(n³ + n² + n)` simplifies to `O(n³)`.

## Real-World Problems & Complexity Analysis

Four practical scenarios, each starting from the obvious approach and improving its complexity class.

### 1. Blocklist Lookup in an Auth Middleware

**Scenario:** Every incoming request carries a user ID. Before handling it, check whether that ID is on a banned-users list.

```js
// Naive: linear scan through an array — O(n) per request
function isBannedArray(bannedList, userId) {
  return bannedList.includes(userId); // scans up to the full list
}

// Better: a Set gives O(1) average lookup
function isBannedSet(bannedSet, userId) {
  return bannedSet.has(userId);
}
```

With a growing blocklist and thousands of requests per second, `Array.includes` re-scans the *entire* list on every single request — O(n) work, `n` times over, for O(n²) total. Loading the list into a `Set` once (O(n), paid a single time) turns every subsequent check into O(1) average-case work. This is the same shift as this repo's frequency-map problems: pay a one-time setup cost to turn repeated O(n) lookups into O(1) ones.

### 2. Duplicate Order ID Detection

**Scenario:** An e-commerce system needs to flag whether any order ID appears twice in a batch (a sign of a retried/duplicated request).

```js
// Naive: compare every pair — O(n²)
function hasDuplicateNested(orderIds) {
  for (let i = 0; i < orderIds.length; i++) {
    for (let j = i + 1; j < orderIds.length; j++) {
      if (orderIds[i] === orderIds[j]) return true;
    }
  }
  return false;
}

// Optimized: track what's been seen — O(n)
function hasDuplicateSet(orderIds) {
  const seen = new Set();
  for (const id of orderIds) {
    if (seen.has(id)) return true;
    seen.add(id);
  }
  return false;
}
```

The nested-loop version compares every order against every other order — for a batch of 100,000 orders, that's up to 10 billion comparisons. The `Set`-based version passes over the batch exactly once, trading O(n) extra space for a drop from O(n²) to O(n) time — a batch that would take hours with nested loops finishes in a fraction of a second.

### 3. Search-Bar Autocomplete Over a Sorted Dictionary

**Scenario:** A search bar needs to check whether a typed word exists in a large, pre-sorted dictionary of valid terms.

```js
// Naive: scan the dictionary top to bottom — O(n)
function existsLinear(sortedWords, word) {
  for (const w of sortedWords) {
    if (w === word) return true;
    if (w > word) return false; // sorted, so we can bail early
  }
  return false;
}

// Optimized: binary search — O(log n)
function existsBinary(sortedWords, word) {
  let lo = 0, hi = sortedWords.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sortedWords[mid] === word) return true;
    if (sortedWords[mid] < word) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}
```

For a dictionary of 1,000,000 words, the linear scan can cost up to a million comparisons per keystroke. Because the dictionary is already sorted, binary search answers the same question in roughly 20 comparisons — the difference between a laggy search box and an instant one, and the reason sorted structures (or indexes, in a database) are worth maintaining when lookups vastly outnumber insertions.

### 4. Merging Two Sorted Server Log Files by Timestamp

**Scenario:** Two servers each produce a timestamp-sorted log file; combine them into one sorted log.

```js
// Naive: concatenate then re-sort everything — O((n+m) log(n+m))
function mergeLogsBySort(logA, logB) {
  return [...logA, ...logB].sort((a, b) => a.timestamp - b.timestamp);
}

// Optimized: merge two sorted lists directly — O(n + m)
function mergeLogsLinear(logA, logB) {
  const result = [];
  let i = 0, j = 0;
  while (i < logA.length && j < logB.length) {
    result.push(logA[i].timestamp <= logB[j].timestamp ? logA[i++] : logB[j++]);
  }
  return result.concat(logA.slice(i), logB.slice(j));
}
```

Re-sorting the combined file throws away the fact that both inputs were *already* sorted — a general-purpose sort has no way to know that, so it pays the full `O((n+m) log(n+m))` cost. Walking both files with two pointers and always taking the smaller front element is exactly the `merge` step from merge sort above, and finishes in `O(n + m)` — linear in the combined size, with no log factor at all. The lesson generalizes: when your inputs already have structure (sortedness, in this case), an algorithm that ignores that structure pays for it.

## Key Takeaways

Big O measures growth trend, not stopwatch time — the same algorithm is "the same Big O" on a laptop or a server. The seven common classes span an enormous range, and the gap between them (O(n) vs O(n²), O(2ⁿ) vs anything polynomial) is what decides whether code that works in a test scales in production or falls over. Space complexity deserves the same scrutiny as time, especially the easy-to-forget cost of the recursion call stack. And in practice, most "optimization" work is exactly what the four scenarios above show: recognizing that a nested loop, a re-sort, or a repeated scan is paying for structure (sortedness, uniqueness, prior work) that a hash map, a single pass, or a smarter traversal could exploit instead.
