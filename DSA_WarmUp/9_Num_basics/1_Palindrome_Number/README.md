# Palindrome Number

**Difficulty:** Easy
**Topics:** Math, Number Basics
**File:** [`Palindrome_Number.js`](./Palindrome_Number.js)
**Tests:** [`Palindrome_Number.test.js`](./Palindrome_Number.test.js)

## Problem Statement

Given an integer `x`, return `true` if `x` reads the same forwards and backwards (a palindrome), and `false` otherwise.

### Example 1

```
Input:  x = 121
Output: true
```

### Example 2

```
Input:  x = -121
Output: false   (reading backwards gives "121-", which isn't the same string — negative numbers are never palindromes)
```

### Example 3

```
Input:  x = 10
Output: false   (reversed, "10" becomes "01", i.e. 1 -- not equal to 10)
```

### Example 4

```
Input:  x = 0
Output: true
```

### Example 5

```
Input:  x = 12321
Output: true
```

### Constraints

- `x` is a 32-bit signed integer (`-2^31 <= x <= 2^31 - 1`).
- Negative numbers are never palindromes.
- A positive number with a trailing zero (other than `0` itself) is never a palindrome — e.g. `10`, `100`, `1200`.

## Use Case

- **The most direct on-ramp to "compare something against its own reverse"** — a pattern that reappears constantly (this repo's own [`Palindrome String Check`](../../7_Strings/4_Palindrome_String_Check/README.md) is the string version of exactly this idea).
- **A natural setting for the "do I even need to build the reverse?" question** — the brute-force approach happily reverses the *entire* number (via a string) before comparing; the optimized approach shows that reversing only *half* the digits is enough to answer the same question, without ever materializing a full reversed copy.
- **A concrete example of when converting to a string is the wrong instinct** — this problem is often introduced with an explicit constraint of "solve it without converting to a string," specifically to force the alternative: peeling digits off mathematically with `% 10` and `/ 10`, the same two operations behind [`Count Digits in an Integer`](../../3_Loops_Iteration/4_Count_Digits_in_an_Integer/README.md) and [`Sum of All Divisors of a Number`](../../3_Loops_Iteration/5_Sum_of_All_Divisors_of_a_Number/README.md).

## Concepts

- **String reversal and comparison** — the most direct way to check "does this read the same both ways."
- **Digit extraction via `% 10` and `/ 10`** — `x % 10` reads off the last digit, `Math.floor(x / 10)` drops it; repeating this walks through a number's digits from the last to the first.
- **Reversing only half the digits** — once the "reversed-so-far" half becomes `>=` the "remaining" half, every digit has effectively been visited once; there's no need to reverse the whole number to know the answer.
- **Early rejection via structural properties** — negative numbers, and positive numbers with a trailing zero (besides `0` itself), can be ruled out immediately without doing any digit-by-digit work at all.

## Approaches

### Approach 1 — brute force: convert to string, compare against its reverse

**Intuition:** A palindrome is defined in terms of "reading the same forwards and backwards" — a string's own `.split('').reverse().join('')` is the most literal possible translation of that definition into code. Negative numbers are handled up front, since the `-` sign would never match anything when the string is reversed anyway.

**Solution:**

```js
isPalindromeApproach1(x) {
  if (x < 0) return false;
  const str = String(x);
  return str === str.split('').reverse().join('');
}
```

**Dry Run** (`x = 12321`, Example 5):

| Step | Value |
|---|---|
| `str` | `"12321"` |
| `str.split('')` | `['1','2','3','2','1']` |
| `.reverse()` | `['1','2','3','2','1']` (same order — palindrome) |
| `.join('')` | `"12321"` |
| `str === "12321"` | `true` |

Return `true`. ✓ matches Example 5.

### Approach 2 — optimized: reverse only the second half of the digits

**Intuition:** Building the *entire* reversed number is more work than necessary — once half of the digits have been reversed, that reversed half can be compared directly against the half that's left over. If they match (accounting for an odd digit count leaving one extra digit in the middle), the number is a palindrome. This avoids ever converting to a string, and stops as soon as enough digits have been seen. A number ending in `0` (other than `0` itself) is rejected immediately, since no palindrome can start with `0`.

**Solution:**

```js
isPalindromeApproach2(x) {
  if (x < 0) return false;
  if (x !== 0 && x % 10 === 0) return false;

  let reversedHalf = 0;
  while (x > reversedHalf) {
    reversedHalf = reversedHalf * 10 + (x % 10);
    x = Math.floor(x / 10);
  }

  return x === reversedHalf || x === Math.floor(reversedHalf / 10);
}
```

**Dry Run** (`x = 12321`, Example 5 — tracking `x` and `reversedHalf` each iteration):

| Step | `x` before | `x % 10` | `reversedHalf` after | `x` after (`Math.floor(x/10)`) | `x > reversedHalf`? |
|---|---|---|---|---|---|
| 1 | 12321 | 1 | 1 | 1232 | `1232 > 1` → continue |
| 2 | 1232 | 2 | 12 | 123 | `123 > 12` → continue |
| 3 | 123 | 3 | 123 | 12 | `12 > 123`? no → stop |

Loop stops with `x = 12`, `reversedHalf = 123`. Since the original number had an odd digit count, the middle digit (`3`) ended up in `reversedHalf` only — so the check is `x === Math.floor(reversedHalf / 10)`, i.e. `12 === Math.floor(123 / 10) = 12`. `true`. Return `true`. ✓ matches Example 5.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| String reversal | O(d) | O(d) | `d` is the number of digits in `x`; building the reversed string takes space proportional to `d`. |
| Reverse half the digits | O(d) | O(1) | Still visits each digit once (so still `O(d)` time), but only ever tracks two integers (`x`, `reversedHalf`) — no string or array is ever built. |

Both approaches are `O(d)`, where `d = O(log x)` (the number of digits in `x` grows with `log₁₀(x)`, per the [Logarithms](../../../resources/math-logarithms.md) chapter's digit-counting identity) — so realistically this is `O(log x)` time either way. The difference is entirely in space: Approach 1 needs `O(d)` extra space for the string and array; Approach 2 needs only `O(1)`.

## Bonus — Two-Pointer String Comparison

**Intuition:** A third way to express "does this string read the same forwards and backwards": convert to a string once, then walk two pointers inward from both ends simultaneously, comparing characters as they go. If any pair of matched characters ever differs, it's not a palindrome; if the pointers cross without ever finding a mismatch, it is. This is the same two-pointer shape used by this repo's [`Palindrome String Check`](../../7_Strings/4_Palindrome_String_Check/README.md).

**Solution:**

```js
isPalindromeApproach3(x){
    if(x < 0) return false
    const str = String(x)
    let left = 0;
    let right = str.length - 1
    while(left < right){
        if(str[left] !== str[right]){
            return false
        }
        left++
        right--
    }
    return true
}
```

**Dry Run** (`x = 1221`):

| Step | `left` | `right` | `str[left]` | `str[right]` | match? |
|---|---|---|---|---|---|
| 1 | 0 | 3 | `'1'` | `'1'` | yes → `left++`, `right--` |
| 2 | 1 | 2 | `'2'` | `'2'` | yes → `left++`, `right--` |
| 3 | 2 | 1 | — | — | `left < right` is false → loop stops |

Return `true`. ✓ `1221` is a palindrome.

This still needs `O(d)` space for the string itself (same as Approach 1), but avoids ever building a *second*, reversed string — it compares directly against the original instead, stopping as soon as any mismatch is found rather than always reversing the whole thing first.

## Implementation Notes

Approaches 1 and 2 were implemented correctly — no bugs found. Approach 3 (the bonus two-pointer version) had one real bug: the mismatch check was written as `if(str[x] !== str[right])`, indexing the string with `x` — the original *number* parameter — instead of `left`, the pointer meant to track the current position from the front. Since `x` is a large integer (not a valid small string index), `str[x]` evaluated to `undefined` for essentially every multi-digit number, which never equals `str[right]`, so the function returned `false` immediately for almost every real palindrome — confirmed concretely: `isPalindromeApproach3(121)` returned `false` before the fix, `isPalindromeApproach3(12321)` also returned `false`. Only single-digit numbers and two-digit non-palindromes happened to return the right answer, by coincidence (a one-character string's loop body never runs at all, since `left < right` is already false). Fixed by changing `str[x]` to `str[left]`.

Verified against 24 cases in `Palindrome_Number.test.js`, including both examples from the Problem Statement, single digits, negative numbers (including the 32-bit signed minimum, `-2147483648`), trailing-zero rejections (`10`, `20`, `100`), even- and odd-digit-count palindromes, a non-palindrome that shares digits at both ends (`1000021`), and the 32-bit signed maximum (`2147483647`, not a palindrome) — with a dedicated test confirming all three approaches agree on every case.

## Key Takeaway

The bug in Approach 3 is a reminder that a two-pointer loop has *two* loop-scoped variables (`left`, `right`) plus whatever the function's own parameters are (`x`) — and once `x` has already been consumed to build `str`, it stops being meaningful as an index, even though it's still in scope and still looks like a plausible variable to reach for. The fact that the function still ran without throwing (rather than crashing) is exactly why this needed actual execution to catch: `str[x]` is syntactically valid, just semantically wrong, and it silently returns `undefined` instead of erroring — a class of bug that reading the code carefully can miss but running it against real palindromes catches immediately.
