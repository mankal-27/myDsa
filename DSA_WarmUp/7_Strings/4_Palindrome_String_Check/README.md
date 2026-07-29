# Palindrome String Check

**Difficulty:** Easy
**Topics:** Strings, Two Pointers
**File:** [`Palindrome_String_Check.js`](./Palindrome_String_Check.js)
**Tests:** [`Palindrome_String_Check.test.js`](./Palindrome_String_Check.test.js)

## Problem Statement

Given a string `str`, return `true` if it reads the same forwards and backwards (an exact, case-sensitive character comparison), or `false` otherwise. An empty string and a single-character string both count as palindromes.

### Example 1

```
Input:  str = "racecar"
Output: true
```

### Example 2

```
Input:  str = "hello"
Output: false
```

### Example 3

```
Input:  str = ""
Output: true
```

### Example 4

```
Input:  str = "Aa"
Output: false   (case-sensitive: 'A' !== 'a')
```

### Constraints

- `str` is a string, possibly empty.
- Comparison is exact and case-sensitive — no ignoring of case, spaces, or punctuation.

## Use Case

This is the two-pointer pattern from Reverse an Array In Place, applied to strings instead of arrays — and it's a direct rehearsal for the same real technique used in far more complex palindrome-adjacent problems:

- **Palindrome checks show up constantly as a sub-step** — "longest palindromic substring," "valid palindrome ignoring punctuation," and palindrome-partitioning problems all build on top of the exact core check done here; getting the basic two-pointer version solid first makes those variants much easier.
- **The two-pointer pattern generalizes across arrays and strings** — since a string is just an indexed sequence of characters, the exact same `left`/`right`-closing-inward technique from Reverse an Array In Place applies here almost unchanged, reinforcing that arrays and strings share far more problem-solving structure than their different types might suggest.
- **Early exit as a meaningful optimization, not just a nicety** — Approach 2 can bail out the instant a single mismatched pair is found, without ever needing to build a full reversed copy first; for a clearly non-palindromic string, this can mean doing far less work than the brute-force approach, not just doing the same work more elegantly.

## Concepts

- **A string is a palindrome if it equals its own reverse** — the most direct, if less efficient, way to check this is to actually build the reverse and compare.
- **Two-pointer comparison from both ends** — `left` starts at index `0`, `right` starts at the last index, and they move toward each other, comparing `str[left]` and `str[right]` at each step; any mismatch immediately proves the string isn't a palindrome.
- **Vacuous truth again for small strings** — an empty string and a single-character string both trivially satisfy "every mirrored pair of characters matches," since there are no pairs to check (or the pointers start already met/crossed) — no special-casing is needed beyond what the pointer loop naturally handles.

## Approaches

### Approach 1 — brute force: build the reversed string, then compare

**Intuition:** If a string is a palindrome, then reversing it produces the exact same string. So one direct way to check is to actually construct the reversed version and compare it to the original for equality.

**Solution:**

```js
isPalindromeApproach1(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}
```

**Dry Run** (`str = "racecar"`, Example 1):

| Step | Expression | Value |
|---|---|---|
| 1 | `str.split('')` | `['r','a','c','e','c','a','r']` |
| 2 | `.reverse()` | `['r','a','c','e','c','a','r']` (a palindrome reverses to itself) |
| 3 | `.join('')` | `"racecar"` |
| 4 | `str === reversed` | `"racecar" === "racecar"` → `true` |

Return `true`. ✓ matches Example 1 — but a full reversed copy of the string was built to get there.

### Approach 2 — optimized: two-pointer comparison from both ends

**Intuition:** Rather than building an entire reversed copy, compare the string against itself directly: the first character should match the last, the second should match the second-to-last, and so on. Two pointers closing in from opposite ends check exactly these pairs, and the moment one pair doesn't match, the string can't be a palindrome — no need to check anything further.

**Solution:**

```js
isPalindromeApproach2(str) {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}
```

**Dry Run** (`str = "hello"`, Example 2):

| `left` | `right` | `str[left]` | `str[right]` | Match? |
|---|---|---|---|---|
| 0 | 4 | `'h'` | `'o'` | no → return `false` immediately |

Return `false`. ✓ matches Example 2 — the mismatch was caught on the very first comparison, with no need to check the middle of the string at all.

**Dry Run** (`str = "racecar"`, Example 1):

| `left` | `right` | `str[left]` | `str[right]` | Match? |
|---|---|---|---|---|
| 0 | 6 | `'r'` | `'r'` | yes |
| 1 | 5 | `'a'` | `'a'` | yes |
| 2 | 4 | `'c'` | `'c'` | yes |
| 3 | 3 | `left < right`? `3 < 3` → no, loop ends | | |

Loop ends without finding a mismatch. Return `true`. ✓ matches Example 1 and Approach 1's result — the middle character (`'e'` at index `3`) never needs a partner to compare against, since the pointers meet exactly there.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (build reversed string, compare) | O(n) | O(n) | `split`, `reverse`, and `join` each process the whole string and build new arrays/strings along the way — extra memory proportional to the string's length. |
| Optimized (two-pointer) | O(n) worst case | O(1) | Only two index variables are tracked; no new string or array is ever built. The best case (mismatch found immediately) is O(1), but nothing rules out needing to check almost the entire string for an actual palindrome. |

Like Reverse an Array In Place, this is a genuine space-complexity win, not just a stylistic one — the two-pointer approach never allocates a copy of the string, while the brute-force approach needs a full reversed copy in memory to perform its comparison.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including the empty-string and single-character base cases, even- and odd-length palindromes, and the case-sensitive mismatch (`"Aa"` correctly returning `false`). Verified against 9 cases plus a direct cross-check between both approaches, all in `Palindrome_String_Check.test.js`.

## Key Takeaway

The two-pointer version's `while (left < right)` condition is doing double duty: it's both the loop's termination check and the thing that correctly skips a middle character in odd-length strings without any special-casing. When `left` and `right` land on the same index (the middle of an odd-length palindrome, like `'e'` in `"racecar"`), the loop simply stops — that character never needs a "partner" to compare against, because a single unpaired middle character can't break a palindrome by itself.
