# Modular Arithmetic

## Why It Matters

Modular arithmetic is the math of things that wrap around — clock hands, circular buffers, hash table buckets — and it's also the standard fix for a very practical problem: numbers that grow too large for a computer to hold exactly. Any time you see a problem ask for an answer "modulo 10^9 + 7," or see a ring buffer, a rotating array, or a hash function, modular arithmetic is doing the work underneath.

## What Is the Modulo Operation?

The modulo operation `a % m` returns the remainder left over after dividing `a` by `m`. It answers: "where does `a` land if you count up in cycles of length `m`, wrapping back to 0 every time you pass a multiple of `m`?"

```js
17 % 5   // 2   (5 goes into 17 three times, remainder 2)
5 % 5    // 0   (5 goes into 5 exactly once, remainder 0)
23 % 24  // 23  (24 doesn't go into 23 at all)
```

The result always lands in the range `[0, m − 1]` — for positive `a` and `m`, at least. JavaScript's own `%` operator has a sharp edge worth knowing here:

```js
-1 % 5   // -1, NOT 4
```

Unlike Python (where `-1 % 5 === 4`), JavaScript's `%` is a **remainder** operator, not a true mathematical modulo — it keeps the sign of the dividend. If a computation might produce a negative left-hand side (common in "wrap backwards" logic, like moving an index left in a circular buffer), the safe pattern is:

```js
function mod(a, m) {
  return ((a % m) + m) % m;
}
mod(-1, 5); // 4
mod(-7, 5); // 3
```

The extra `+ m) % m` nudges any negative remainder back into the `[0, m − 1]` range without changing the result for already-positive inputs.

## Properties Under Modulo

Modular arithmetic distributes cleanly over addition, subtraction, and multiplication, which is exactly what makes it useful for avoiding overflow — you can take the mod *early and often* instead of computing a huge exact value first and reducing it at the end:

```
(a + b) % m = ((a % m) + (b % m)) % m
(a - b) % m = ((a % m) - (b % m) + m) % m   // + m guards against a negative result
(a * b) % m = ((a % m) * (b % m)) % m
```

Division is the exception — `(a / b) % m` is **not** `((a % m) / (b % m)) % m` in general; dividing under a modulus needs a separate tool called a modular inverse, which is outside this chapter's scope but worth knowing exists.

```js
function modAdd(a, b, m) { return ((a % m) + (b % m)) % m; }
function modSub(a, b, m) { return (((a % m) - (b % m)) % m + m) % m; }
function modMul(a, b, m) { return ((a % m) * (b % m)) % m; }
```

## Fast Modular Exponentiation

Computing `base^exp % m` directly (multiply `base` by itself `exp` times, then take `% m` once at the end) has two problems: it's `O(exp)` time, and the intermediate value `base^exp` can be astronomically large before the final mod ever gets applied. Both problems disappear by applying the mod at every step and using the same "exponentiation by squaring" idea covered in [Matrix Exponentiation](math-matrix-exponentiation.md):

```js
function modPow(base, exp, m) {
  base = base % m;
  let result = 1;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % m;
    }
    base = (base * base) % m;
    exp = Math.floor(exp / 2);
  }
  return result;
}

modPow(7, 500, 13); // 3
```

Each squaring step halves the remaining exponent, so this runs in `O(log(exp))` time, and because every intermediate value is reduced `% m` immediately, no number involved ever grows past roughly `m²` instead of `base^exp`.

**A precision caveat specific to JavaScript:** "never past `m²`" is only safe as *plain numbers* while `m² ` stays under `Number.MAX_SAFE_INTEGER` (`2^53 − 1 ≈ 9 × 10^15`) — true for small moduli like `13` above, but not for the `10^9`-scale moduli common in competitive-programming problems (`(10^9)² = 10^18`, well past safe-integer range, so `base * base` silently loses precision and `modPow` quietly returns a wrong answer). For moduli that large, switch to `BigInt`:

