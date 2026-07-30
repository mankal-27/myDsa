# Sum of First N Natural Numbers (Recursive)

**Difficulty:** Easy
**Topics:** Recursion, Math
**File:** [`Sum_of_First_N_Natural_Numbers.js`](./Sum_of_First_N_Natural_Numbers.js)
**Tests:** [`Sum_of_First_N_Natural_Numbers.test.js`](./Sum_of_First_N_Natural_Numbers.test.js)

## Problem Statement

Given a non-negative integer `n`, return the sum of all natural numbers from `1` to `n` (`1 + 2 + ... + n`). `n = 0` sums to `0`.

### Example 1

```
Input:  n = 5
Output: 15   (1 + 2 + 3 + 4 + 5)
```

### Example 2

```
Input:  n = 0
Output: 0
```

### Example 3

```
Input:  n = 1
Output: 1
```

### Example 4

```
Input:  n = 100
Output: 5050
```

### Constraints

- `n` is a non-negative integer.

## Use Case

This is the opening problem of the Recursion module, chosen specifically because it's simple enough to focus entirely on the mechanics of recursion itself — the base case, the recursive case, and how the call stack builds up and unwinds — without the problem's own logic getting in the way:

- **The smallest complete example of recursion's shape** — every recursive function needs exactly two things: a base case that stops the recursion, and a recursive case that reduces the problem toward that base case. This problem has the simplest possible version of both, making it the natural first stop before recursion is applied to harder problems (traversing trees, exploring graphs, backtracking).
- **The call stack made visible** — `sumOfNApproach1(5)` doesn't compute anything until it knows the answer to `sumOfNApproach1(4)`, which needs `sumOfNApproach1(3)`, and so on down to the base case — then the additions actually happen as the calls return back up the chain. Seeing this unwind explicitly (in the dry run below) is the key mental model recursion. relies on.
- **A direct rediscovery of Gauss's trick** — this is the same identity used by `Sum of Even or Odd Numbers` (Module 3) in disguise: `1 + 2 + ... + n = n(n+1)/2`. Seeing it show up again as the "optimized, no recursion needed" answer reinforces that this formula is a genuinely reusable piece of math, not a one-off trick.

## Concepts

- **Base case** — the simplest input the function can answer directly without recursing further; here, `n <= 0` returns `0` immediately.
- **Recursive case** — expressing the answer for `n` in terms of the answer for a *smaller* version of the same problem: `sum(n) = n + sum(n - 1)`.
- **The call stack** — each recursive call waits (paused) for the call it made to return before it can finish its own computation; this is what gives recursion its `O(n)` extra space cost, unlike an equivalent loop.
- **Closed-form formulas as an alternative to recursion** — some recursive problems have a direct mathematical shortcut that skips the recursion (and its stack cost) entirely.

## Approaches

### Approach 1 — recursive: `n + sum(n - 1)`, with `0` as the base case

**Intuition:** The sum of numbers from `1` to `n` is just `n` plus the sum of numbers from `1` to `n - 1` — the same problem, but one step smaller. Repeating that reduction eventually reaches `n = 0`, where the answer is trivially `0`, and the recursion stops.

**Solution:**

```js
sumOfNApproach1(n) {
  if (n <= 0) return 0;
  return n + this.sumOfNApproach1(n - 1);
}
```

**Dry Run** (`n = 5`, Example 1 — showing the call stack building up, then unwinding):

| Call | Waits on | 
|---|---|
| `sumOfNApproach1(5)` | `5 + sumOfNApproach1(4)` |
| `sumOfNApproach1(4)` | `4 + sumOfNApproach1(3)` |
| `sumOfNApproach1(3)` | `3 + sumOfNApproach1(2)` |
| `sumOfNApproach1(2)` | `2 + sumOfNApproach1(1)` |
| `sumOfNApproach1(1)` | `1 + sumOfNApproach1(0)` |
| `sumOfNApproach1(0)` | base case → returns `0` immediately |

Now the stack unwinds, each call completing its addition as the one below it returns:

| Call returns | Computed as | Value |
|---|---|---|
| `sumOfNApproach1(0)` | base case | `0` |
| `sumOfNApproach1(1)` | `1 + 0` | `1` |
| `sumOfNApproach1(2)` | `2 + 1` | `3` |
| `sumOfNApproach1(3)` | `3 + 3` | `6` |
| `sumOfNApproach1(4)` | `4 + 6` | `10` |
| `sumOfNApproach1(5)` | `5 + 10` | `15` |

Return `15`. ✓ matches Example 1 — five calls were pushed onto the stack before any addition actually happened, and the additions only completed as those calls returned back up.

### Approach 2 — optimized: Gauss's closed-form formula

**Intuition:** Pairing the first and last numbers (`1 + n`), the second and second-to-last (`2 + (n-1)`), and so on, each pair sums to the same value, `n + 1`. There are `n / 2` such pairs, giving the formula `n(n+1)/2` directly — no recursion, no loop, just one multiplication and one division.

**Solution:**

```js
sumOfNApproach2(n) {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}
```

**Dry Run** (`n = 5`, Example 1):

| Step | Expression | Value |
|---|---|---|
| 1 | `n * (n + 1)` | `5 * 6 = 30` |
| 2 | `30 / 2` | `15` |

Return `15`. ✓ matches Example 1 and Approach 1's result — computed in a single expression, no calls stacked up at all.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Recursive | O(n) | O(n) | `n` recursive calls are made before the base case is reached, and each one stays on the call stack (waiting to add its `n`) until the calls below it return — the stack depth itself is `O(n)`. |
| Closed-form formula | O(1) | O(1) | A fixed, constant number of arithmetic operations regardless of how large `n` is. |

This mirrors the Sum of Even or Odd Numbers problem from Module 3, where the same Gauss's-formula insight turned an `O(n)` loop into an `O(1)` calculation — here it does the same for an `O(n)`-*space* recursive solution, which is an even more dramatic improvement, since recursion depth for very large `n` risks an actual stack overflow, not just extra time.

## Implementation Notes

Both approaches were implemented correctly — no bugs found, including `n = 0`, a negative `n` (correctly treated as `0` by the base-case guard), and larger values of `n` (verified up to `1000`, well beyond typical stack-depth concerns for this problem size). Verified against 6 cases plus a direct cross-check between both approaches, all in `Sum_of_First_N_Natural_Numbers.test.js`.

## Key Takeaway

The `n <= 0` base case (rather than `n === 0`) is what makes the recursion safe for negative input too — without the `<=`, calling `sumOfNApproach1(-3)` would recurse forever (`-3 → -4 → -5 → ...`, never hitting exactly `0`), eventually overflowing the call stack instead of returning a sensible answer. A base case should usually be phrased as "have we reached or passed the stopping point," not "have we hit this one exact value," since recursive steps don't always land precisely on the value you're expecting.
