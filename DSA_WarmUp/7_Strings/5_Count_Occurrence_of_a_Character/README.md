# Count Occurrence of a Character

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Count_Occurrence_of_a_Character.js`](./Count_Occurrence_of_a_Character.js)
**Tests:** [`Count_Occurrence_of_a_Character.test.js`](./Count_Occurrence_of_a_Character.test.js)

## Problem Statement

Given a string `str` and a single character `target`, return how many times `target` appears in `str`. Comparison is exact and case-sensitive. An empty string, or a `target` that never appears, gives `0`.

### Example 1

```
Input:  str = "mississippi", target = "s"
Output: 4
```

### Example 2

```
Input:  str = "mississippi", target = "i"
Output: 4
```

### Example 3

```
Input:  str = "", target = "a"
Output: 0
```

### Example 4

```
Input:  str = "Hello", target = "h"
Output: 0   (case-sensitive: 'H' !== 'h')
```

### Constraints

- `str` is a string, possibly empty.
- `target` is a single character.

## Use Case

This is Count Frequency of Each Element's exact idea, narrowed down to counting just *one* specific value instead of tallying every distinct one — and it doubles as a good excuse to look at a genuinely surprising built-in trick:

- **A special case of general frequency counting** — instead of building a full frequency map like Count Frequency of Each Element did for arrays, this problem only needs one count, which opens up a shortcut (splitting on the target) that wouldn't make sense if every character's count were needed at once.
- **`split` as a counting tool, not just a parsing tool** — `split` is normally reached for to break a string into pieces (as in Count Words in a Sentence), but the *number of pieces* it produces is itself useful information: splitting on `target` produces one more piece than there were occurrences of `target`, which is a neat (if slightly indirect) way to get a count without an explicit loop.
- **Same-input, same-output, different cost story** — like several other pairs in this repo, this is a chance to compare "obviously correct, easy to read" against "clever, still correct, but worth understanding *why* it works" — a distinction worth being able to recognize and explain, not just use.

## Concepts

- **Linear scan with a single-purpose counter** — walk through every character once, incrementing a count only when it matches `target`.
- **`String.prototype.split` and off-by-one reasoning** — splitting a string on every occurrence of a separator produces `(number of occurrences) + 1` pieces (think of `n` occurrences as `n` cut points, which divide the string into `n + 1` segments) — so subtracting `1` from the piece count recovers the occurrence count.
- **Case sensitivity** — `'H' !== 'h'`, so an exact character comparison (or an exact-match split) naturally respects case without any extra normalization step, for better or worse depending on what the problem actually wants.

## Approaches

### Approach 1 — brute force: manual loop, comparing each character to `target`

**Intuition:** Walk through the string one character at a time, and every time the current character exactly matches `target`, increment a running count.

**Solution:**

```js
countOccurrenceApproach1(str, target) {
  let count = 0;
  for (const ch of str) {
    if (ch === target) {
      count++;
    }
  }
  return count;
}
```

**Dry Run** (`str = "mississippi"`, `target = "s"`, Example 1):

| `ch` | `ch === "s"`? | `count` after |
|---|---|---|
| `'m'` | no | `0` |
| `'i'` | no | `0` |
| `'s'` | yes | `1` |
| `'s'` | yes | `2` |
| `'i'` | no | `2` |
| `'s'` | yes | `3` |
| `'s'` | yes | `4` |
| `'i'` | no | `4` |
| `'p'` | no | `4` |
| `'p'` | no | `4` |
| `'i'` | no | `4` |

Return `4`. ✓ matches Example 1.

### Approach 2 — optimized: split on `target` and count the gaps between pieces

**Intuition:** If a string is split on every occurrence of `target`, each occurrence becomes a "cut point" removed from the string, and the string ends up divided into one more piece than the number of cuts made. So the occurrence count is exactly `(number of pieces after splitting) - 1`.

**Solution:**

```js
countOccurrenceApproach2(str, target) {
  return str.split(target).length - 1;
}
```

**Dry Run** (`str = "mississippi"`, `target = "s"`, Example 1):

`"mississippi"` has `s` at indices 2, 3, 5, and 6 (`m-i-s-s-i-s-s-i-p-p-i`). Splitting on `"s"` cuts the string at each of those 4 positions, producing 5 pieces — including an empty string wherever two `"s"`s sit right next to each other:

| Step | Expression | Value |
|---|---|---|
| 1 | `str.split("s")` | `["mi", "", "i", "", "ippi"]` (5 pieces: the two adjacent `"s"` pairs each produce an empty string between them) |
| 2 | `.length` | `5` |
| 3 | `5 - 1` | `4` |

Return `4`. ✓ matches Example 1 and Approach 1's result — with no explicit loop or counter written out.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop | O(n) | O(1) | One comparison per character, a single counter variable. |
| `split` and subtract | O(n) | O(n) | `split` scans the whole string once, but must allocate an array holding every piece — extra memory proportional to the string's length, unlike the loop's constant extra space. |

Like Count Words in a Sentence, this is a genuine space-complexity difference — both approaches are `O(n)` time, but `split` needs to materialize an entire array of substrings just to extract a single number from its length, while the manual loop only ever tracks one counter.

## Bonus — Full Frequency Map (reusing Count Frequency of Each Element)

You asked whether the frequency-counting technique from Count Frequency of Each Element could be brought over here — yes, directly. Instead of counting just one `target` character, build a complete `{ character: count }` map for the entire string in a single pass, exactly like that problem did for array elements.

**Intuition:** Walk through the string once, incrementing each character's own count in a hash map as it's encountered — the exact same `freq[key] = (freq[key] || 0) + 1` idiom used before, just keyed by character instead of by number. Once the map exists, the occurrence count for *any* character (not just one predetermined `target`) is a single `O(1)` lookup: `freq[target] || 0`.

**Solution:**

```js
countOccurrenceBonusFrequencyMap(str) {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}
```

**Dry Run** (`str = "mississippi"`):

| `ch` | `freq` after |
|---|---|
| `'m'` | `{ m: 1 }` |
| `'i'` | `{ m: 1, i: 1 }` |
| `'s'` | `{ m: 1, i: 1, s: 1 }` |
| `'s'` | `{ m: 1, i: 1, s: 2 }` |
| `'i'` | `{ m: 1, i: 2, s: 2 }` |
| `'s'` | `{ m: 1, i: 2, s: 3 }` |
| `'s'` | `{ m: 1, i: 2, s: 4 }` |
| `'i'` | `{ m: 1, i: 3, s: 4 }` |
| `'p'` | `{ m: 1, i: 3, s: 4, p: 1 }` |
| `'p'` | `{ m: 1, i: 3, s: 4, p: 2 }` |
| `'i'` | `{ m: 1, i: 4, s: 4, p: 2 }` |

Final map: `{ m: 1, i: 4, s: 4, p: 2 }`. Looking up `freq['s']` gives `4`, matching Approaches 1 and 2's result for `target = 's'` — and `freq['i']` also gives `4` for free, without a second pass through the string.

**When this is actually worth it:** if you only ever need the count of one specific character, building the whole map is wasted work compared to Approaches 1 or 2 — it still costs `O(n)` time and now also `O(k)` space (where `k` is the number of distinct characters) for information you're mostly throwing away. But if the goal shifts to "how many times does *each* character appear" (or "give me counts for several different characters from this same string"), building the map once and reusing it beats re-scanning the string once per character you're curious about.

## Implementation Notes

`countOccurrenceApproach1` and `countOccurrenceApproach2` were both implemented correctly — no bugs found, including the empty-string case, all-matching-character strings, case-sensitive non-matches, and a target that never appears. The bonus frequency map was added and verified to agree with both approaches via lookup on every case, all in `Count_Occurrence_of_a_Character.test.js` (26 tests).

## Key Takeaway

The same hash-map idiom (`freq[key] = (freq[key] || 0) + 1`) works identically whether the keys are numbers (Count Frequency of Each Element) or characters (here) — JavaScript object keys are always coerced to strings anyway, so there was never really a meaningful type difference between the two use cases. What matters more is *shape*: "count occurrences of one specific thing" and "count occurrences of everything" are related but distinct questions, and recognizing which one a problem is actually asking determines whether a targeted scan or a full frequency map is the appropriate tool.