```js
function modPowBig(base, exp, m) {
  base = BigInt(base) % BigInt(m);
  exp = BigInt(exp);
  m = BigInt(m);
  let result = 1n;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % m;
    base = (base * base) % m;
    exp = exp / 2n;
  }
  return result;
}
```

The logic is identical — only the number type changes, since `BigInt` has no upper bound to worry about.

## Real-World Problems & Solutions

### 1. Circular Buffer Indexing

**Scenario:** A fixed-size ring buffer of capacity `n` needs to advance its write pointer forward, wrapping back to index `0` after the last slot.

```js
class RingBuffer {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.writeIndex = 0;
  }
  write(value) {
    this.buffer[this.writeIndex] = value;
    this.writeIndex = (this.writeIndex + 1) % this.capacity;
  }
}

const rb = new RingBuffer(4);
[10, 20, 30, 40, 50].forEach(v => rb.write(v));
console.log(rb.buffer); // [ 50, 20, 30, 40 ]  -- 50 wrapped around and overwrote slot 0
```

`% this.capacity` is the entire wraparound mechanism — no `if (writeIndex === capacity) writeIndex = 0` branch needed. This is exactly how streaming buffers, audio/video frame queues, and round-robin schedulers keep a moving pointer inside fixed bounds.

### 2. Rotating an Array by K Positions

**Scenario:** Rotate an array right by `k` positions without building a second full-size array by hand-shifting elements one at a time.

```js
function rotateRight(arr, k) {
  const n = arr.length;
  const shift = ((k % n) + n) % n; // handles k > n and negative k
  return arr.map((_, i) => arr[(i - shift + n) % n]);
}

rotateRight([1, 2, 3, 4, 5], 2); // [4, 5, 1, 2, 3]
rotateRight([1, 2, 3, 4, 5], 7); // same as k=2, since 7 % 5 === 2
```

Every destination index is computed with a single mod expression instead of a loop of individual swaps — and normalizing `k` with `((k % n) + n) % n` means the function doesn't care whether `k` is bigger than the array or even negative.

### 3. Hash Table Bucket Assignment

**Scenario:** A hash table with `numBuckets` slots needs to map an arbitrary (possibly huge) hash code to a valid bucket index.

```js
function bucketIndex(hashCode, numBuckets) {
  return ((hashCode % numBuckets) + numBuckets) % numBuckets;
}

bucketIndex(123456789, 16); // 5
```

This is the operation underneath every `Map`/`Set`/hash-table implementation: a hash function produces a large integer, and `%` folds that arbitrary value down into a valid array index. It's the same wraparound idea as the ring buffer, applied to bucket selection instead of a write pointer.

### 4. Large-Exponent Computation Without Overflow

**Scenario:** A combinatorics problem needs `3^1000 % (10^9 + 7)` — the exact value of `3^1000` has over 400 digits, far beyond safe integer precision, but the *remainder* is a normal-sized number the problem actually wants.

```js
const MOD = 1_000_000_007n; // 10^9-scale modulus -- use modPowBig, not modPow
console.log(modPowBig(3, 1000, MOD)); // 56888193n
```

This is precisely why competitive-programming and interview problems so often ask for an answer "modulo 10^9 + 7": it's a signal to use `modPow`-style computation throughout, so no intermediate value ever needs more precision than the language can safely hold — and, per the precision caveat above, `10^9 + 7` is exactly the scale of modulus where JavaScript needs `modPowBig`'s `BigInt` arithmetic rather than the plain-number `modPow`.

## Key Takeaway

Modular arithmetic isn't just "the remainder operator" — it's a way to work with numbers that live on a cycle (clocks, buffers, buckets) and a way to keep numbers small while computing something that would otherwise explode in size. The pattern that shows up over and over is the same one: apply `% m` as early and as often as possible, never at the very end on an already-huge value, and remember JavaScript's `%` keeps the sign of its left operand — normalize with `((a % m) + m) % m` whenever a negative result is even possible.
