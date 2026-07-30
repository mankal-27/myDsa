# Toggle Case of Every Character

**Difficulty:** Easy
**Topics:** Strings
**File:** [`Toggle_Case_of_Every_Character.js`](./Toggle_Case_of_Every_Character.js)
**Tests:** [`Toggle_Case_of_Every_Character.test.js`](./Toggle_Case_of_Every_Character.test.js)

## Problem Statement

Given a string `str`, return a new string with the case of every letter toggled — uppercase becomes lowercase, and lowercase becomes uppercase. Non-letter characters (digits, spaces, punctuation) are left unchanged. An empty string is returned unchanged.

### Example 1

```
Input:  str = "Hello World"
Output: "hELLO wORLD"
```

### Example 2

```
Input:  str = ""
Output: ""
```

### Example 3

```
Input:  str = "AbCdEf"
Output: "aBcDeF"
```

### Example 4

```
Input:  str = "Mixed123!@#"
Output: "mIXED123!@#"   (digits and punctuation are untouched)
```

### Constraints

- `str` is a string, possibly empty, and may contain letters, digits, spaces, and punctuation.

## Use Case

This problem is a direct callback to two ideas already introduced elsewhere in this repo — per-character transformation (Replace All Spaces with a Character) and the "classify, then handle differently" shape (Count Vowels and Consonants) — combined with a peek at how characters are actually represented under the hood:

- **Character codes as the foundation of text processing** — every character a computer stores is ultimately a number (its character code); Approach 1 works directly with those numbers, which is worth understanding at least once before leaning entirely on higher-level string methods that hide it.
- **ASCII's deliberate design choice** — uppercase and lowercase English letters are exactly 32 apart in ASCII/Unicode (`'a'` is 97, `'A'` is 65), and that fixed offset is *why* a simple add-or-subtract-32 trick works at all — it's not a coincidence, it's baked into the character encoding on purpose to make case conversion cheap.
- **"Leave everything else unchanged" as the default, not an exception** — like Count Vowels and Consonants, this problem has a "does nothing to this" case (non-letters) that has to be handled explicitly, or the transformation silently corrupts things it was never supposed to touch.

## Concepts

- **Character codes and `String.fromCharCode` / `.charCodeAt`** — every character has a numeric code; `.charCodeAt(0)` reads it, and `String.fromCharCode(code)` converts a number back into a character.
- **The uppercase/lowercase offset** — uppercase `A`-`Z` occupy codes 65-90, lowercase `a`-`z` occupy 97-122, a fixed gap of 32 between a letter and its opposite case, which is what makes `code + 32` or `code - 32` work as a toggle.
- **Comparing a character to its own uppercase (or lowercase) form** — `ch === ch.toUpperCase()` is true exactly when `ch` has no lowercase form to distinguish it from (i.e. it's already uppercase, or it's not a letter at all) — a compact way to classify a character without hardcoded ranges.

## Approaches

### Approach 1 — brute force: manual loop, toggling case via character codes

**Intuition:** Read each character's numeric code. If it falls in the uppercase range, shift it up by 32 to get the lowercase version; if it falls in the lowercase range, shift it down by 32 to get the uppercase version; otherwise, leave it untouched.

**Solution:**

```js
toggleCaseApproach1(str) {
  let result = '';
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(code + 32);
    } else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(code - 32);
    } else {
      result += ch;
    }
  }
  return result;
}
```

**Dry Run** (`str = "AbCdEf"`, Example 3):

| `ch` | `code` | Range | Action | Result char | `result` after |
|---|---|---|---|---|---|
| `'A'` | `65` | uppercase | `+32` → `97` | `'a'` | `"a"` |
| `'b'` | `98` | lowercase | `-32` → `66` | `'B'` | `"aB"` |
| `'C'` | `67` | uppercase | `+32` → `99` | `'c'` | `"aBc"` |
| `'d'` | `100` | lowercase | `-32` → `68` | `'D'` | `"aBcD"` |
| `'E'` | `69` | uppercase | `+32` → `101` | `'e'` | `"aBcDe"` |
| `'f'` | `102` | lowercase | `-32` → `70` | `'F'` | `"aBcDeF"` |

Return `"aBcDeF"`. ✓ matches Example 3.

### Approach 2 — optimized: map each character, comparing it to its own uppercase form

**Intuition:** Instead of working with numeric codes directly, ask a simpler question per character: "is this character already equal to its own uppercase version?" If so, it's either an uppercase letter or a non-letter — either way, converting it to lowercase gives the right toggle (non-letters are unaffected by `toLowerCase()`). Otherwise, it must be a lowercase letter, so uppercase it.

**Solution:**

```js
toggleCaseApproach2(str) {
  return str
    .split('')
    .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join('');
}
```

**Dry Run** (`str = "Mixed123!@#"`, Example 4):

| `ch` | `ch === ch.toUpperCase()`? | Action | Result char |
|---|---|---|---|
| `'M'` | yes (`'M' === 'M'`) | `.toLowerCase()` | `'m'` |
| `'i'` | no (`'i' !== 'I'`) | `.toUpperCase()` | `'I'` |
| `'x'` | no | `.toUpperCase()` | `'X'` |
| `'e'` | no | `.toUpperCase()` | `'E'` |
| `'d'` | no | `.toUpperCase()` | `'D'` |
| `'1'`,`'2'`,`'3'` | yes (digits equal their own "uppercase") | `.toLowerCase()` (no-op on digits) | `'1'`,`'2'`,`'3'` |
| `'!'`,`'@'`,`'#'` | yes (punctuation equals its own "uppercase") | `.toLowerCase()` (no-op on punctuation) | `'!'`,`'@'`,`'#'` |

Joining gives `"mIXED123!@#"`. ✓ matches Example 4 and Approach 1's result — the digits and punctuation happened to take the "already uppercase" branch, but `toLowerCase()` leaves them unchanged regardless, so the result is correct without any explicit letter-range check.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Manual loop (character codes) | O(n) | O(n) | One code lookup and conversion per character; the result string itself is `O(n)`, unavoidable since strings are immutable. |
| `map` + `toUpperCase`/`toLowerCase` | O(n) | O(n) | Same total work, but stages the result through an intermediate array of characters (from `split`) before joining. |

Like Replace All Spaces with a Character, there's no `O(1)`-space version available here — strings are immutable, so any transformation has to build an entirely new string. The real distinction between these two approaches is technique: explicit numeric character-code math vs. relying on `toUpperCase`/`toLowerCase` to handle the actual case conversion.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including an empty string, digits-only input, all-uppercase and all-lowercase strings, and mixed letters/digits/punctuation. Verified against 7 cases plus a direct cross-check between both approaches, all in `Toggle_Case_of_Every_Character.test.js`.

## Key Takeaway

Approach 1's correctness rests entirely on the specific numeric boundaries `65`-`90` and `97`-`122` — get either range wrong by one and a letter at the edge (`'Z'`/`90` or `'a'`/`97`) silently falls through to the "leave unchanged" branch instead of toggling. Approach 2 sidesteps needing to know those boundaries at all, by asking a relative question ("is this equal to its own uppercase form?") instead of an absolute one ("is this code in this specific range?") — trading a small amount of indirection for one less place a boundary typo could hide.
