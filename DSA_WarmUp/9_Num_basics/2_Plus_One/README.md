# Plus One

**Difficulty:** Easy
**Topics:** Math, Arrays, Number Basics
**File:** [`Plus_One.js`](./Plus_One.js)
**Tests:** [`Plus_One.test.js`](./Plus_One.test.js)

## Problem Statement

Given a non-empty array of digits `digits` representing a non-negative integer (the most significant digit is at index `0`, with no leading zeros except for the number `0` itself), increment the integer by one and return the resulting array of digits.

### Example 1

```
Input:  digits = [1, 2, 3]
Output: [1, 2, 4]        (123 + 1 = 124)
```

### Example 2

```
Input:  digits = [4, 3, 2, 1]
Output: [4, 3, 2, 2]        (4321 + 1 = 4322)
```

### Example 3

```
Input:  digits = [9]
Output: [1, 0]        (9 + 1 = 10 -- gains an extra digit)
```

### Example 4

```
Input:  digits = [9, 9, 9]
Output: [1, 0, 0, 0]        (999 + 1 = 1000 -- every digit carries)
```

### Example 5

```
Input:  digits = [0]
Output: [1]
```

### Constraints

- `1 <= digits.length <= 100`
- `0 <= digits[i] <= 9`
- `digits` represents a non-negative integer with no leading zeros, except for the single-element case `[0]`.

## Use Case

- **Carry propagation is the whole problem** — this is the same mental model as adding two numbers by hand with pen and paper: work from the rightmost (least significant) digit, and only touch the next digit to the left when a carry actually occurs. Most of the time, incrementing stops after a single digit.
- **The "all 9s" edge case is the one that actually tests understanding** — `[9, 9, ..., 9] → [1, 0, 0, ..., 0]` is the only case where the result has *more* digits than the input, and it's a common source of off-by-one/missed-case bugs if the carry loop doesn't have an explicit "ran out of digits, still carrying" ending.
- **A natural argument for why converting to a number is the wrong instinct at scale** — the constraint allows up to 100 digits, which is already far beyond what a 64-bit number (or even `BigInt` conversion round-trips) is the *simplest* way to reason about; working directly on the digit array avoids ever needing to represent the number as anything other than what it already is.

## Concepts

- **Carry propagation** — incrementing a digit that's already `9` wraps it to `0` and pushes a "carry" one position to the left, exactly like manual addition.
- **Early return the moment no carry is needed** — as soon as a digit increments without hitting `10`, every digit to its left is unaffected, so the function can stop immediately.
- **Growing an array by one element** — the only way the result can have more digits than the input is a full carry chain reaching the front; handling that means producing a new, longer array rather than mutating the original past its bounds.

## Approaches

### Approach 1 — brute force: convert to a number, add 1, convert back

**Intuition:** The most literal reading of the problem — treat the digit array as a number, add one to it, then split the result back into digits. `BigInt` is used instead of `Number` specifically because the array can represent numbers far larger than `Number.MAX_SAFE_INTEGER` (up to 100 digits, per the constraints).

**Solution:**

```js
plusOneApproach1(digits) {
  const num = BigInt(digits.join(''));
  const result = (num + 1n).toString();
  return result.split('').map(Number);
}
```

**Dry Run** (`digits = [9, 9, 9]`, Example 4):

| Step | Value |
|---|---|
| `digits.join('')` | `"999"` |
| `BigInt("999")` | `999n` |
| `999n + 1n` | `1000n` |
| `.toString()` | `"1000"` |
| `.split('').map(Number)` | `[1, 0, 0, 0]` |

Return `[1, 0, 0, 0]`. ✓ matches Example 4.

### Approach 2 — optimized: carry propagation from the last digit

**Intuition:** Start from the last digit. If it's less than `9`, incrementing it can't cause a carry — increment it and return immediately, since nothing to its left needs to change. If it's exactly `9`, incrementing wraps it to `0` and the carry continues to the digit on its left. If the loop finishes without ever returning (every digit was a `9`), the whole number rolled over — e.g. `999 → 1000` — so the result needs one more digit than the input, and a leading `1` is prepended.

**Solution:**

```js
plusOneApproach2(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
}
```

**Dry Run** (`digits = [8, 9, 9, 9, 9]`):

| Step | `i` | `digits[i]` before | Action | `digits` after |
|---|---|---|---|---|
| 1 | 4 | 9 | `=== 9`, wrap to `0` | `[8, 9, 9, 9, 0]` |
| 2 | 3 | 9 | `=== 9`, wrap to `0` | `[8, 9, 9, 0, 0]` |
| 3 | 2 | 9 | `=== 9`, wrap to `0` | `[8, 9, 0, 0, 0]` |
| 4 | 1 | 9 | `=== 9`, wrap to `0` | `[8, 0, 0, 0, 0]` |
| 5 | 0 | 8 | `< 9`, increment, return | `[9, 0, 0, 0, 0]` |

