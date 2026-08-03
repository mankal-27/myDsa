# Logarithms

## Why It Matters

`O(log n)` shows up constantly in this repo — binary search, balanced trees, heaps — but "logarithm" as a word tends to stay fuzzy long after the notation feels familiar. This chapter nails down what a logarithm actually computes, why computer science almost always means "log base 2" when it writes `log n`, and how that one idea explains why halving-based algorithms are so fast.

## What Is a Logarithm?

A logarithm answers a "how many times do I multiply" question — it's the inverse of exponentiation.

`log_b(x) = y` means exactly the same thing as `b^y = x`. Given a base `b` and a value `x`, the logarithm asks: *what power do I have to raise `b` to, to land on `x`?*

- `log2(8) = 3`, because `2³ = 8`.
- `log10(1000) = 3`, because `10³ = 1000`.
- `log2(1) = 0`, because anything raised to the power `0` is `1`.

### Why Base 2, Specifically

In everyday math, `log` without a subscript often means base 10. In computer science, `log n` (no base written) almost always means base 2 — and there's a concrete reason: most divide-and-conquer algorithms cut the problem in half at every step, and base-2 logarithms are exactly the tool that counts "how many halvings."

Reframe the definition this way: **`log2(n)` is the number of times you can divide `n` by 2 before you reach 1.**

- `n = 8`: `8 → 4 → 2 → 1`, three divisions. `log2(8) = 3`. ✓
- `n = 1024`: ten divisions get you to 1. `log2(1024) = 10`. ✓

This is the same fact as the exponent definition, just read in reverse — and it's the version that maps directly onto binary search.

## The Rules of Logarithms

Three algebraic rules come up constantly when simplifying complexity expressions or working through recurrences:

- **Product rule:** `log_b(a × c) = log_b(a) + log_b(c)` — multiplication inside becomes addition outside.
- **Quotient rule:** `log_b(a / c) = log_b(a) − log_b(c)` — division inside becomes subtraction outside. Check it: `log2(8/2) = log2(8) − log2(2) = 3 − 1 = 2`, and indeed `log2(4) = 2`. ✓
- **Power rule:** `log_b(a^k) = k × log_b(a)` — an exponent inside the log comes out as a multiplier. Check it: `log2(8³) = 3 × log2(8) = 3 × 3 = 9`, and `8³ = 512 = 2⁹`. ✓

### Change of Base

Most languages don't ship a `log2` function directly — JavaScript's `Math.log()` computes the *natural* log (base `e`). The change-of-base formula converts between bases:

```js
function log2(x) {
  return Math.log(x) / Math.log(2);
}

function logBase(x, base) {
  return Math.log(x) / Math.log(base);
}
```

(Modern JavaScript actually does have `Math.log2()` built in — worth knowing the manual version anyway, since not every language provides one.) It doesn't matter which base you convert through — `ln`, `log10`, anything works, because the ratio cancels out the base. This is also *why* Big-O notation never bothers writing the base: `log2(n)` and `log10(n)` differ only by a fixed multiplier (`log2(n) ≈ 3.32 × log10(n)`), and constant factors get dropped under Big-O (see [Big O Notation → Rule 3](big-o-notation.md#four-rules-for-calculating-big-o)).

## The Halving Connection: Binary Search

[`Binary Search`](big-o-notation.md#o-log-n--logarithmic-time) is the canonical `O(log n)` algorithm precisely because of the "how many halvings" framing above. Each comparison throws away half the remaining search space, so the question "how many comparisons until one element is left?" is literally asking `log2(n)`.

Solving `n / 2^k = 1` for `k` gives `k = log2(n)` — the maximum number of comparisons binary search needs is `⌊log2(n)⌋ + 1`.

| Input size `n` | Max comparisons |
|---|---|
| 8 | 3 |
| 1,000 | 10 |
| 1,000,000 | 20 |
| 1,000,000,000 | 30 |

The same halving logic governs any balanced binary search tree (each comparison eliminates one subtree) and any binary heap (height `= ⌊log2(n)⌋`, so insert/extract cost `O(log n)`).

## Logarithms and Bit Length

A useful, less-obvious identity: the number of bits needed to represent a positive integer `n` in binary is `⌊log2(n)⌋ + 1`.

```js
function bitLength(n) {
  return Math.floor(Math.log2(n)) + 1;
}
```

`13` in binary is `1101` — 4 bits — and `⌊log2(13)⌋ + 1 = ⌊3.70⌋ + 1 = 3 + 1 = 4`. ✓ This is the same idea as the halving definition in disguise: repeatedly halving 13 (integer division) takes exactly 4 steps to hit 0 (`13→6→3→1→0`), one step per bit.

## Real-World Problems & Solutions

### 1. Single-Elimination Tournament Rounds

**Scenario:** A knockout tournament has 64 teams, one loser eliminated per match, one winner crowned. How many rounds are needed?

```js
function tournamentRounds(numTeams) {
  return Math.ceil(Math.log2(numTeams));
}
console.log(tournamentRounds(64)); // 6
```

Each round halves the number of remaining teams (64 → 32 → 16 → 8 → 4 → 2 → 1), so the round count is exactly the "how many halvings to reach 1" definition of `log2`. `Math.ceil` handles team counts that aren't a clean power of 2 (some players get a "bye" in the first round).

### 2. Sizing a Database Index for a Target Lookup Speed

**Scenario:** A product catalog needs lookups to complete in at most 25 comparisons using a balanced index (B-tree/BST-style). What's the largest catalog size that guarantees this?

```js
function maxSizeForComparisons(maxComparisons) {
  return Math.floor(Math.pow(2, maxComparisons));
}
console.log(maxSizeForComparisons(25)); // 33,554,432
```

This inverts the binary-search bound: if `⌊log2(n)⌋ + 1 ≤ 25`, then `n ≤ 2^25`. A balanced index over roughly 33.5 million rows still guarantees answers within 25 comparisons — the same reasoning that makes binary search practical on huge sorted datasets.

### 3. Compact Integer Encoding

**Scenario:** A network protocol wants to encode a list of small non-negative integers (all known to be under 300) using the fewest bits per value, instead of a fixed 32-bit `int` per entry.

```js
function bitsNeeded(maxValue) {
  return Math.floor(Math.log2(maxValue)) + 1;
}
console.log(bitsNeeded(300)); // 9 (2^9 = 512 ≥ 300)
```

Using the bit-length identity, values up to 300 fit in 9 bits instead of 32 — a real bandwidth saving in protocols that pack many such values (this is the same idea behind variable-width integer encodings used in serialization formats).

## Key Takeaway

A logarithm is a counting question in disguise — "how many times do I halve (or multiply) to get there?" — and that's exactly why `O(log n)` algorithms feel almost free even on huge inputs: doubling the input only ever costs one more halving step. Whenever an algorithm eliminates a constant fraction of the remaining work at each step (not just one element), suspect `O(log n)` and reach for this chapter's identities to confirm it.
