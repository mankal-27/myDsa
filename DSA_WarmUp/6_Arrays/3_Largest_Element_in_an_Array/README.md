# Largest Element in an Array

**Difficulty:** Easy
**Topics:** Arrays, Loops
**File:** [`Largest_Element_in_an_Array.js`](./Largest_Element_in_an_Array.js)
**Tests:** [`Largest_Element_in_an_Array.test.js`](./Largest_Element_in_an_Array.test.js)

## Problem Statement

Given an array of numbers `arr`, return the largest element in it. An empty array has no largest element — return `undefined` in that case.

### Example 1

```
Input:  arr = [3, 1, 4, 1, 5, 9, 2, 6]
Output: 9
```

### Example 2

```
Input:  arr = []
Output: undefined
```

### Example 3

```
Input:  arr = [-5, -1, -10]
Output: -1
```

### Example 4

```
Input:  arr = [7]
Output: 7
```

### Constraints

- `arr` contains zero or more numbers (integers or floats), which may be negative, zero, or positive.

## Use Case

Finding a maximum is another core reduction, closely related to Sum and Average, but with a subtly different edge-case story:

- **"Track the best-so-far" is one of the most reused loop shapes in DSA** — this exact structure (keep a running best value, update it when something better comes along) reappears in max subarray problems (Kadane's algorithm), finding the tallest bar in the "container with most water" problem, and greedy algorithms generally.
- **Different reasonable answers for empty input** — unlike sum (`0` is the obviously "correct" empty answer) and average (where `0` is a defensible convention), there's no numerically sensible value for the max of an empty array. Returning `undefined` here is a deliberate design choice, and a good example of how "what should this return on empty input" doesn't always have one universal right answer — it depends on the problem.
- **A genuine, sharp practical limitation** — `Math.max(...arr)` (Approach 2) has a real engine limit on how many arguments can be spread into a function call at once, which becomes a concrete, memorable lesson in why "the shortest code" and "the most robust code" aren't always the same thing.

## Concepts

- **Running maximum** — track the best value seen so far, initialized to the first element, and update it whenever a larger element is found.
- **The empty-array edge case has no single correct convention** — here it's handled by returning `undefined` (via `Array.prototype.find`-style "nothing found" semantics) rather than `0`, `-Infinity`, or throwing — a judgment call worth making explicit rather than leaving implicit.
- **`Math.max` and the spread operator** — `Math.max(...arr)` spreads every array element as an individual argument to `Math.max`, which finds the largest across all of them.
- **Argument-count limits on function calls** — JavaScript engines impose a maximum number of arguments a function call can take (spread arguments included), typically somewhere in the tens of thousands depending on the engine; spreading a very large array into `Math.max(...arr)` can throw `RangeError: Maximum call stack size exceeded`, where a manual loop has no such limit.

## Approaches

### Approach 1 — manual loop, tracking a running maximum

**Intuition:** Start by assuming the first element is the largest, then walk through the rest of the array, updating the running maximum any time a bigger element shows up.

**Solution:**

```js
largestElementApproach1(arr) {
  if (arr.length === 0) return undefined;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, Example 1):

| `i` | `arr[i]` | `arr[i] > max`? | `max` after |
|---|---|---|---|
| — | — | — | `3` (initial, from `arr[0]`) |
| 1 | `1` | no | `3` |
| 2 | `4` | yes | `4` |
| 3 | `1` | no | `4` |
| 4 | `5` | yes | `5` |
| 5 | `9` | yes | `9` |
| 6 | `2` | no | `9` |
| 7 | `6` | no | `9` |

Return `9`. ✓ matches Example 1.

### Approach 2 — `Math.max` with the spread operator

**Intuition:** `Math.max` already finds the largest of any list of numeric arguments — spreading the array into individual arguments turns "largest element of an array" into a single built-in call.

**Solution:**

```js
largestElementApproach2(arr) {
  if (arr.length === 0) return undefined;
  return Math.max(...arr);
}
```

**Dry Run** (`arr = [3, 1, 4, 1, 5, 9, 2, 6]`, Example 1): `...arr` spreads into `Math.max(3, 1, 4, 1, 5, 9, 2, 6)`, which returns `9` directly.

Return `9`. ✓ matches Example 1 and Approach 1's result.

**The sharp edge this approach needs to avoid:** spreading a very large array (tens of thousands of elements or more, depending on the JavaScript engine) into `Math.max(...arr)` can throw `RangeError: Maximum call stack size exceeded`, since each spread element becomes an individual function argument and engines cap how many arguments a single call can take. The manual loop in Approach 1 has no such limit — it processes the array one element at a time regardless of size. (A safer built-in alternative for large arrays is `arr.reduce((max, curr) => curr > max ? curr : max)`, which avoids spreading entirely.)

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One comparison per element, one variable tracking the running maximum. |
| `Math.max(...arr)` | O(n) | O(n) | Still one comparison per element internally, but spreading the array first creates `O(n)` individual arguments before `Math.max` runs — and risks a stack-size error for very large arrays. |

Both approaches do the same amount of comparison work, but Approach 2 has a real practical downside (the argument-count limit) that Approach 1 doesn't — worth knowing before reaching for the shorter one-liner on untrusted or unbounded input sizes.

## Can We Do Better Than O(n)?

No — and this is worth understanding *why*, not just accepting as a fact. For an **arbitrary, unsorted** array, `O(n)` is not just what these two approaches happen to achieve — it's a *provable lower bound* on any correct algorithm, no matter how cleverly written.

**The argument:** suppose an algorithm claimed to find the maximum while examining fewer than `n` elements — meaning it skips at least one element without ever looking at its value. That skipped element could secretly be larger than everything the algorithm did check (nothing in the problem statement rules that out), which would make the algorithm's answer wrong. Since this failure is always possible whenever an element goes unexamined, any algorithm that is *always* correct must look at every single element at least once. That's `Ω(n)` — a lower bound that no algorithm can beat, not a limitation of these particular two approaches.

This is different from problems like Sum of All Divisors or Print All Primes, where the brute-force approach was genuinely wasteful and a smarter algorithm (the `√n` divisor-pair trick, the sieve) legitimately reduced the work below the naive bound. Here, the naive approach (look at everything once) is already asymptotically optimal — there's no hidden redundant work left to eliminate.

**The one place this changes:** if the array is already *sorted*, the maximum is just the last element (`arr[arr.length - 1]`) — an `O(1)` lookup, no scan needed. That's not a better algorithm for *this* problem, though; it's a different, stronger starting assumption (sorted input), which itself typically costs `O(n log n)` to establish if the array wasn't sorted already. It's a good preview of a recurring theme in DSA: extra structure in the input (sortedness, being a heap, etc.) is often what turns an `O(n)` problem into an `O(1)` or `O(log n)` one.

## Implementation Notes

Both approaches had the same bug: the empty-array guard returned the *string* `"undefined"` instead of the actual `undefined` value. `"undefined"` is truthy, has `typeof "string"`, and is not equal to `undefined` (`"undefined" === undefined` is `false`) — so any caller checking `result === undefined` or relying on falsy/nullish behavior would have gotten it wrong. Fixed by removing the quotes in both methods so they return the real `undefined`.

Once fixed, both approaches were correct — verified against 7 cases including the empty-array edge case, negatives, ties, and floats, plus an explicit `assert.strictEqual` check that the empty-array result is the real `undefined` and not the string, all in `Largest_Element_in_an_Array.test.js`.

## Key Takeaway

`"undefined"` (the string) and `undefined` (the value) look identical when logged in some contexts but behave completely differently under strict equality, truthiness, and `typeof` — a quoted `"undefined"` is a classic way to accidentally turn a "no value" signal into "a string that happens to say the word undefined." `assert.strictEqual` (rather than the looser `assert.equal`) is what actually catches this class of bug, since `==` can coerce types in ways that mask exactly this kind of mistake.
