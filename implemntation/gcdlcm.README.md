# GCD and LCM Functions

**Difficulty:** Easy–Medium
**Topics:** Math, Number Theory, Recursion
**File:** [`gcdlcm.js`](./gcdlcm.js)
**Tests:** [`gcdlcm.test.js`](./gcdlcm.test.js)
**Related Chapter:** [GCD and LCM](../resources/math-gcd-lcm.md)

## Problem Statement

Implement five utilities built on the Euclidean algorithm from the [GCD and LCM](../resources/math-gcd-lcm.md) chapter:

1. `gcd(a, b)` — the greatest common divisor of `a` and `b`, computed iteratively.
2. `gcdRecursive(a, b)` — the same computation, expressed recursively.
3. `lcm(a, b)` — the least common multiple of `a` and `b`, via the GCD↔LCM formula.
4. `extendedGcd(a, b)` — the Extended Euclidean Algorithm: returns `{ gcd, x, y }` such that `a*x + b*y === gcd` (Bezout's identity).
5. `gcdArray(nums)` — the GCD across an entire array of numbers.

### Example 1

```
Input:  gcd(48, 18)
Output: 6
```

### Example 2

```
Input:  lcm(4, 6)
Output: 12
```

### Example 3

```
Input:  extendedGcd(35, 15)
Output: { gcd: 5, x: 1, y: -2 }
Check:  35*1 + 15*(-2) = 35 - 30 = 5  ✓ equals gcd
```

### Example 4

```
Input:  gcdArray([12, 18, 24])
Output: 6
```

### Constraints

- `a`, `b` may be any integers, including `0` and negative values — `gcd`/`gcdRecursive`/`lcm` normalize sign internally via `Math.abs`.
- `gcdArray` expects a non-empty array.
- `extendedGcd`'s `(x, y)` pair is *a* valid Bezout solution, not necessarily the unique "smallest" one — infinitely many `(x, y)` pairs satisfy the identity.

## Use Case

This file is the hands-on companion to the [GCD and LCM](../resources/math-gcd-lcm.md) chapter's Euclidean algorithm section, extended with two natural follow-ups: `extendedGcd` (which shows up whenever a problem needs not just *that* two numbers share a common divisor, but an explicit linear combination producing it — modular inverses, Diophantine equations, CRT-style problems), and `gcdArray` (reducing GCD over a list, useful for problems like "find the largest number that evenly divides every element").

## Concepts

- **The Euclidean algorithm** — `gcd(a, b) = gcd(b, a % b)`, shrinking the problem each step until `b` reaches `0`.
- **Sign normalization** — GCD is conventionally non-negative; taking `Math.abs` of both inputs up front means the rest of the logic never has to reason about sign.
- **Recursive base case correctness** — a recursive Euclidean algorithm's base case must trigger on `b === 0`, the point where no further shrinking is possible; anything else risks the recursion never terminating.
- **Bezout's identity / Extended Euclidean Algorithm** — alongside `gcd(a, b)`, there always exist integers `x, y` such that `a*x + b*y = gcd(a, b)`; the extended algorithm computes `gcd`, `x`, and `y` together by unwinding the recursion.
- **Reducing over a collection** — `gcdArray` folds `gcd` across every element, reusing the pairwise function instead of writing a separate array-specific algorithm.

## Approaches

### `gcd` — iterative Euclidean algorithm

**Intuition:** Repeatedly replace `(a, b)` with `(b, a % b)`; any common divisor of `a` and `b` is also a common divisor of `b` and `a % b`, so the GCD never changes, but the numbers shrink fast. Stop once `b` reaches `0` — at that point `a` is the answer.

**Solution:**

```js
function gcd(a, b){
    a = Math.abs(a);
    b = Math.abs(b);
    while( b !== 0){
        [a,b] = [b, a % b];
    }
    return a;
}
```

**Dry Run** (`gcd(48, 18)`, Example 1):

| Step | `a` | `b` | `a % b` |
|---|---|---|---|
| 1 | 48 | 18 | `48 % 18 = 12` |
| 2 | 18 | 12 | `18 % 12 = 6` |
| 3 | 12 | 6 | `12 % 6 = 0` |
| 4 | 6 | 0 | loop stops |

Return `6`. ✓ matches Example 1.

### `gcdRecursive` — the same algorithm, recursively

**Intuition:** Identical shrinking rule as `gcd`, expressed as a recursive call instead of a loop — the base case is reached when `b` becomes `0`.

**Solution (as fixed — see Implementation Notes):**

```js
function gcdRecursive(a,b){
    a = Math.abs(a);
    b = Math.abs(b);
    if(b === 0) return a;
    return gcdRecursive(b, a % b);
}
```

**Dry Run** (`gcdRecursive(48, 18)`): recurses `(48,18) → (18,12) → (12,6) → (6,0)`, hits the base case at `b === 0`, returns `6`. ✓ matches `gcd(48, 18)`.

### `lcm` — via the GCD↔LCM formula

**Intuition:** `lcm(a, b) = (a / gcd(a, b)) * b` — dividing by the GCD first (rather than multiplying `a * b` first) keeps intermediate values smaller.

**Solution:**

```js
function lcm(a , b){
    if(a === 0 || b === 0) return 0;
    a = Math.abs(a);
    b = Math.abs(b);
    return ( a / gcd(a, b)) * b;
}
```

**Dry Run** (`lcm(4, 6)`, Example 2): `gcd(4,6) = 2`, so `lcm = (4/2)*6 = 2*6 = 12`. ✓ matches Example 2.

### `extendedGcd` — Bezout's identity via unwinding the recursion

**Intuition:** At the base case (`b === 0`), `a*1 + b*0 = a = gcd`, so `(x, y) = (1, 0)` trivially works. Unwinding one level at a time, if `(g, x₁, y₁)` solves the subproblem `(b, a % b)` (i.e. `b*x₁ + (a % b)*y₁ = g`), then substituting `a % b = a - ⌊a/b⌋*b` and regrouping terms shows `(x, y) = (y₁, x₁ - ⌊a/b⌋*y₁)` solves the original `(a, b)` — each level of the unwind builds the next `(x, y)` pair from the one below it.

**Solution (as fixed — see Implementation Notes):**

```js
function extendedGcd(a, b){
    if(b === 0){
        return { gcd: a, x: 1, y: 0};
    }
    const result = extendedGcd(b, a % b);
    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x - Math.floor(a / b) * result.y
    };
}
```

**Dry Run** (`extendedGcd(35, 15)`, Example 3 — unwinding from the base case):

| Call | Base/recursive result `(g, x₁, y₁)` | This level's `(x, y)` |
|---|---|---|
| `extendedGcd(5, 0)` | base case: `(5, 1, 0)` | — |
| `extendedGcd(15, 5)` | uses `(5, 1, 0)` | `x = y₁ = 0`, `y = x₁ - ⌊15/5⌋*y₁ = 1 - 3*0 = 1` → `(5, 0, 1)` |
| `extendedGcd(35, 15)` | uses `(5, 0, 1)` | `x = y₁ = 1`, `y = x₁ - ⌊35/15⌋*y₁ = 0 - 2*1 = -2` → `(5, 1, -2)` |

Return `{ gcd: 5, x: 1, y: -2 }`. Check: `35*1 + 15*(-2) = 35 - 30 = 5`. ✓ matches Example 3.

### `gcdArray` — fold `gcd` across a list

**Intuition:** The GCD of a list is the GCD of the first two elements, then the GCD of that result with the third element, and so on — exactly what `reduce` expresses directly.

**Solution:**

```js
function gcdArray(nums){
    return nums.reduce((acc, val) => gcd(acc, val));
}
```

**Dry Run** (`gcdArray([12, 18, 24])`, Example 4): `gcd(12,18)=6`, then `gcd(6,24)=6`. Return `6`. ✓ matches Example 4.

## Complexity

| Function | Time | Space | Why |
|---|---|---|---|
| `gcd` | O(log(min(a,b))) | O(1) | Each step at least roughly halves the smaller value every two iterations (per the [GCD and LCM](../resources/math-gcd-lcm.md) chapter's Fibonacci-worst-case argument). |
| `gcdRecursive` | O(log(min(a,b))) | O(log(min(a,b))) | Same shrink rate as `gcd`, but each call adds a stack frame — recursion trades the loop's O(1) space for O(log(min(a,b))) call-stack space. |
| `lcm` | O(log(min(a,b))) | O(1) | Dominated entirely by its one call to `gcd`. |
| `extendedGcd` | O(log(min(a,b))) | O(log(min(a,b))) | Same recursive shrink rate as `gcdRecursive`, plus O(1) extra work unwinding each level. |
| `gcdArray` | O(n · log(maxValue)) | O(1) | `n - 1` pairwise `gcd` calls, each O(log(maxValue)). |

## Implementation Notes

Two real bugs were found and fixed, both confirmed by direct execution (not by inspection):

1. **`gcdRecursive`'s base case was `if (b === a) return a;`, but it should be `if (b === 0) return a;`.** This wasn't a subtle off-by-one — it broke essentially every input. Tracing `gcdRecursive(48, 18)`: the recursion correctly proceeds `(48,18) → (18,12) → (12,6) → (6,0)`, but at `(6, 0)`, `b !== a` (`0 !== 6`), so it doesn't stop — it recurses into `gcdRecursive(0, 6 % 0)`, and `6 % 0` is `NaN` in JavaScript. From there, `b` (now `NaN`) can never equal `a` (`NaN === anything` is always `false`, including `NaN === NaN`), so the recursion never reaches its base case and runs until the call stack overflows. Running `gcdRecursive(48, 18)` before the fix threw `RangeError: Maximum call stack size exceeded` — not a wrong answer, a hard crash, on essentially any pair of positive integers. Fixed by checking `b === 0`, the point the Euclidean algorithm's shrinking actually stops.

2. **`extendedGcd`'s returned `x` was `result.x`, but it should be `result.y`.** The `y` field's formula (`result.x - Math.floor(a/b)*result.y`) was correct, but `x` was copying the wrong piece of the sub-result instead of `y₁` (see the Approach section's derivation). This produced a `{ gcd, x, y }` triple that looked plausible (right `gcd`, integer `x`/`y`) but silently failed Bezout's identity: before the fix, `extendedGcd(35, 15)` returned `{ gcd: 5, x: 1, y: -1 }`, and `35*1 + 15*(-1) = 20`, not `5`. This is the kind of bug that's easy to miss without actually plugging the result back into `a*x + b*y` and checking it equals `gcd` — the shape of the output looked completely reasonable. Fixed by changing `x: result.x` to `x: result.y`.

`gcd`, `lcm`, and `gcdArray` were correct as submitted, including correct handling of zero and negative inputs via the `Math.abs` normalization. All five functions were verified in `gcdlcm.test.js` (41 cases), including a dedicated regression case ensuring `gcdRecursive` no longer throws, and a Bezout-identity check (`a*x + b*y === gcd`) run against every `extendedGcd` test case rather than checking hardcoded `(x, y)` values — since any correct `(x, y)` pair should satisfy the identity, this is a stronger check than comparing against one specific expected pair.

## Key Takeaway

Both bugs here share a lesson: a plausible-looking base case or return value isn't the same as a correct one. `b === a` "looks like" a reasonable stopping condition if you're pattern-matching on "the Euclidean algorithm stops when the two numbers relate somehow," and `result.x` "looks like" a reasonable thing to propagate up — but neither actually encodes the real invariant (the algorithm stops at `b === 0`; the Bezout coefficients swap and combine in a specific order). The fix in both cases was to go back to first principles — trace what the recursion is actually supposed to compute at each level — rather than trust code that merely runs without erroring. `extendedGcd` in particular shows why "produces a plausible-looking result" isn't the same as "verified correct": the bug only surfaces by explicitly checking the mathematical property (`a*x + b*y === gcd`) the function promises to satisfy.
