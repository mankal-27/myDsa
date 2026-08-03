# Combinatorics

## Why It Matters

Combinatorics answers "how many ways" questions — how many ways to arrange a set, how many ways to choose from it — and those questions turn up everywhere from counting subsets in a backtracking problem to estimating whether a brute-force search is even feasible (this is the exact math behind the `O(2ⁿ)` and `O(n!)` complexity classes in [Big O Notation](big-o-notation.md#o2%E2%81%BF--exponential-time)). This chapter covers the two core counting tools — permutations and combinations — and how to compute them without the numbers exploding along the way.

## Permutations vs. Combinations: Does Order Matter?

Both permutations and combinations count ways of selecting `r` items from a set of `n`. The entire difference comes down to one question: **does the order of selection matter?**

- **Permutations** — order matters. Picking `{A, B}` is different from picking `{B, A}`. Think: assigning 1st, 2nd, 3rd place in a race.
- **Combinations** — order doesn't matter. `{A, B}` and `{B, A}` are the same selection. Think: choosing a 3-person committee, where nobody is "more chosen" than anyone else.

### Permutations: `nPr = n! / (n − r)!`

The number of ways to arrange `r` items out of `n`, where order matters. Reasoning it out directly: there are `n` choices for the first slot, `n − 1` remaining choices for the second slot, `n − 2` for the third, and so on for `r` slots — `n × (n−1) × ... × (n−r+1)`, which is exactly `n! / (n−r)!`.

```js
function factorial(k) {
  let result = 1;
  for (let i = 2; i <= k; i++) result *= i;
  return result;
}

function nPr(n, r) {
  return factorial(n) / factorial(n - r);
}

nPr(5, 3); // 60 -- arranging 3 of 5 runners into 1st/2nd/3rd place
```

`5 × 4 × 3 = 60` — five choices for 1st place, four remaining for 2nd, three remaining for 3rd.

### Combinations: `nCr = n! / (r! × (n − r)!)`

The number of ways to *choose* `r` items out of `n`, where order doesn't matter. Every group of `r` chosen items could have been arranged in `r!` different orders — so combinations are just permutations with that overcounting divided back out:

```js
function nCr(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

nCr(5, 3); // 10 -- choosing a 3-person committee from 5 people
```

`nPr(5,3) = 60` counted every ordered arrangement; dividing by `3! = 6` (the number of orders each 3-person group could appear in) collapses that down to `10` distinct, unordered groups.

## Avoiding Factorial Overflow

`factorial(n)` grows explosively — `factorial(20)` already exceeds what a 64-bit integer can hold exactly, and JavaScript's floating-point numbers start losing precision well before that. Computing `nCr` via three separate huge factorials, then dividing, is both slow and numerically risky for anything but small `n`.

The multiplicative formula avoids ever forming the full factorials by building up the result term-by-term and dividing as it goes:

```js
function nCrSafe(n, r) {
  if (r > n - r) r = n - r; // nCr(n, r) === nCr(n, n - r); pick the smaller side
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

nCrSafe(5, 3);   // 10
nCrSafe(30, 15); // 155117520 -- computable directly; factorial(30) would already overflow safe integer precision
```

Each step multiplies by the next numerator term and divides by the next denominator term immediately, so the running value stays close to the final answer's size instead of ballooning to `n!` first. This is the standard technique for computing binomial coefficients for realistic input sizes.

## Pascal's Triangle

Combinations satisfy a recurrence that doesn't need factorials or division at all: `nCr(n, r) = nCr(n−1, r−1) + nCr(n−1, r)`. Each entry is the sum of the two entries above it — this is exactly Pascal's Triangle.

```
        nCr(0,0)                          1
      nCr(1,0) nCr(1,1)                 1   1
   nCr(2,0) nCr(2,1) nCr(2,2)          1  2   1
 nCr(3,0) nCr(3,1) nCr(3,2) nCr(3,3)  1  3   3   1
```

**Why the recurrence holds:** pick any specific item `X` from the `n` available. Every `r`-sized group either includes `X` or it doesn't — if it includes `X`, the remaining `r−1` items are chosen from the other `n−1` (`nCr(n−1, r−1)` ways); if it excludes `X`, all `r` items are chosen from the other `n−1` (`nCr(n−1, r)` ways). Every group falls into exactly one of those two cases, so the counts add.

```js
function buildPascalsTriangle(numRows) {
  const triangle = [];
  for (let row = 0; row < numRows; row++) {
    const current = new Array(row + 1).fill(1);
    for (let col = 1; col < row; col++) {
      current[col] = triangle[row - 1][col - 1] + triangle[row - 1][col];
    }
    triangle.push(current);
  }
  return triangle;
}

buildPascalsTriangle(5);
// [ [1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1] ]
```

This is a good building-block problem for a future addition to this repo's Recursion module (each entry only depends on the row above it, and the recurrence maps directly onto a memoized recursive function).

## Real-World Problems & Solutions

### 1. Lottery Odds

**Scenario:** A lottery draws 6 numbers (in no particular order) from a pool of 49. What are the odds of matching all 6 with a single ticket?

```js
const totalCombinations = nCrSafe(49, 6);
console.log(totalCombinations); // 13,983,816
console.log(`1 in ${totalCombinations}`); // 1 in 13983816
```

Since the drawn numbers' order doesn't matter (drawing `{3, 17, 22, 29, 41, 45}` in any sequence is the same winning ticket), this is a combinations problem, not a permutations one — using `nPr` here would wildly overcount and understate the true odds.

### 2. PIN Code Counting (Permutations With Repetition)

**Scenario:** How many distinct 4-digit PIN codes exist, where digits can repeat (e.g. `1122` is valid)?

```js
function permutationsWithRepetition(numChoices, slots) {
  return Math.pow(numChoices, slots);
}

permutationsWithRepetition(10, 4); // 10000 -- 0000 through 9999
```

This isn't `nPr` at all — `nPr` assumes items can't repeat once used. When repetition is allowed, each of the `slots` positions independently has the full `numChoices` options, so the count is simply `numChoices^slots` — the same `O(k^n)`-shaped growth that appears in exponential-time brute-force enumeration.

### 3. Round-Robin Tournament Scheduling

**Scenario:** A league of 10 teams wants every team to play every other team exactly once. How many total matches need to be scheduled?

```js
nCrSafe(10, 2); // 45
```

Each match is an unordered pair of teams — "Team A vs Team B" is the same matchup as "Team B vs Team A" — so this is `nCr(10, 2)`, not `nPr(10, 2)`. This is also why `nCr(n, 2) = n(n−1)/2` shows up so often as a shorthand for "number of pairs" in complexity analysis (it's exactly the number of comparisons a nested loop over `n` items with `j > i` performs, tying directly back to the `O(n²)` examples in [Big O Notation](big-o-notation.md#o2%C2%B2--quadratic-time)).

### 4. Password Strength Estimation

**Scenario:** Estimate how many possible 8-character passwords exist using lowercase letters, uppercase letters, and digits (62 possible characters per position), to gauge how long a brute-force attack would take.

```js
const possiblePasswords = permutationsWithRepetition(62, 8);
console.log(possiblePasswords); // 218340105584896
```

Over 218 trillion possibilities — this combinatorial count is the actual basis for "time to crack" estimates in security discussions: divide the total count by an attacker's guesses-per-second to get a worst-case cracking time, and use it to justify why longer passwords (or larger character sets) matter far more than intuition suggests, since the count grows exponentially with length.

## Key Takeaway

The one question that separates every combinatorics problem into the right formula is "does order matter?" — permutations when it does, combinations when it doesn't, and `numChoices^slots` when repetition is allowed on top of either. Computing these efficiently (multiplicative formula, or Pascal's Triangle) matters just as much as picking the right formula — factorial-first approaches overflow or lose precision well before problem sizes get interesting.
