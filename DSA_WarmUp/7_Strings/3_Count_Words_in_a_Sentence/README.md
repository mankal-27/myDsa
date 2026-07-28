# Count Words in a Sentence

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Count_Words_in_a_Sentence.js`](./Count_Words_in_a_Sentence.js)
**Tests:** [`Count_Words_in_a_Sentence.test.js`](./Count_Words_in_a_Sentence.test.js)

## Problem Statement

Given a string `str` representing a sentence, return the number of words in it. Words are separated by one or more spaces; leading, trailing, and repeated spaces don't count as words. An empty string, or a string containing only spaces, has `0` words.

### Example 1

```
Input:  str = "Hello World"
Output: 2
```

### Example 2

```
Input:  str = ""
Output: 0
```

### Example 3

```
Input:  str = "   "
Output: 0
```

### Example 4

```
Input:  str = "  Hello   World  "
Output: 2   (leading, trailing, and repeated spaces are all ignored)
```

### Constraints

- `str` is a string, possibly empty, containing letters and space characters.

## Use Case

Counting words looks trivial until repeated and boundary spaces enter the picture — this problem is really about handling messy real-world text input cleanly, which comes up constantly:

- **Real-world text is rarely perfectly formatted** — user-typed input, copy-pasted text, and form fields routinely have extra leading/trailing whitespace or accidental double spaces; a word counter that naively splits on a single space and counts the pieces will overcount on exactly this kind of input (Example 4 is designed to catch that).
- **A direct precursor to tokenization** — splitting text into words is the first step behind far more advanced text-processing tasks: word frequency analysis (which reuses Count Frequency of Each Element's hash-map technique, just on words instead of numbers), basic search/autocomplete, and natural language processing pipelines all start with correctly identifying word boundaries.
- **State-machine thinking, introduced through a simple case** — Approach 1 below tracks "am I currently inside a word or between words?" as it scans — a small, concrete introduction to the general idea of a state machine, which shows up again in more complex string-parsing problems.

## Concepts

- **A "word" is a maximal run of non-space characters** — not "text between exactly one space," which is the subtle distinction that breaks a naive `str.split(" ").length` on repeated-space input.
- **Tracking state while scanning** — knowing whether the previous character was a space or not is what lets a single left-to-right scan correctly count word *starts* rather than every non-space character.
- **`String.prototype.trim()` and splitting on a run of spaces** — `trim()` removes leading/trailing whitespace, and a regular expression like `/ +/` splits on *one or more* consecutive spaces at once, treating any run of spaces as a single separator.

## Approaches

### Approach 1 — brute force: manual scan, tracking whether we're inside a word

**Intuition:** Walk through the string one character at a time, keeping track of whether the previous character was part of a word. Every time a non-space character is found right after being outside a word (or at the very start), that's the beginning of a new word, so the count increments exactly once per word — not once per character.

**Solution:**

```js
countWordsApproach1(str) {
  let count = 0;
  let inWord = false;
  for (const ch of str) {
    if (ch !== ' ') {
      if (!inWord) {
        count++;
        inWord = true;
      }
    } else {
      inWord = false;
    }
  }
  return count;
}
```

**Dry Run** (`str = "  Hello   World  "`, Example 4):

| `ch` | `inWord` before | Action | `count` after | `inWord` after |
|---|---|---|---|---|
| `' '` | `false` | stay outside a word | `0` | `false` |
| `' '` | `false` | stay outside a word | `0` | `false` |
| `'H'` | `false` | new word starts | `1` | `true` |
| `'e'` | `true` | still inside the word | `1` | `true` |
| `'l'`,`'l'`,`'o'` | `true` | still inside the word | `1` | `true` |
| `' '` | `true` | word ends | `1` | `false` |
| `' '` | `false` | still between words | `1` | `false` |
| `' '` | `false` | still between words | `1` | `false` |
| `'W'` | `false` | new word starts | `2` | `true` |
| `'o'`,`'r'`,`'l'`,`'d'` | `true` | still inside the word | `2` | `true` |
| `' '` | `true` | word ends | `2` | `false` |
| `' '` | `false` | still between words | `2` | `false` |

Return `2`. ✓ matches Example 4 — repeated spaces between and around the words never triggered an extra count.

### Approach 2 — optimized: trim, then split on runs of spaces

**Intuition:** Remove any leading/trailing spaces first with `trim()`, so there's nothing left to accidentally count as an empty "word" at either end. Then split the remaining text on any run of one or more spaces (`/ +/`) — each piece between separators is exactly one word.

**Solution:**

```js
countWordsApproach2(str) {
  const trimmed = str.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/ +/).length;
}
```

**Dry Run** (`str = "  Hello   World  "`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `str.trim()` | `"Hello   World"` |
| 2 | `trimmed === ''`? | no |
| 3 | `trimmed.split(/ +/)` | `["Hello", "World"]` (the triple space collapses to one split point) |
| 4 | `.length` | `2` |

Return `2`. ✓ matches Example 4 and Approach 1's result.

**Why the empty-string guard is needed:** `"".split(/ +/)` returns `['']` — an array containing one empty string, with `.length === 1` — which would incorrectly report 1 word for empty input if the `trimmed === ''` check weren't there first.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual scan | O(n) | O(1) | One pass through the string, tracking a single boolean flag — no intermediate array is built. |
| `trim()` + `split()` | O(n) | O(n) | `trim()` and `split()` each scan the string once, and `split` additionally builds an array of substrings — extra memory proportional to the number of words/characters. |

Like Reverse an Array In Place, this is a case with a real (if modest) space difference: the manual scan never allocates anything beyond a counter and a flag, while the built-in approach necessarily builds an intermediate array of word substrings to get its answer — both are `O(n)` time, but the optimized approach trades a bit of memory for much less code to write and reason about.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including leading/trailing/repeated spaces, an empty string, and a spaces-only string. Verified against 6 cases plus a direct cross-check between both approaches, all in `Count_Words_in_a_Sentence.test.js`.

## Key Takeaway

The empty-string guard in Approach 2 (`if (trimmed === '') return 0;`) isn't optional decoration — `"".split(/ +/)` returns `['']`, an array with one (empty) element, so without that check an empty or spaces-only input would incorrectly report `1` word instead of `0`. It's the same class of edge case as `reduce` needing an explicit initial value: a built-in method's "empty input" behavior doesn't always match the answer the problem actually wants, so it has to be checked for rather than assumed.
