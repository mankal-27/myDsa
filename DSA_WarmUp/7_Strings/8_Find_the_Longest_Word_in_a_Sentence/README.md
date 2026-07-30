# Find the Longest Word in a Sentence

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Find_the_Longest_Word_in_a_Sentence.js`](./Find_the_Longest_Word_in_a_Sentence.js)
**Tests:** [`Find_the_Longest_Word_in_a_Sentence.test.js`](./Find_the_Longest_Word_in_a_Sentence.test.js)

## Problem Statement

Given a string `str` representing a sentence, return the longest word in it. Words are separated by one or more spaces. If there's a tie for longest, return whichever one appears first. An empty string, or a string containing only spaces, returns `""`.

### Example 1

```
Input:  str = "The quick brown fox jumps"
Output: "quick"
```

### Example 2

```
Input:  str = ""
Output: ""
```

### Example 3

```
Input:  str = "  a bb ccc  dddd "
Output: "dddd"
```

### Example 4

```
Input:  str = "same size aaa bbb"
Output: "same"   (tie between "same", "size", "aaa", "bbb" — all length 4 — "same" appears first)
```

### Constraints

- `str` is a string, possibly empty, containing letters and space characters.

## Use Case

This problem combines two techniques already built up in this module — word-splitting (Count Words in a Sentence) and finding an extreme value (Largest Element, Second Largest Element) — into a single "find the best word" task, with a genuine efficiency choice hiding underneath:

- **"Find the longest/shortest X" is a common shape** — the largest file in a directory listing, the longest line in a log file, the longest sequence in a dataset — all reduce to the same idea: track the best-so-far while scanning, updating whenever something better shows up (the exact pattern from Largest Element, just applied to word length instead of a number).
- **Tie-breaking rules need to be explicit** — Example 4 exists specifically to pin down what "first occurrence wins" means when several words are equally long; without stating this rule, "the longest word" is ambiguous whenever a tie is possible.
- **Building an intermediate array vs. tracking state directly** — this is the same tension seen in Count Words in a Sentence and Find the Longest Word's sibling problems: is it worth materializing every word into an array first, or can the answer be tracked while scanning character by character without ever storing all the words at once?

## Concepts

- **Splitting into words, reused from Count Words in a Sentence** — `trim().split(/ +/)` collapses leading/trailing/repeated spaces into clean word boundaries.
- **Tracking a running "best so far"** — the same shape as Largest Element in an Array: keep the current best candidate, and replace it only when something strictly better (here, strictly *longer*) is found — the strict comparison is what naturally makes "first occurrence wins" happen without any extra tie-breaking logic.
- **Scanning for word boundaries without an intermediate array** — walking the string once and tracking where the current word started, extracting it with `slice` only when a boundary (a space, or the end of the string) is reached.

## Approaches

### Approach 1 — brute force: split into a words array, then scan it for the longest

**Intuition:** Break the sentence into an array of words first — reusing the same splitting technique as Count Words in a Sentence — then walk through that array, keeping track of the longest word seen so far and replacing it only when a strictly longer word appears.

**Solution:**

```js
findLongestWordApproach1(str) {
  const trimmed = str.trim();
  if (trimmed === '') return '';
  const words = trimmed.split(/ +/);
  let longest = words[0];
  for (let i = 1; i < words.length; i++) {
    if (words[i].length > longest.length) {
      longest = words[i];
    }
  }
  return longest;
}
```

**Dry Run** (`str = "same size aaa bbb"`, Example 4):

| Step | Expression | Value |
|---|---|---|
| 1 | `trimmed.split(/ +/)` | `["same", "size", "aaa", "bbb"]` |
| 2 | `longest = words[0]` | `"same"` |
| `i=1`: `"size".length > "same".length`? | `4 > 4` → no | `longest` stays `"same"` |
| `i=2`: `"aaa".length > "same".length`? | `3 > 4` → no | `longest` stays `"same"` |
| `i=3`: `"bbb".length > "same".length`? | `3 > 4` → no | `longest` stays `"same"` |

Return `"same"`. ✓ matches Example 4 — the strict `>` comparison means later words of equal length never replace the current leader.

### Approach 2 — optimized: single character scan, tracking word boundaries directly

**Intuition:** Instead of building a full array of words first, scan the string once character by character. Remember where the current word started; whenever a space (or the end of the string) is hit while inside a word, that word is complete — extract it and compare its length against the best one found so far.

**Solution:**

```js
findLongestWordApproach2(str) {
  let longest = '';
  let currentStart = -1;
  for (let i = 0; i <= str.length; i++) {
    const ch = str[i];
    const isSpaceOrEnd = ch === ' ' || ch === undefined;
    if (!isSpaceOrEnd && currentStart === -1) {
      currentStart = i;
    } else if (isSpaceOrEnd && currentStart !== -1) {
      const word = str.slice(currentStart, i);
      if (word.length > longest.length) {
        longest = word;
      }
      currentStart = -1;
    }
  }
  return longest;
}
```

**Dry Run** (`str = "  a bb ccc  dddd "`, Example 3):

| `i` | `str[i]` | Action | `currentStart` | `longest` |
|---|---|---|---|---|
| 0,1 | `' '`,`' '` | still outside a word | `-1` | `""` |
| 2 | `'a'` | word starts | `2` | `""` |
| 3 | `' '` | word ends: `str.slice(2,3) = "a"`, `1 > 0` → update | `-1` | `"a"` |
| 4 | `'b'` | word starts | `4` | `"a"` |
| 5,6 | `'b'`,`' '` | at `i=6`: word ends: `str.slice(4,6) = "bb"`, `2 > 1` → update | `-1` | `"bb"` |
| 7 | `'c'` | word starts | `7` | `"bb"` |
| 8,9 | `'c'`,`'c'` | still inside word | `7` | `"bb"` |
| 10,11 | `' '`,`' '` | at `i=10`: word ends: `str.slice(7,10) = "ccc"`, `3 > 2` → update | `-1` | `"ccc"` |
| 12 | `'d'` | word starts | `12` | `"ccc"` |
| 13-15 | `'d'`,`'d'`,`'d'` | still inside word | `12` | `"ccc"` |
| 16 | `' '` | word ends: `str.slice(12,16) = "dddd"`, `4 > 3` → update | `-1` | `"dddd"` |
| 17 (`str.length`) | `undefined` | no word in progress, loop ends | `-1` | `"dddd"` |

Return `"dddd"`. ✓ matches Example 3 and Approach 1's result — found in one pass, with no intermediate words array ever built.

**Note the loop bound `i <= str.length`:** the loop deliberately runs one step past the last character (where `str[i]` is `undefined`) so that a word ending exactly at the end of the string still gets "closed off" and compared — without that extra step, a trailing word with no space after it would never be checked.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (split into array, scan) | O(n) | O(n) | `split` builds an array holding every word from the sentence — extra memory proportional to the sentence's length, even though only the single longest word is ultimately needed. |
| Optimized (single character scan) | O(n) | O(1) | No array of words is ever built — only a start index and the current best word (whose combined size is bounded by the longest word's length, not the whole sentence) are tracked at any point. |

Like Reverse an Array In Place and Palindrome String Check, this is a genuine space-complexity win, not just a stylistic one: Approach 2 never materializes every word at once, only ever holding the current word boundary and the best answer found so far.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including the tie-breaking case (`"same size aaa bbb"` → `"same"`), leading/trailing/repeated spaces, an empty string, a spaces-only string, and a single-word sentence. Verified against 7 cases plus a direct cross-check between both approaches, all in `Find_the_Longest_Word_in_a_Sentence.test.js`.

## Key Takeaway

Approach 2's `i <= str.length` loop bound (rather than the more familiar `i < str.length`) is what correctly closes off a word that runs right up to the end of the string with no trailing space — without that extra iteration, a sentence like `"hello"` would never trigger the "word ends" branch at all, since there's no space character to detect it. It's a reminder that off-by-one loop bounds aren't always bugs to fix toward the "usual" `<` form — sometimes the deliberately unusual bound is exactly what a problem's edge case requires.