Return `[9, 0, 0, 0, 0]`. ✓ `89999 + 1 = 90000`. (Contrast with `digits = [9, 9, 9]`: the loop would run out of digits entirely without ever hitting the `< 9` branch, falling through to `return [1, ...digits]` → `[1, 0, 0, 0]`.)

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Convert to number | O(d) | O(d) | `d` is the digit count; joining, `BigInt` conversion, and splitting the result each take time and space proportional to `d`. |
| Carry propagation | O(d) worst case, O(1) typical | O(1) typical, O(d) only on full carry | Most increments touch only the last digit or a short run of trailing `9`s and return immediately; only an all-`9`s input walks every digit *and* allocates a new, longer array. |

The gap between these two isn't really about the worst case (both are `O(d)` when every digit is a `9`) — it's that Approach 2's *typical* case (no trailing `9`s) does a single O(1) digit update and returns, while Approach 1 always pays the full `join` → `BigInt` → `toString` → `split` cost regardless of how simple the increment actually was.

## Is There a Faster Approach Than Approach 2?

No — Approach 2 is already asymptotically optimal, and it's worth being honest about why rather than inventing a "better" complexity class that doesn't exist. Any correct algorithm must at minimum look at the last digit (to decide whether it needs to carry at all), and in the worst case (an input of all `9`s) it must touch every digit, since each one changes. There's no way to know whether digit `i` needs to change without knowing the carry result from digit `i+1`, so the digits can't be skipped or processed out of order — `O(d)` time is a hard floor, and Approach 2 already hits it with typically `O(1)` extra space. What follows below isn't a faster algorithm — it's a different *technique* for expressing the same one.

## Bonus — Recursive Carry Propagation

**Intuition:** Approach 2's loop can be rephrased as a recursive function instead: "increment this digit; if it doesn't overflow, done — otherwise, zero it and solve the same problem one position to the left." This is the same carry-propagation logic, just expressed as self-reference instead of iteration — a natural fit for this repo's [Recursion](../../8_Recursion/) module, and a good example of "same complexity, different technique" rather than a genuine efficiency win.

**Solution:**

```js
plusOneBonusRecursive(digits, index = digits.length - 1) {
    if (index < 0) return [1, ...digits];
    if (digits[index] < 9) {
        digits[index]++;
        return digits;
    }
    digits[index] = 0;
    return this.plusOneBonusRecursive(digits, index - 1);
}
```

**Dry Run** (`digits = [9, 9]`):

| Call | `index` | `digits[index]` | Action |
|---|---|---|---|
| `plusOneBonusRecursive(digits)` | 1 | 9 | `=== 9`, wrap to `0`, recurse with `index = 0` |
| `plusOneBonusRecursive(digits, 0)` | 0 | 9 | `=== 9`, wrap to `0`, recurse with `index = -1` |
| `plusOneBonusRecursive(digits, -1)` | -1 | — | `index < 0` (base case) → return `[1, ...digits]` |

Return `[1, 0, 0]`. ✓ `99 + 1 = 100`.

**Honest complexity comparison:** time is identical to Approach 2 — `O(d)` worst case, `O(1)` typical case, since the recursion still stops at the first non-`9` digit it finds. Space is *worse* in the worst case: each recursive call adds a stack frame, so an all-`9`s input costs `O(d)` call-stack space, compared to Approach 2's `O(1)` auxiliary space (the loop version only ever tracks a single index variable). This mirrors the exact trade-off documented in [`Sum of First N Natural Numbers (Recursive)`](../../8_Recursion/1_Sum_of_First_N_Natural_Numbers/README.md): recursion can express the same logic more directly, but it isn't free — the call stack is real memory the iterative version doesn't spend.

## Implementation Notes

Approach 1 was implemented correctly — no bugs found. Approach 2 had one real bug: the loop's update expression was `i++` instead of `i--`, so instead of walking backward from the last digit toward the front, `i` walked forward past the end of the array. For inputs whose last digit was already less than `9` (e.g. `[1, 2, 3]`), the function returned correctly on the very first iteration and the bug never had a chance to trigger — but for any input needing an actual carry, it broke immediately: `plusOneApproach2([9])` threw `RangeError: Invalid array length` before the fix, because `digits[i] = 0` kept assigning to ever-larger out-of-bounds indices as `i` grew without bound instead of shrinking toward `0`. Fixed by changing `i++` to `i--`.

Verified against 11 cases in `Plus_One.test.js` (all three methods, including the bonus recursive version), covering both examples from the Problem Statement, single-digit inputs with and without carry, full carry chains (`[9,9,9]`), partial carry chains that stop partway through (`[2,9,9,9]`, `[8,9,9,9,9]`), and an input needing no carry at all (`[1,2,8]`) — with a dedicated test confirming all three approaches agree on every case.

## Key Takeaway

The `i++`/`i--` bug here produced no wrong answers on the majority of realistic inputs — it only surfaced on inputs that actually needed a carry to propagate past the last digit, which is exactly the kind of input that's easy to under-test if verification stops at "the obvious example passed." This is the same lesson as [`Reverse an Array In Place`](../../6_Arrays/7_Reverse_an_Array_In_Place/README.md)'s `++`/`--` bugs: loop-direction mistakes don't always show up as wrong answers on the first case you try — sometimes they show up as a crash, and only on the inputs that actually exercise the part of the loop that runs more than once.
