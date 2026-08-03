# Log Functions

**Difficulty:** Easy
**Topics:** Math, Logarithms, Bit Manipulation
**File:** [`log.js`](./log.js)
**Tests:** [`log.test.js`](./log.test.js)
**Related Chapter:** [Logarithms](../resources/math-logarithms.md)

## Problem Statement

Implement three small utility functions built on the "how many times do you halve/divide to reach the bottom" idea from the [Logarithms](../resources/math-logarithms.md) chapter, all for `n >= 1`:

1. `floorLog2(n)` — return `⌊log2(n)⌋`, the number of times `n` can be right-shifted (divided by 2, discarding the remainder) before it reaches `1`.
2. `countDigits(n)` — return how many decimal digits `n` has.
3. `countBits(n)` — return how many bits are needed to represent `n` in binary.

### Example 1

```
Input:  floorLog2(16)
Output: 4        (16 = 2^4)
```

### Example 2

```
Input:  floorLog2(100)
Output: 6        (2^6 = 64 <= 100 < 128 = 2^7)
```

### Example 3

```
Input:  countDigits(5000)
Output: 4
```

### Example 4

```
Input:  countBits(13)
Output: 4        (13 in binary is 1101 -- 4 bits)
```

### Example 5

```
Input:  countBits(16)
Output: 5        (16 in binary is 10000 -- 5 bits)
```

### Constraints

- `n` is an integer, `n >= 1`.
- All three functions throw on `n <= 0`.

## Use Case

- **`floorLog2`** is the direct, hands-on version of the "how many halvings" definition of a logarithm — the same reasoning that gives binary search its `O(log n)` comparison bound. Computing it by repeated right-shift (rather than `Math.log2`) makes the halving visible step by step instead of hiding it behind a library call.
- **`countDigits`** is the base-10 sibling of the same idea — repeated integer division by 10 counts digits the same way repeated halving counts bits.
- **`countBits`** ties the two together: it's exactly the "number of bits needed to represent `n`" identity from the Logarithms chapter, `⌊log2(n)⌋ + 1`, built directly on top of `floorLog2`. This identity is the reason a compact binary/serialization format can pack a small known-bounded integer into far fewer bits than a fixed 32-bit slot.

## Concepts

- **Logarithm as a counting question** — `log2(n)` answers "how many times do I halve `n` to reach 1," not just "the inverse of `2^x`."
- **Bit-shifting as division** — `n >>= 1` is integer division by 2, discarding the remainder; looping it until `n <= 1` counts the halvings directly.
- **Digit counting via repeated division** — the base-10 analog of bit counting, dividing by `10` instead of `2`.
- **Composing small functions** — `countBits` doesn't reimplement the halving logic; it reuses `floorLog2` and adds `1`, keeping the "number of bits" identity in exactly one place.

## Approaches

### `floorLog2` — repeated right-shift until `n <= 1`

**Intuition:** By definition, `log2(n)` is the number of times `n` can be divided by 2 before reaching 1. Right-shifting (`n >>= 1`) is integer division by 2; counting the shifts directly answers the question.

**Solution:**

```js
function floorLog2(n) {
    if (n <= 0) throw new Error("n must be positive")
    let result = 0;
    while (n > 1) {
        n >>= 1;
        result++
    }
    return result;
}
```

**Dry Run** (`n = 100`, Example 2):

| Step | `n` before shift | `n` after shift (`n >>= 1`) | `result` |
|---|---|---|---|
| 1 | 100 | 50 | 1 |
| 2 | 50 | 25 | 2 |
| 3 | 25 | 12 | 3 |
| 4 | 12 | 6 | 4 |
| 5 | 6 | 3 | 5 |
| 6 | 3 | 1 | 6 |

`n` is now `1`, the loop stops. Return `6`. ✓ matches Example 2 (`2^6 = 64 <= 100 < 128 = 2^7`).

### `countDigits` — repeated division by 10

**Intuition:** The same halving idea, base 10 instead of base 2: keep dividing by 10 (discarding the remainder) until nothing is left, counting how many divisions it took.

**Solution:**

```js
function countDigits(n) {
    if (n <= 0) throw new Error("n must be positive");
    let count = 0;
    while (n > 0) {
        n = Math.floor(n / 10);
        count++
    }
    return count;
}
```

**Dry Run** (`n = 5000`, Example 3):

| Step | `n` before | `n` after (`Math.floor(n/10)`) | `count` |
|---|---|---|---|
| 1 | 5000 | 500 | 1 |
| 2 | 500 | 50 | 2 |
| 3 | 50 | 5 | 3 |
| 4 | 5 | 0 | 4 |

`n` is now `0`, the loop stops. Return `4`. ✓ matches Example 3.

### `countBits` — `floorLog2(n) + 1`

**Intuition:** The number of bits needed to represent `n` in binary is exactly one more than the position of its highest set bit — which is exactly `⌊log2(n)⌋`. Rather than re-deriving that with another loop, this approach reuses `floorLog2` directly.

**Solution:**

```js
function countBits(n) {
    if (n <= 0) throw new Error("n must be positive");
    return floorLog2(n) + 1;
}
```

**Dry Run** (`n = 13`, Example 4):

`floorLog2(13)`: `13 → 6 → 3 → 1`, three shifts, so `floorLog2(13) = 3`. Then `countBits(13) = 3 + 1 = 4`. ✓ matches Example 4 (`13` is `1101` in binary — 4 bits).

## Complexity

| Function | Time | Space | Why |
|---|---|---|---|
| `floorLog2` | O(log n) | O(1) | Each iteration halves `n`, so the loop runs `⌊log2(n)⌋` times before `n` reaches 1. |
| `countDigits` | O(log n) | O(1) | Each iteration divides `n` by 10; the loop runs once per decimal digit, i.e. `⌊log10(n)⌋ + 1` times — still `O(log n)`, just a different constant base. |
| `countBits` | O(log n) | O(1) | Delegates entirely to `floorLog2`, plus one constant-time addition. |

All three are the same shape as the [Big O Notation](../resources/big-o-notation.md) chapter's `O(log n)` class: each step eliminates a constant fraction of what's left (half for bits, a tenth for digits), so the work barely grows even as `n` grows enormously — computing `floorLog2` for a billion only takes about 30 steps.

## Implementation Notes

All three functions were verified against edge cases (`n = 1`, exact powers of two/ten, values just below and just above a power boundary, and the error cases `n <= 0`) — no bugs found. One small cleanup: the file's original demo `console.log` calls at the bottom ran unconditionally on `require`, which would have printed to the console every time the test file imported `log.js`; they're now wrapped in `if (require.main === module)` so they only run when `log.js` is executed directly, and the three functions are now exported via `module.exports` so `log.test.js` can import them.

## Key Takeaway

`floorLog2`, `countDigits`, and `countBits` are three small, concrete instances of the same idea from the [Logarithms](../resources/math-logarithms.md) chapter: a logarithm is a count of "how many times do I shrink this before it's gone," and that count is what makes `O(log n)` algorithms stay fast even on enormous inputs — doubling `n` only ever costs one more loop iteration, in whatever base you're dividing by.
