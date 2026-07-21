# Quotient and Remainder of a Division

**Difficulty:** Easy
**Topics:** Variables, Operators, Loops, Bit Manipulation (bonus)
**File:** [`Quotient_and_Remainder_of_Division.js`](./Quotient_and_Remainder_of_Division.js)
**Tests:** [`Quotient_and_Remainder_of_Division.test.js`](./Quotient_and_Remainder_of_Division.test.js)

## Problem Statement

Given two integers `dividend` and `divisor` (`divisor != 0`), return `[quotient, remainder]` using **truncating division** — the quotient rounds toward zero, and the remainder takes the sign of the `dividend`. This is the same convention JS's native `/` (combined with `Math.trunc`) and `%` operators already use.

### Example 1

```
Input:  dividend = 13, divisor = 4
Output: [3, 1]
```

### Example 2

```
Input:  dividend = -13, divisor = 4
Output: [-3, -1]
```

### Example 3

```
Input:  dividend = 13, divisor = -4
Output: [-3, 1]
```

### Example 4

```
Input:  dividend = 0, divisor = 5
Output: [0, 0]
```

### Constraints

- `dividend` and `divisor` are integers.
- `divisor != 0`.
- Either value may be negative.

## Use Case

Division and remainder are two of the most heavily used operations in DSA, well beyond arithmetic problems:

- **Hashing** — `key % tableSize` is the standard way to map a key into a fixed number of buckets in a hash table.
- **Cyclic/circular structures** — indexing into a circular buffer or circular queue (`index % length`), or wraparound logic in general.
- **The repeated-subtraction (brute force) approach is literally how division is implemented at the hardware level** for architectures without a dedicated divide instruction, and the doubling trick mentioned below is the exact technique behind LeetCode's classic "Divide Two Integers" problem (dividing without using `/` at all) and behind fast exponentiation-style algorithms in general.

## Concepts

- **Truncating vs. flooring division** — JS's `/` + `Math.trunc` rounds toward zero (`-13 / 4` truncates to `-3`), which differs from "floored" division used in some languages (e.g. Python's `//` would give `-4` for the same input). Knowing which convention a problem expects matters.
- **Sign handling** — working out the sign of the quotient and remainder independently of the magnitude calculation.
- **Loops** — using a `while` loop to repeatedly subtract until nothing is left to subtract.
- **Bit shifting (bonus)** — doubling a value with `<<` is a cheap way to "guess" how many divisor-multiples fit at once instead of subtracting one at a time.

## Approaches

### Brute Force — repeated subtraction

**Intuition:** Division answers "how many times does `divisor` fit into `dividend`?" — and the most literal way to answer that is to actually count: keep subtracting `divisor` until there isn't enough left, tallying how many subtractions it took. Whatever's left over at the end is the remainder.

**Solution:**

```js
divideBruteForce(dividend, divisor) {
  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const divisorAbs = Math.abs(divisor);

  let quotient = 0;
  while (remaining >= divisorAbs) {
    remaining -= divisorAbs;
    quotient++;
  }

  quotient = negative ? -quotient : quotient;
  const remainder = dividend < 0 ? -remaining : remaining;
  return [quotient, remainder];
}
```

Correct, but painfully slow when the quotient is large — dividing `1000000` by `1` takes a million subtractions to compute an answer that's obvious at a glance.

**Dry Run** (`dividend = 13, divisor = 4`, Example 1):

`negative = (13 < 0) !== (4 < 0) = false !== false = false`. `remaining = 13`, `divisorAbs = 4`.

| Iteration | `remaining >= 4`? | `remaining -= 4` | `quotient++` |
|---|---|---|---|
| 1 | `13 >= 4` → yes | `remaining = 9` | `quotient = 1` |
| 2 | `9 >= 4` → yes | `remaining = 5` | `quotient = 2` |
| 3 | `5 >= 4` → yes | `remaining = 1` | `quotient = 3` |
| 4 | `1 >= 4` → no | loop ends | — |

`quotient = 3` (not negated, `negative` is `false`), `remainder = 1` (dividend is positive). Return `[3, 1]`. ✓ matches Example 1.

### Optimized — native `/` and `%`

**Intuition:** Every one of those repeated subtractions above is doing the same fixed piece of work — the loop is really just answering "how many whole `divisor`-sized chunks fit in `dividend`," which is the literal definition of division. The engine already has a hardware-level division instruction for that; there's no need to simulate it by hand.

**Solution:**

