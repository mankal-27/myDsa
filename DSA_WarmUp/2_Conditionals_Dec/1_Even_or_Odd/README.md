# Even or Odd

**Difficulty:** Easy
**Topics:** Conditionals, Operators, Bit Manipulation
**File:** [`Even_or_Odd.js`](./Even_or_Odd.js)
**Tests:** [`Even_or_Odd.test.js`](./Even_or_Odd.test.js)

## Problem Statement

Given an integer `num`, return `"Even"` if it's even, or `"Odd"` if it's odd.

### Example 1

```
Input:  num = 4
Output: "Even"
```

### Example 2

```
Input:  num = 7
Output: "Odd"
```

### Example 3

```
Input:  num = 0
Output: "Even"
```

### Example 4

```
Input:  num = -3
Output: "Odd"
```

### Constraints

- `num` is an integer and may be negative, zero, or positive.

## Use Case

This is the simplest possible decision-making problem, but the technique behind the optimized approach — checking the least significant bit — is a building block for much bigger things:

- **Parity checks** — the exact same "look at the last bit" trick is used in checksums, error-detecting codes, and hashing.
- **Bit Manipulation pattern** — `num & 1` is usually the very first bitwise trick anyone learns, and it opens the door to the rest of the pattern: masking specific bits, toggling flags, and packing multiple boolean values into a single integer.
- **Branch-based decision logic** — even at this trivial scale, this is the first real exercise in "compute something, then branch on it," which is the entire theme of this module.

## Concepts

- **Modulo (`%`) vs. bitwise AND (`&`)** — two different ways to inspect a number's parity. Both run in constant time in practice, but they get there differently: `%` asks the CPU's division hardware for a remainder, while `&` is a single bitwise comparison — no division involved at all.
- **Conditionals** — turning a boolean check into one of two fixed string outputs.
- **Two's complement & the least significant bit** — why `num & 1` correctly detects parity even for negative numbers in JS (bitwise operators work on the 32-bit two's complement representation, and the least significant bit still reliably indicates even/odd regardless of sign). Modulo also handles negative numbers correctly in JS — `-4 % 2 === 0` — but it's worth knowing that `%` in JS returns a *remainder*, not a *modulus*, and can return negative results (e.g. `-3 % 2 === -1`) for odd negative numbers, which is why the check is `=== 0` rather than comparing against a specific truthy remainder.

## Approaches

### Approach 1 — modulo check (`%`)

**Intuition:** Parity is *defined* by divisibility: a number is even exactly when it divides evenly by 2, i.e. has no remainder. `%` gives you that remainder directly, so checking `num % 2 === 0` is the most literal, conventional translation of "is this number evenly divisible by 2" into code — no loop needed, just one division operation.

**Solution:**

```js
evenOrOddBruteForce(num) {
  if (num % 2 === 0) {
    return "Even";
  } else {
    return "Odd";
  }
}
```

**Dry Run** (`num = 7`, Example 2):

| Step | Expression | Value |
|---|---|---|
| 1 | `7 % 2` | `1` |
| 2 | `1 === 0`? | `false` → take the `else` branch |
| 3 | `return "Odd"` | |

Return `"Odd"`. ✓ matches Example 2.

**Dry Run** (`num = -3`, Example 4 — worth tracing since negative remainders can be surprising):

| Step | Expression | Value |
|---|---|---|
| 1 | `-3 % 2` | `-1` (JS `%` keeps the sign of the dividend, so this is `-1`, not `1`) |
| 2 | `-1 === 0`? | `false` → take the `else` branch |
| 3 | `return "Odd"` | |

Return `"Odd"`. ✓ matches Example 4 — the check works correctly for negative odd numbers precisely *because* it only asks "is the remainder exactly `0`," which sidesteps needing to know whether a non-zero remainder is `1` or `-1`.

### Approach 2 — bitwise AND with 1

**Intuition:** In binary, every even number ends in `0` and every odd number ends in `1` — that's literally what the last bit means (it's the "ones place" in base 2). `num & 1` isolates just that last bit by comparing every bit of `num` against `1` (which is all zeros except its own last bit), so the result is `1` if `num` is odd and `0` if it's even — no loop needed, and it works for negative numbers too because two's complement preserves the last bit as the parity indicator.

**Solution:**

```js
evenOrOddOptimized(num) {
  return (num & 1) === 0 ? "Even" : "Odd";
}
```

`num & 1` keeps only the least significant bit — `0` for even numbers, `1` for odd ones — regardless of sign, in a single operation.

**Dry Run** (`num = -3`, Example 4; shown as 32-bit two's complement bit patterns):

| Step | Expression | Binary | Decimal |
|---|---|---|---|
| 0 | `num` | `...11111101` | `-3` |
| 1 | `1` | `...00000001` | `1` |
| 2 | `num & 1` (compare every bit; only the last bit is `1` in both) | `...00000001` | `1` |
| 3 | `1 === 0`? | — | `false` |

Return `"Odd"`. ✓ matches Example 4 — no sign-handling needed here either; `&` reads the last bit directly regardless of sign.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Modulo (`%`) | O(1) | O(1) | One division/remainder operation, regardless of how large `num` is. |
| Bitwise AND (`&`) | O(1) | O(1) | One bitwise comparison, regardless of how large `num` is. |

Both approaches are O(1) — there's no asymptotic complexity gap to close here (unlike, say, the Convert Seconds or Divide problems, where a genuinely slow loop-based version exists). The interesting comparison instead is *how* each one computes the same answer: `%` goes through the CPU's division circuitry to produce a remainder, while `&` is a single bit comparison with no division at all. In practice `&` is typically a hair faster at the hardware level, but for a value this size the difference is not something you'd ever notice or need to optimize for — `%` is the more conventional, more readable choice for this specific check, and that's a perfectly good reason to prefer it in real code.

## Implementation Notes

Both `evenOrOddBruteForce` (modulo check) and `evenOrOddOptimized` (bitwise AND) were implemented correctly — no bugs found, including on the negative-number cases where it's easy to trip up (`-3 % 2` returns `-1` in JS, not `1`, which is why the check compares against `0` rather than a specific remainder value).

Note: the original plan for this problem was to contrast a genuinely slow brute-force loop (repeated subtraction) against the O(1) bitwise trick, matching the pattern used in earlier problems. The implementation instead used a modulo check for the first approach, which is also O(1) — so this problem ended up demonstrating something different but still worthwhile: two different O(1) techniques for the same check, rather than an O(n) vs O(1) contrast.

## Key Takeaway

Not every "approach 1 vs approach 2" comparison is about Big-O — sometimes it's about *how* two equally fast operations get their answer (division-based vs. bit-based), which matters for things like readability, portability across languages, and building intuition for bitwise operations even when they're not strictly faster.
