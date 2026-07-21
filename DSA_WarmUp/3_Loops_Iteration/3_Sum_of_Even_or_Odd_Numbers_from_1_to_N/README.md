# Sum of Even or Odd Numbers from 1 to N

**Difficulty:** Easy
**Topics:** Loops, Operators, Math (arithmetic series)
**File:** [`Sum_of_Even_or_Odd_Numbers_from_1_to_N.js`](./Sum_of_Even_or_Odd_Numbers_from_1_to_N.js)
**Tests:** [`Sum_of_Even_or_Odd_Numbers_from_1_to_N.test.js`](./Sum_of_Even_or_Odd_Numbers_from_1_to_N.test.js)

## Problem Statement

Given a non-negative integer `n` and a `type` (either `"even"` or `"odd"`), return the sum of all numbers of that type from `1` to `n` (inclusive).

### Example 1

```
Input:  n = 10, type = "even"
Output: 30   (2 + 4 + 6 + 8 + 10)
```

### Example 2

```
Input:  n = 10, type = "odd"
Output: 25   (1 + 3 + 5 + 7 + 9)
```

### Example 3

```
Input:  n = 1, type = "even"
Output: 0    (no even numbers between 1 and 1)
```

### Example 4

```
Input:  n = 1, type = "odd"
Output: 1
```

### Constraints

- `n` is a non-negative integer.
- `type` is either `"even"` or `"odd"`.

## Use Case

Summing a filtered range is "loop + condition + accumulator," one of the most common shapes in all of programming — and this problem is also a clean entry point into a much bigger idea:

- **Filtered aggregation** — computing a sum/count/average over "only the items matching some condition" is the exact shape behind SQL's `WHERE` + `SUM`, spreadsheet `SUMIF`, and analytics dashboards everywhere.
- **Closed-form formulas replacing loops** — this is the clearest possible example in this repo of an `O(n)` loop collapsing into an `O(1)` formula, because the formulas are simple, well-known identities (see Concepts below) rather than anything approximate. It's the same idea as the Simple Interest and Convert Seconds problems, but even more direct.
- **Gauss's trick** — the underlying identity (`1 + 2 + ... + k = k(k+1)/2`) is the famously "reinvented in grade school" formula (Gauss allegedly derived it as a child by pairing the first and last numbers). Recognizing "this loop is just summing consecutive integers" is a skill that pays off constantly.

## Concepts

- **Arithmetic series** — the sum of the first `k` positive integers is `k(k+1)/2`; scaling by 2 gives the sum of the first `k` even numbers, `2 + 4 + ... + 2k = k(k+1)`.
- **Sum of consecutive odd numbers is a perfect square** — `1 + 3 + 5 + ... + (2m-1) = m²`, a classic identity worth recognizing on sight.
- **Counting how many even/odd numbers exist up to `n`** — `Math.floor(n / 2)` evens, `Math.ceil(n / 2)` odds, from `1` to `n`.

## Approaches

### Approach 1 — brute force: partition into two arrays, then sum

**Intuition:** Walk through every number from `1` to `n` once, sorting each one into an "evens" bucket or an "odds" bucket as you go — building both lists in a single pass, even though only one of them will actually get used. Once the buckets are built, summing whichever one matches the requested `type` is a one-line `reduce`.

**Solution:**

```js
sumEvenOrOddApproach1(n, type) {
  let arrayListEven = [], arrayListOdd = [];
  for (let i = 1; i <= n; i++) {
    if (i % 2 === 0) {
      arrayListEven.push(i);
    } else {
      arrayListOdd.push(i);
    }
  }
  if (type === "even") {
    return arrayListEven.reduce((acc, curr) => acc + curr, 0);
  } else if (type === "odd") {
    return arrayListOdd.reduce((acc, curr) => acc + curr, 0);
  }
}
```

**Dry Run** (`n = 10, type = "odd"`, Example 2):

| `i` | `i % 2 === 0`? | `arrayListEven` after | `arrayListOdd` after |
|---|---|---|---|
| 1 | no | `[]` | `[1]` |
| 2 | yes | `[2]` | `[1]` |
| 3 | no | `[2]` | `[1, 3]` |
| 4 | yes | `[2, 4]` | `[1, 3]` |
| 5 | no | `[2, 4]` | `[1, 3, 5]` |
| 6 | yes | `[2, 4, 6]` | `[1, 3, 5]` |
| 7 | no | `[2, 4, 6]` | `[1, 3, 5, 7]` |
| 8 | yes | `[2, 4, 6, 8]` | `[1, 3, 5, 7]` |
| 9 | no | `[2, 4, 6, 8]` | `[1, 3, 5, 7, 9]` |
| 10 | yes | `[2, 4, 6, 8, 10]` | `[1, 3, 5, 7, 9]` |

Loop ends. Since `type === "odd"`, return `arrayListOdd.reduce((acc, curr) => acc + curr, 0)` → `1+3+5+7+9 = 25`. ✓ matches Example 2.

### Approach 2 — optimized: closed-form formula

