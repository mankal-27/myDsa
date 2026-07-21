# Vowel or Consonant

**Difficulty:** Easy
**Topics:** Conditionals, Strings, Sets
**File:** [`Vowel_or_Consonant.js`](./Vowel_or_Consonant.js)
**Tests:** [`Vowel_or_Consonant.test.js`](./Vowel_or_Consonant.test.js)

## Problem Statement

Given a single alphabetic character `ch` (upper or lower case), return `"Vowel"` if it's a vowel (`a`, `e`, `i`, `o`, `u`), or `"Consonant"` otherwise.

### Example 1

```
Input:  ch = "a"
Output: "Vowel"
```

### Example 2

```
Input:  ch = "b"
Output: "Consonant"
```

### Example 3

```
Input:  ch = "E"
Output: "Vowel"
```

### Example 4

```
Input:  ch = "z"
Output: "Consonant"
```

### Constraints

- `ch` is a single character from the English alphabet (`a`-`z` or `A`-`Z`).

## Use Case

Checking membership in a small, fixed set of values is one of the most common operations in string-processing problems:

- **Text processing** — counting vowels, validating usernames/passwords against allowed character sets, syllable counting, and basic NLP tokenization all start with a character classification check like this one.
- **Set membership as a pattern** — "is this value one of a fixed handful of options" generalizes far beyond vowels: checking if a character is a bracket (`()[]{}`for the classic "valid parentheses" problem), an operator, a digit, or whitespace all use the same shape.
- **Case normalization** — converting to a single case before comparison is a habit that prevents an entire category of bugs (`"E" !== "e"` trips up naive comparisons constantly), and it's the same idea behind case-insensitive search, deduplication, and sorting.

## Concepts

- **String comparison (`===`)** — comparing single characters directly.
- **`String.prototype.toLowerCase()`** — normalizing case before comparison so you only need to handle one case instead of two.
- **`Set` and `.has()`** — O(1) membership testing against a fixed collection, instead of a long chain of `||`-joined equality checks. This is the same "prefer `Set`/`Map` over long `if` chains" idea introduced in the JavaScript for DSA chapter, applied here for the first time on real data.

## Approaches

Both approaches are O(1) — there are only 5 vowels, so no method of checking membership here will ever do more than a handful of comparisons. The interesting difference is how many comparisons each style needs, and how well each one scales if the "fixed set" were larger.

### Approach 1 — explicit comparison chain

**Intuition:** The most literal way to check "is this character one of these five specific letters" is to compare it against each one directly. Since the input could be upper or lower case, and there's no case-normalization step, every vowel needs to be checked in *both* cases — 10 comparisons in the worst case (a consonant, which fails every single check).

**Solution:**

```js
vowelOrConsonantApproach1(ch) {
  if (
    ch === "a" || ch === "e" || ch === "i" || ch === "o" || ch === "u" ||
    ch === "A" || ch === "E" || ch === "I" || ch === "O" || ch === "U"
  ) {
    return "Vowel";
  }
  return "Consonant";
}
```

**Dry Run** (`ch = "E"`, Example 3):

| Step | Comparison | Result |
|---|---|---|
| 1 | `ch === "a"` | `false` |
| 2 | `ch === "e"` | `false` |
| 3 | `ch === "i"` | `false` |
| 4 | `ch === "o"` | `false` |
| 5 | `ch === "u"` | `false` |
| 6 | `ch === "A"` | `false` |
| 7 | `ch === "E"` | `true` → condition short-circuits here |

Return `"Vowel"`. ✓ matches Example 3 — but it took 7 comparisons to get there, and a consonant like `"z"` would need all 10.

### Approach 2 — normalize case, then check a Set

**Intuition:** The upper/lower-case duplication in Approach 1 is only needed because the comparison is case-sensitive. Converting `ch` to lower case first means only 5 vowels need to be checked, not 10 — and storing those 5 in a `Set` lets `.has()` check membership directly instead of chaining `||` comparisons by hand.

**Solution:**

```js
vowelOrConsonantApproach2(ch) {
  const VOWELS = new Set(["a", "e", "i", "o", "u"]);
  return VOWELS.has(ch.toLowerCase()) ? "Vowel" : "Consonant";
}
```

**Dry Run** (`ch = "E"`, Example 3):

| Step | Expression | Value |
|---|---|---|
| 1 | `ch.toLowerCase()` | `"e"` |
| 2 | `VOWELS.has("e")` | `true` |
| 3 | `true ? "Vowel" : "Consonant"` | `"Vowel"` |

Return `"Vowel"`. ✓ matches Example 3 and Approach 1's result — one case-normalization plus one set lookup, regardless of which letter is checked (no "worse case" the way Approach 1 has for consonants).

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Explicit comparison chain | O(1) | O(1) | Up to 10 fixed comparisons — constant, but the *worst case* (a consonant) is meaningfully more work than the best case (matching `"a"` on the first check). |
| Case normalization + Set | O(1) | O(1) | One `toLowerCase()` call plus one hash-based `Set.has()` lookup — consistently cheap regardless of which letter is checked, and the 5-item `Set` doesn't grow with input. |

If the "fixed set" being checked against were much larger (say, checking membership in a set of 10,000 allowed words instead of 5 vowels), the comparison-chain approach would become genuinely slow (`O(n)` in the size of the set) while the `Set`-based approach would stay `O(1)` — this problem is a small-scale preview of why `Set`/`Map` lookups are preferred over long `if` chains once the set of things you're checking against grows.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including on every vowel in both cases (`a/A, e/E, i/I, o/O, u/U`) and consonants that are easy to second-guess (`y`, which is sometimes treated as a vowel in other contexts but isn't one here). Verified against 13 cases plus a direct cross-check between both approaches, all in `Vowel_or_Consonant.test.js`.

## Key Takeaway

The comparison-chain approach needed to explicitly double every check (`"a"` *and* `"A"`) because it never normalized case — a reminder that "handle case-insensitivity" is usually cheaper to do once, up front (`toLowerCase()`), than to bake into every subsequent comparison.
