# Replace All Spaces with a Character

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Replace_All_Spaces_with_a_Character.js`](./Replace_All_Spaces_with_a_Character.js)
**Tests:** [`Replace_All_Spaces_with_a_Character.test.js`](./Replace_All_Spaces_with_a_Character.test.js)

## Problem Statement

Given a string `str` and a replacement string `replacement`, return a new string with every space character in `str` replaced by `replacement`. An empty string, or a string with no spaces, is returned unchanged.

### Example 1

```
Input:  str = "Hello World", replacement = "%20"
Output: "Hello%20World"
```

### Example 2

```
Input:  str = "", replacement = "-"
Output: ""
```

### Example 3

```
Input:  str = "   ", replacement = "_"
Output: "___"
```

### Example 4

```
Input:  str = "  leading and trailing  ", replacement = "#"
Output: "##leading#and#trailing##"
```

### Constraints

- `str` is a string, possibly empty.
- `replacement` is a string (possibly empty, possibly more than one character).

## Use Case

This is a classic problem in its own right (often called "URLify" in interview prep material) and a useful checkpoint for a fact about JavaScript strings that's been implicit in every problem so far in this module:

- **URL and form encoding** — `"Hello World"` → `"Hello%20World"` (Example 1) is exactly what happens when a browser encodes a space for a URL query parameter; the general technique of scanning text and substituting specific characters underlies URL encoding, HTML escaping, and similar text-transformation tasks.
- **Strings are immutable in JavaScript — there is no "in place" for strings** — Reverse an Array In Place could mutate its input directly because arrays are mutable; a string's characters can never be reassigned (`str[0] = 'x'` silently does nothing in JavaScript). Every approach to this problem, no matter how it's written, has to build and return an entirely new string — a structural difference from arrays worth stating explicitly rather than assuming.
- **Character-by-character substitution as its own small pattern** — separate from counting (Count Vowels and Consonants) or searching (Count Occurrence of a Character), *replacing* characters based on a condition is a distinct operation that shows up again in tasks like sanitizing input or basic redaction.

## Concepts

- **String immutability** — a JavaScript string's contents can't be modified after creation; “changing” a string always means constructing a new one, whether that's done manually or via a built-in method.
- **Building a result incrementally with concatenation** — accumulating a new string one piece at a time with `result += piece`.
- **`split` and `join` as a substitution technique** — splitting a string on every occurrence of a target value and then joining the pieces back together with a different value is a common, very readable way to express "replace every X with Y" without a manual loop.

## Approaches

### Approach 1 — brute force: manual loop, building the result character by character

**Intuition:** Walk through the original string one character at a time. Append the replacement to a growing result string whenever a space is found; otherwise, append the character unchanged.

**Solution:**

```js
replaceSpacesApproach1(str, replacement) {
  let result = '';
  for (const ch of str) {
    if (ch === ' ') {
      result += replacement;
    } else {
      result += ch;
    }
  }
  return result;
}
```

**Dry Run** (`str = "Hello World"`, `replacement = "%20"`, Example 1):

| `ch` | `ch === ' '`? | `result` after |
|---|---|---|
| `'H'` | no | `"H"` |
| `'e'` | no | `"He"` |
| `'l'` | no | `"Hel"` |
| `'l'` | no | `"Hell"` |
| `'o'` | no | `"Hello"` |
| `' '` | yes | `"Hello%20"` |
| `'W'` | no | `"Hello%20W"` |
| `'o'` | no | `"Hello%20Wo"` |
| `'r'` | no | `"Hello%20Wor"` |
| `'l'` | no | `"Hello%20Worl"` |
| `'d'` | no | `"Hello%20World"` |

Return `"Hello%20World"`. ✓ matches Example 1.

### Approach 2 — optimized: split on spaces, then join with the replacement

**Intuition:** Splitting a string on every space breaks it into the pieces that were originally separated by spaces; joining those same pieces back together with `replacement` in between reconstructs the string with every space substituted, in one expression.

**Solution:**

```js
replaceSpacesApproach2(str, replacement) {
  return str.split(' ').join(replacement);
}
```

**Dry Run** (`str = "  leading and trailing  "`, `replacement = "#"`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `str.split(' ')` | `['', '', 'leading', 'and', 'trailing', '', '']` (7 pieces: 6 spaces produce 7 gaps, including empty pieces from the doubled leading/trailing spaces) |
| 2 | `.join('#')` | `"##leading#and#trailing##"` |

Return `"##leading#and#trailing##"`. ✓ matches Example 4 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(n) | One pass through the string, but the result string itself takes `O(n)` space — unavoidable here, since strings are immutable and a new string must be constructed regardless of approach. |
| `split` + `join` | O(n) | O(n) | Same total work, but stages the result through an intermediate array of substrings before joining, using somewhat more memory along the way than the manual loop's direct concatenation. |

Unlike Reverse an Array In Place, there's no `O(1)`-space version of this problem available — arrays can be mutated directly, but strings cannot, so every correct solution here needs to allocate a new string of at least `O(n)` size. The real difference between these two approaches is a smaller, practical one: the manual loop builds the result directly, while `split`/`join` briefly holds an intermediate array of pieces.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including an empty string, an all-spaces string, leading/trailing spaces, a string with no spaces at all, and an empty `replacement` (which effectively removes every space). Verified against 6 cases plus a direct cross-check between both approaches, all in `Replace_All_Spaces_with_a_Character.test.js`.

## Key Takeaway

`replacement = ''` isn't a special case that needed extra handling in either approach — both naturally treat "replace with nothing" the same as any other replacement value, since concatenating an empty string (Approach 1) or joining with an empty string (Approach 2) simply drop the spaces without any extra logic. It's a good example of a solution being robust to an edge case by construction, rather than needing an explicit guard for it.
