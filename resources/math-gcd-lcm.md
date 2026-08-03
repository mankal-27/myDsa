# GCD and LCM

## Why It Matters

Greatest Common Divisor and Least Common Multiple sound like grade-school math, but they're the quiet backbone of anything involving simplifying ratios, finding when repeating cycles line up, or dividing something evenly. The algorithm that computes GCD — the Euclidean algorithm — is also one of the oldest known algorithms (literally over 2,000 years old) and one of the cleanest examples of "shrink the problem fast" reasoning in this repo.

## What Are GCD and LCM?

**GCD (Greatest Common Divisor)** of two integers `a` and `b` is the largest integer that divides both of them with no remainder. `gcd(12, 18) = 6`, because 6 is the biggest number that divides both 12 and 18 evenly.

**LCM (Least Common Multiple)** of `a` and `b` is the smallest positive integer that both `a` and `b` divide into evenly. `lcm(4, 6) = 12`, because 12 is the smallest number both 4 and 6 divide into with no remainder.

## The Euclidean Algorithm

The brute-force way to find `gcd(a, b)` is to check every number from `min(a, b)` down to `1` and stop at the first one that divides both — correct, but slow. The Euclidean algorithm gets there in far fewer steps using one identity:

**`gcd(a, b) = gcd(b, a % b)`**, with the base case `gcd(a, 0) = a`.

Why this works: any number that divides both `a` and `b` must also divide `a % b` (the remainder is just `a` minus some whole multiples of `b`, and if a number divides both `a` and `b`, it divides that difference too). So the *set* of common divisors of `(a, b)` is identical to the set of common divisors of `(b, a % b)` — meaning their greatest common divisor is the same, but the numbers involved shrink fast.

```js
function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function gcdRecursive(a, b) {
  if (b === 0) return a;
  return gcdRecursive(b, a % b);
}
```

**Dry run** — `gcd(48, 18)`:

| Step | `a` | `b` | `a % b` |
|---|---|---|---|
| 1 | 48 | 18 | `48 % 18 = 12` |
| 2 | 18 | 12 | `18 % 12 = 6` |
| 3 | 12 | 6 | `12 % 6 = 0` |
| 4 | 6 | 0 | base case reached |

`gcd(48, 18) = 6`.

### Complexity

Each step replaces `(a, b)` with `(b, a % b)` — and it can be shown that the smaller number at least roughly halves every *two* steps, in the worst case shrinking exactly at the rate of consecutive Fibonacci numbers (the input pair that forces the most steps for a given size is two neighboring Fibonacci numbers). That worst case still only produces `O(log(min(a, b)))` steps — a dramatic improvement over the brute-force `O(min(a, b))` scan. Even for two 15-digit numbers, the Euclidean algorithm finishes in well under 100 steps.

## LCM, via GCD

Rather than searching for the smallest common multiple directly, LCM has a direct formula built on GCD:

**`lcm(a, b) = (a × b) / gcd(a, b)`**

Why: `a × b` is *always* a common multiple of both (trivially — it's `a` copies of `b` and vice versa), and dividing out the GCD removes exactly the "double-counted" shared factors, leaving the smallest one.

```js
function lcm(a, b) {
  return (a / gcd(a, b)) * b; // divide first to reduce overflow risk
}

lcm(4, 6);  // 12
lcm(21, 6); // 42
```

Note the order of operations: `(a / gcd(a, b)) * b` rather than `(a * b) / gcd(a, b)`. Both are mathematically equal, but dividing first keeps the intermediate values smaller — relevant once `a` and `b` are large enough that `a * b` risks overflowing a fixed-size integer type (less of a concern in JavaScript's floating-point numbers for everyday sizes, but the right habit for translating this to languages with fixed-width integers).

## Real-World Problems & Solutions

### 1. Simplifying a Ratio or Fraction

**Scenario:** A recipe scaling tool needs to reduce a fraction like `36/48` to lowest terms.

```js
function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

simplifyFraction(36, 48); // [3, 4]
```

Dividing both the numerator and denominator by their GCD is, by definition, the largest possible simultaneous reduction — there's no smaller-terms version of `36/48` than `3/4`.

### 2. Scheduling Recurring Events That Align

**Scenario:** One maintenance job runs every 4 days, another every 6 days. Both ran today — how many days until they next coincide?

```js
function nextAlignment(cycleA, cycleB) {
  return lcm(cycleA, cycleB);
}

nextAlignment(4, 6); // 12
```

Day 12 is the first day both `4 | day` and `6 | day` hold — exactly the definition of LCM. This same reasoning answers "when do two blinking lights next flash together," "when do two orbiting bodies next align," or "when do two rotating gears return to their starting position at the same time."

### 3. Largest Square Tile That Evenly Tiles a Rectangle

**Scenario:** A floor measuring `48 × 18` (feet) needs to be tiled with the largest possible square tiles, with no cutting and no gaps.

```js
function largestSquareTileSize(width, height) {
  return gcd(width, height);
}

largestSquareTileSize(48, 18); // 6 -- a 6x6 tile grid, 8 tiles wide, 3 tiles tall
```

Any square tile that evenly divides both dimensions must have a side length that's a common divisor of both `48` and `18`; the *largest* such tile uses the greatest common divisor — this is the classical geometric interpretation the Euclidean algorithm was originally devised for (subtracting the smaller rectangle repeatedly from the larger one, which is exactly the `a % b` step in modern form).

### 4. Reducing a Repeating Pattern to Its Base Unit

**Scenario:** A textile pattern repeats every 8 threads horizontally and every 12 threads vertically; a designer wants the smallest square block that captures a whole number of repeats in both directions for a seamless tile.

```js
function seamlessTileSize(repeatX, repeatY) {
  return lcm(repeatX, repeatY);
}

seamlessTileSize(8, 12); // 24
```

A `24 × 24` block contains exactly 3 horizontal repeats (`24/8`) and 2 vertical repeats (`24/12`) — the smallest size that closes cleanly in both directions without cutting the pattern mid-repeat.

## Key Takeaway

The Euclidean algorithm is a small, elegant example of "replace the problem with an equivalent, strictly smaller one" — the same shrink-and-recurse shape as binary search's halving, just driven by remainders instead of midpoints. GCD and LCM aren't just abstract number-theory trivia: GCD answers "what's the largest shared unit," and LCM answers "when do independent cycles first line up" — both questions come up constantly once you're looking for them, from tiling and fractions to scheduling and gear ratios.
