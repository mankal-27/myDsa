# Count Vowels and Consonants

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Count_Vowels_and_Consonants.js`](./Count_Vowels_and_Consonants.js)
**Tests:** [`Count_Vowels_and_Consonants.test.js`](./Count_Vowels_and_Consonants.test.js)

## Problem Statement

Given a string `str`, return an object `{ vowels, consonants }` counting how many alphabetic characters are vowels (`a`, `e`, `i`, `o`, `u`, case-insensitive) and how many are consonants. Non-alphabetic characters (digits, spaces, punctuation) are ignored entirely — they count toward neither. An empty string returns `{ vowels: 0, consonants: 0 }`.

### Example 1

```
Input:  str = "Hello World"
Output: { vowels: 3, consonants: 7 }
```

### Example 2

```
Input:  str = ""
Output: { vowels: 0, consonants: 0 }
```

### Example 3

```
Input:  str = "DSA 123!"
Output: { vowels: 1, consonants: 2 }   (digits, the space, and '!' are ignored)
```

### Example 4

```
Input:  str = "aeiouAEIOU"
Output: { vowels: 10, consonants: 0 }
```

### Constraints

- `str` is a string, possibly empty, and may contain letters (upper or lower case), digits, spaces, and punctuation.

## Use Case

This problem directly extends the single-character Vowel or Consonant check from Module 2 into a full-string tally — the same classify-and-count shape already seen in Count Even and Odd Numbers, applied to characters instead of numbers:

- **Text analysis fundamentals** — counting vowels and consonants is a small building block toward more useful text metrics: readability scores, basic language detection heuristics, and simple text validation (e.g. "does this look like a real word?") often start from exactly this kind of character classification.
- **Reusing Module 2's per-character logic at scale** — the actual "is this character a vowel" decision is identical to the Vowel or Consonant problem; what's new here is applying that per-character check across an entire string and accumulating two running totals, exactly like Count Even and Odd Numbers did for array elements.
- **The "ignore anything else" case matters as much as the two you're counting** — Example 3 is the crux of this problem: a naive implementation that only distinguishes "vowel vs. not-vowel" would misclassify digits, spaces, and punctuation as consonants. Explicitly filtering to alphabetic characters first is what makes the counts correct.

## Concepts

- **Character classification with three outcomes, not two** — every character is either a vowel, a consonant, or neither (and gets ignored) — a reminder that "count A and B" doesn't always mean every input falls into exactly one of those two buckets.
- **Case-insensitivity** — checking both cases explicitly (Approach 1) or normalizing with `toLowerCase()` first (Approach 2), reusing the same idea from Vowel or Consonant in Module 2.
- **Letter-range checks** — `ch >= 'a' && ch <= 'z'` (after lowercasing) relies on string comparison working lexicographically, character by character, the same way numeric comparison works on numbers.

## Approaches

### Approach 1 — brute force: manual letter check, then a vowel-array `.includes()` check

**Intuition:** For each character, first decide whether it's a letter at all (falls in the `a`-`z` range once lowercased); if it isn't, skip it entirely. If it is a letter, check whether its lowercase form appears in a small array of the five vowels.

**Solution (as implemented):**

```js
countVowelsAndConsonantsApproach1(str) {
  let vowels = 0;
  let consonants = 0;
  let letters = ['a', 'e', 'i', 'o', 'u'];
  for (const ch of str) {
    const lower = ch.toLowerCase();
    const isLetter = lower >= 'a' && lower <= 'z';
    if (!isLetter) continue;
    if (letters.includes(lower)) {
      vowels++;
    } else {
      consonants++;
    }
  }
  return { vowels, consonants };
}
```

**Dry Run** (`str = "DSA 123!"`, Example 3):

| `ch` | `isLetter`? | Vowel check | `vowels` after | `consonants` after |
|---|---|---|---|---|
| `'D'` | yes | no | `0` | `1` |
| `'S'` | yes | no | `0` | `2` |
| `'A'` | yes | yes | `1` | `2` |
| `' '` | no → skip | — | `1` | `2` |
| `'1'` | no → skip | — | `1` | `2` |
| `'2'` | no → skip | — | `1` | `2` |
| `'3'` | no → skip | — | `1` | `2` |
| `'!'` | no → skip | — | `1` | `2` |

Return `{ vowels: 1, consonants: 2 }`. ✓ matches Example 3 — the space, digits, and `!` never entered either count.

### Approach 2 — optimized: lowercase the string, then use a `Set` for the vowel check

**Intuition:** Normalize case once up front with `toLowerCase()`, so only five vowel characters need to be checked instead of ten. A `Set` membership check (`VOWELS.has(ch)`) replaces the long comparison chain with a single constant-time lookup.

**Solution:**

```js
countVowelsAndConsonantsApproach2(str) {
  const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
  let vowels = 0;
  let consonants = 0;
  for (const ch of str.toLowerCase()) {
    if (ch < 'a' || ch > 'z') continue;
    if (VOWELS.has(ch)) {
      vowels++;
    } else {
      consonants++;
    }
  }
  return { vowels, consonants };
}
```

**Dry Run** (`str = "Hello World"`, Example 1 — lowercased to `"hello world"`):

| `ch` | in `a`-`z`? | `VOWELS.has(ch)`? | `vowels` after | `consonants` after |
|---|---|---|---|---|
| `'h'` | yes | no | `0` | `1` |
| `'e'` | yes | yes | `1` | `1` |
| `'l'` | yes | no | `1` | `2` |
| `'l'` | yes | no | `1` | `3` |
| `'o'` | yes | yes | `2` | `3` |
| `' '` | no → skip | — | `2` | `3` |
| `'w'` | yes | no | `2` | `4` |
| `'o'` | yes | yes | `3` | `4` |
| `'r'` | yes | no | `3` | `5` |
| `'l'` | yes | no | `3` | `6` |
| `'d'` | yes | no | `3` | `7` |

Return `{ vowels: 3, consonants: 7 }`. ✓ matches Example 1 and Approach 1's result.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (manual chain) | O(n) | O(1) | One classification pass per character; the comparison chain is a fixed length (10 checks max) regardless of string size. |
| Optimized (`Set` lookup) | O(n) | O(1) | Same single pass, but each vowel check is one `Set.has` call — a constant-size lookup — instead of up to five comparisons. |

Like Vowel or Consonant back in Module 2, both approaches are `O(n)` overall — the difference is a smaller constant factor (fewer comparisons per character thanks to lowercasing + `Set`), not a change in complexity class, since every character in the string still needs to be looked at exactly once.

## Implementation Notes

`countVowelsAndConsonantsApproach1` had a real bug: it never checked whether a character was actually a letter before classifying it. The original code went straight to `letters.includes(ch.toLowerCase())` and treated *anything* not in that five-vowel list as a consonant — meaning spaces, digits, and punctuation were all silently counted as consonants. `"DSA 123!"` returned `{ vowels: 1, consonants: 7 }` instead of the correct `{ vowels: 1, consonants: 2 }`, and `"  "` (two spaces) returned `{ vowels: 0, consonants: 2 }` instead of `{ vowels: 0, consonants: 0 }`. Fixed by adding an explicit `isLetter` check (`lower >= 'a' && lower <= 'z'` after lowercasing) that skips non-letter characters entirely, before the vowel/consonant decision — the same guard Approach 2 already had.

`countVowelsAndConsonantsApproach2` was correct as submitted — no bugs found.

Verified against 6 cases — mixed-case text, an empty string, a string mixing letters with digits/space/punctuation, all-vowels, all-consonants, and a spaces-only string — plus a direct cross-check between both approaches, all in `Count_Vowels_and_Consonants.test.js`.

## Key Takeaway

"Count A and B" problems need a third bucket by default: anything that's neither A nor B. It's tempting to write the check as `if (isA) { ... } else { countB++ }`, but that silently assumes every input falls into exactly one of the two categories — which is exactly the assumption that broke here, since digits, spaces, and punctuation are neither vowels nor consonants. The fix is always the same shape: filter down to the relevant characters *first*, then classify only what's left into the two real buckets.