**Intuition:** The even numbers from `1` to `n` are `2, 4, ..., 2k` where `k = Math.floor(n / 2)` — that's `2 × (1 + 2 + ... + k)`, which is `2 × k(k+1)/2 = k(k+1)` by the classic arithmetic-series identity. Similarly, the odd numbers `1, 3, ..., (2m-1)` where `m = Math.ceil(n / 2)` always sum to exactly `m²` — a well-known identity (visually: each new odd number added extends a square by one row and one column). Both sums can be computed directly, with no loop at all.

**Solution:**

```js
sumEvenOrOddApproach2(n, type) {
  if (type === "even") {
    const k = Math.floor(n / 2);
    return k * (k + 1);
  } else {
    const m = Math.ceil(n / 2);
    return m * m;
  }
}
```

**Dry Run** (`n = 10, type = "odd"`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `m = Math.ceil(10 / 2)` | `5` (there are 5 odd numbers from 1 to 10: 1,3,5,7,9) |
| 2 | `m * m` | `5 * 5 = 25` |

Return `25`. ✓ matches Example 2 and Approach 1's result, computed in 2 steps instead of a 10-iteration loop.

**Dry Run** (`n = 7, type = "even"`, an odd `n` to show the `Math.floor` rounding):

| Step | Expression | Value |
|---|---|---|
| 1 | `k = Math.floor(7 / 2)` | `3` (there are 3 even numbers from 1 to 7: 2,4,6) |
| 2 | `k * (k + 1)` | `3 * 4 = 12` |

Return `12` — matches `2 + 4 + 6 = 12`.

### Bonus — brute force with bitwise parity check

**Intuition:** Same loop-and-accumulate shape as Approach 1, but swapping the parity test for the bitwise version from the Even or Odd problem: `(i & 1) === 0` reads `i`'s last binary bit directly (`0` for even, `1` for odd) instead of asking `%` for a remainder. Since `%` and `&` answer the exact same question here, this is a drop-in substitute — proof that the two techniques from Even or Odd generalize beyond that one problem.

**Solution:**

```js
sumEvenOrOddBonusBitwise(n, type) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    if (type === "even" && (i & 1) === 0) {
      sum += i;
    } else if (type === "odd" && (i & 1) === 1) {
      sum += i;
    }
  }
  return sum;
}
```

**Dry Run** (`n = 10, type = "odd"`, Example 2):

| `i` | `i & 1` | `(i & 1) === 1`? | `sum` after |
|---|---|---|---|
| 1 | `1` | yes | `1` |
| 2 | `0` | no | `1` |
| 3 | `1` | yes | `4` |
| 4 | `0` | no | `4` |
| 5 | `1` | yes | `9` |
| 6 | `0` | no | `9` |
| 7 | `1` | yes | `16` |
| 8 | `0` | no | `16` |
| 9 | `1` | yes | `25` |
| 10 | `0` | no | `25` |

Return `25`. ✓ matches Example 2 and both other approaches — same loop shape as Approach 1, one bitwise comparison instead of one modulo.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (partition + reduce) | O(n) | O(n) | One iteration to build both arrays (which together always hold exactly `n` elements total), plus one more pass over whichever array gets reduced. The space cost is real here — unlike a single running-total accumulator, this version keeps every number in memory before summing. |
| Optimized (formula) | O(1) | O(1) | A fixed number of arithmetic operations, independent of how large `n` is. |
| Bonus (bitwise brute force) | O(n) | O(1) | Same loop as Approach 1's shape but with a single running total instead of two arrays — one bitwise comparison per iteration, same complexity class as any modulo-based loop. |

Note the space difference is specific to *this* brute-force implementation, not brute force in general — a version using a single running total (`sum += i`) instead of building arrays would be O(n) time but only O(1) space. Building the intermediate arrays trades some memory for a `.reduce()`-based summing style.

## Implementation Notes

The submitted `sumEvenOrOddApproach1` had one bug: the parity check was written as `if (i && 1 === 0)` instead of `if (i % 2 === 0)`. Because `===` binds tighter than `&&`, this parsed as `i && (1 === 0)` — and `1 === 0` is always `false`, so the whole condition was always `false` regardless of `i`. Every number from `1` to `n` silently fell into the `else` branch (`arrayListOdd`), which meant `arrayListEven` was always empty (`sumEvenOrOddApproach1(10, "even")` returned `0` instead of `30`) and `arrayListOdd` always ended up holding *every* number, not just the odd ones (`sumEvenOrOddApproach1(10, "odd")` returned `55`, the sum of 1 through 10, instead of `25`). Fixed to `i % 2 === 0`, which correctly partitions numbers by parity.

`sumEvenOrOddApproach2` (the closed-form formula) was correct as submitted — no bugs found. Verified both against 10 cases (all four examples, `n = 0`, an odd `n`, and a larger `n`) plus a direct cross-check between both approaches, all in `Sum_of_Even_or_Odd_Numbers_from_1_to_N.test.js`.

## Key Takeaway

`i && 1 === 0` versus `i % 2 === 0` is a great reminder that JS operator precedence isn't always what a quick read suggests — `&&` has *lower* precedence than `===`, so mixed expressions like this get grouped in a way that's easy to misjudge. When in doubt, parenthesize explicitly (`(i % 2) === 0` or similar) rather than relying on precedence rules you'd have to look up.
