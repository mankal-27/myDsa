# Length of a String

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Length_of_a_String.js`](./Length_of_a_String.js)
**Tests:** [`Length_of_a_String.test.js`](./Length_of_a_String.test.js)

## Problem Statement

Given a string `str`, return the number of characters it contains. An empty string has length `0`.

### Example 1

```
Input:  str = "hello"
Output: 5
```

### Example 2

```
Input:  str = ""
Output: 0
```

### Example 3

```
Input:  str = "a"
Output: 1
```

### Example 4

```
Input:  str = "DSA patterns"
Output: 12   (spaces count as characters too)
```

### Constraints

- `str` is a string, possibly empty.

## Use Case

This is the opening problem of the Strings module, and despite being the simplest possible question you can ask about a string, it sets up a distinction worth carrying into every later string problem:

- **Strings and arrays share almost all of their problem-solving patterns** — nearly every technique from the Arrays module (two pointers, hashing, sliding window) applies directly to strings too, since a string is fundamentally an indexed sequence of characters. This module will lean on that overlap constantly.
- **Built-in metadata vs. computed values** — `str.length` isn't computed by scanning the string every time it's accessed; JavaScript strings track their length as stored metadata, updated whenever the string is created. That makes `.length` a genuine `O(1)` operation, not just a shorter way to write an `O(n)` loop — a real, if narrow, complexity win.
- **A gentle reminder to actually check assumptions about built-ins** — it's easy to assume every convenient-looking property or method is doing less work than it looks like it's doing, or more. Knowing *why* `.length` is fast (stored metadata) rather than just trusting that it is builds the habit of asking "how is this actually implemented?" before relying on a built-in's performance.

## Concepts

- **Iterating over a string's characters** — a `for...of` loop (or index-based access) visits each character of a string one at a time, which is what's needed to count them manually.
- **`String.prototype.length`** — a property (not a method — no parentheses) that reports how many UTF-16 code units a string contains, tracked as stored metadata rather than computed on access.
- **O(1) vs O(n) for "the same-looking answer"** — two approaches can return an identical result for every input while having completely different costs to compute it, depending on whether one of them can read a precomputed value instead of deriving it from scratch.

## Approaches

### Approach 1 — brute force: manually count characters with a loop

**Intuition:** Without using any built-in shortcut, the only way to know how many characters a string has is to visit each one and tally as you go.

**Solution:**

```js
lengthOfStringApproach1(str) {
  let count = 0;
  for (const ch of str) {
    count++;
  }
  return count;
}
```

**Dry Run** (`str = "hello"`, Example 1):

| `ch` | `count` after |
|---|---|
| `'h'` | `1` |
| `'e'` | `2` |
| `'l'` | `3` |
| `'l'` | `4` |
| `'o'` | `5` |

Loop ends (no more characters). Return `5`. ✓ matches Example 1.

### Approach 2 — optimized: the built-in `.length` property

**Intuition:** JavaScript strings already track their own length internally — there's no need to recount anything; just read the stored value directly.

**Solution:**

```js
lengthOfStringApproach2(str) {
  return str.length;
}
```

**Dry Run** (`str = "DSA patterns"`, Example 4): `str.length` reads the stored length metadata directly — `12` (including the space between "DSA" and "patterns").

Return `12`. ✓ matches Example 4 and Approach 1's result — with no character-by-character work at all.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (manual loop) | O(n) | O(1) | Visits every character once to build up the count. |
| Optimized (`.length` property) | O(1) | O(1) | Reads a precomputed value stored alongside the string — no scanning required, regardless of how long the string is. |

Unlike the "technique difference, not complexity difference" pairs elsewhere in this repo (Even or Odd, Right-Angled Triangle), this is a genuine complexity win — but a somewhat unusual one, since the "optimization" isn't a smarter algorithm, it's recognizing that the answer is already being tracked for you and doesn't need to be recomputed at all.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including the empty-string edge case and a string containing only spaces. Verified against 6 cases plus a direct cross-check between both approaches, all in `Length_of_a_String.test.js`.

## Key Takeaway

The `for...of` loop in Approach 1 iterates by Unicode code point, not by UTF-16 code unit — for the plain ASCII characters used in every test case here the two counting methods agree, but it's worth knowing that `str.length` and a `for...of` character count can actually diverge on strings containing characters outside the Basic Multilingual Plane (like certain emoji or rare scripts), since those are represented as *two* UTF-16 code units but count as a single iterated character. That's a real, if narrow, source of "wait, why don't these match" bugs when strings from real-world input) enter the picture.