```js
divideOptimized(dividend, divisor) {
  const quotient = Math.trunc(dividend / divisor);
  const remainder = dividend % divisor;
  return [quotient, remainder];
}
```

One division, one modulo — done. This is how you'd actually write this in real code.

**Dry Run** (`dividend = 13, divisor = 4`):

| Step | Expression | Value |
|---|---|---|
| 1 | `13 / 4` | `3.25` |
| 2 | `Math.trunc(3.25)` | `3` |
| 3 | `13 % 4` | `1` |

Return `[3, 1]`. ✓ matches Example 1 and the brute-force result above, in 2 operations instead of a 3-iteration loop.

### Bonus — doubling (exponential subtraction)

**Intuition:** The brute-force loop wastes effort subtracting `divisor` one copy at a time even when it's obvious *way* more than one copy still fits. Instead, double the chunk being subtracted (`divisor`, `2×divisor`, `4×divisor`, ...) for as long as it still fits inside what's left, then subtract that largest chunk in one shot and repeat. This is the same "collapse a loop of repeated operations into repeated doubling" idea used for fast exponentiation — the core trick behind LeetCode's "Divide Two Integers."

**Solution:**

```js
divideDoubling(dividend, divisor) {
  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const divisorAbs = Math.abs(divisor);

  let quotient = 0;
  while (remaining >= divisorAbs) {
    let multiple = divisorAbs;
    let count = 1;
    while (remaining >= (multiple << 1)) {
      multiple <<= 1;
      count <<= 1;
    }
    remaining -= multiple;
    quotient += count;
  }

  quotient = negative ? -quotient : quotient;
  const remainder = dividend < 0 ? -remaining : remaining;
  return [quotient, remainder];
}
```

**Dry Run** (`dividend = 100, divisor = 7`, a bigger example so the doubling is visible — expected `[14, 2]`):

`remaining = 100`, `divisorAbs = 7`.

**Outer pass 1** — double `multiple` while it still fits under `remaining = 100`:

| `multiple` | `count` | `multiple << 1` fits in 100? |
|---|---|---|
| `7` | `1` | `14 <= 100` → keep doubling |
| `14` | `2` | `28 <= 100` → keep doubling |
| `28` | `4` | `56 <= 100` → keep doubling |
| `56` | `8` | `112 <= 100`? no → stop |

Subtract: `remaining = 100 - 56 = 44`, `quotient = 0 + 8 = 8`.

**Outer pass 2** — `remaining = 44`:

`multiple` doubles `7 → 14 → 28` (since `28 <= 44` but `56 > 44`, stop at `multiple = 28, count = 4`). Subtract: `remaining = 44 - 28 = 16`, `quotient = 8 + 4 = 12`.

**Outer pass 3** — `remaining = 16`:

`multiple` doubles `7 → 14` (since `14 <= 16` but `28 > 16`, stop at `multiple = 14, count = 2`). Subtract: `remaining = 16 - 14 = 2`, `quotient = 12 + 2 = 14`.

`remaining = 2 < 7 = divisorAbs`, outer loop ends. Return `[14, 2]` — same answer `Math.trunc(100/7) = 14, 100 % 7 = 2` would give, reached in **3 outer passes** instead of **14 single subtractions**.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (repeated subtraction) | O(dividend / divisor) | O(1) | One loop iteration per unit of quotient — degenerates badly when the quotient is large (e.g. dividing by 1). |
| Optimized (native `/`, `%`) | O(1) | O(1) | Hardware/engine-level division, constant time regardless of input size. |
| Bonus (doubling) | O(log(dividend / divisor)) | O(1) | Each outer-loop pass at least doubles how much is subtracted, so the number of passes grows logarithmically instead of linearly with the quotient. |

## Implementation Notes

`divideOptimized` had one bug: it used `Math.abs(dividend / divisor)` instead of `Math.trunc(dividend / divisor)`. `Math.abs` only strips the sign — it does nothing to the decimal portion, so `13 / 4` stayed `3.25` instead of truncating to `3`, and because it's `abs`, the result was also always non-negative, losing the correct sign for cases like `13 / -4` (which should give a *negative* quotient, `-3`). Fixed to `Math.trunc`, which both truncates toward zero and preserves sign correctly (`Math.trunc(13 / -4) === -3`).


## Key Takeaway

`Math.abs` and `Math.trunc` solve two completely different problems — one removes the sign, the other removes the decimal — and it's easy to reach for the wrong one when you're thinking "I just want a clean positive-ish integer out of this." Worth double-checking which one a formula actually needs before wiring it in.
