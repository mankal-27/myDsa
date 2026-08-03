# Matrix Exponentiation

## Why It Matters

This repo's Recursion module will eventually reach a Fibonacci problem — and the naive recursive version is famously `O(2ⁿ)`, while an iterative or DP version brings that down to `O(n)`. Matrix exponentiation is the technique that goes one step further: it computes the Nth term of Fibonacci (or any similar linear recurrence) in `O(log n)`, by recognizing that the same "exponentiation by squaring" trick used for fast power calculations generalizes cleanly from numbers to matrices.

## The Setup: Fast Exponentiation of Numbers

Before matrices, the underlying trick is worth isolating on plain numbers. Computing `x^n` the obvious way (`x * x * x * ...`, `n` times) costs `O(n)` multiplications. Exponentiation by squaring cuts that to `O(log n)`:

- If `n` is even: `x^n = (x^(n/2))²`.
- If `n` is odd: `x^n = x × x^(n−1)` (peel off one factor, now `n−1` is even).

Each step at least halves the exponent, so the multiplication count is `O(log n)` instead of `O(n)`.

```js
function fastPower(x, n) {
  let result = 1;
  let base = x;
  while (n > 0) {
    if (n % 2 === 1) result *= base;
    base *= base;
    n = Math.floor(n / 2);
  }
  return result;
}

fastPower(2, 10); // 1024, using only 4 squarings instead of 10 multiplications
```

This is the exact same shape used for [fast modular exponentiation](math-modular-arithmetic.md#fast-modular-exponentiation) earlier in this resource set — the only thing that changes going forward is swapping the scalar `*` for matrix multiplication.

## The Matrix Trick for Fibonacci

The Fibonacci recurrence `F(n) = F(n−1) + F(n−2)` can be rewritten as a matrix multiplication. Define:

```
M = | 1  1 |
    | 1  0 |
```

Multiplying the vector `[F(n), F(n−1)]` by `M` produces `[F(n)+F(n−1), F(n)] = [F(n+1), F(n)]` — one multiplication by `M` advances the sequence by exactly one step. Chaining this `n` times means `Mⁿ` advances `n` steps at once, and it turns out **`F(n)` is exactly the top-right entry of `Mⁿ`** (equivalently `M^n`'s `[0][1]` entry, using 0-indexed rows/columns).

So the problem "compute `F(n)`" becomes the problem "compute `Mⁿ`" — and that's a job for exponentiation by squaring, just with matrix multiplication in place of scalar multiplication.

```js
function multiplyMatrices(a, b) {
  const rowsA = a.length, colsA = a[0].length, colsB = b[0].length;
  const result = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function identityMatrix(size) {
  return Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (i === j ? 1 : 0))
  );
}

function matrixPower(matrix, n) {
  let result = identityMatrix(matrix.length);
  let base = matrix;
  while (n > 0) {
    if (n % 2 === 1) result = multiplyMatrices(result, base);
    base = multiplyMatrices(base, base);
    n = Math.floor(n / 2);
  }
  return result;
}

function fibonacciMatrix(n) {
  if (n === 0) return 0;
  const M = [[1, 1], [1, 0]];
  const powered = matrixPower(M, n - 1);
  return powered[0][0]; // F(n) sits at [0][0] of M^(n-1)
}

for (let i = 0; i <= 10; i++) process.stdout.write(fibonacciMatrix(i) + ' ');
// 0 1 1 2 3 5 8 13 21 34 55
```

(This implementation reads `F(n)` off `M^(n-1)`'s `[0][0]` entry rather than `Mⁿ`'s `[0][1]` — both are valid derivations of the same identity, just indexed from a slightly different starting point; either is fine as long as the base case and the read-off position agree.)

## Complexity

For a `k × k` matrix, naive matrix multiplication costs `O(k³)` (three nested loops over `k`). Exponentiation by squaring needs only `O(log n)` matrix multiplications to compute `Mⁿ`, so the total cost is **`O(k³ log n)`**.

For Fibonacci specifically, `k = 2` is a constant, so the `k³` factor collapses to a constant multiplier and the whole computation is `O(log n)` — a genuine complexity-class win over the `O(n)` iterative/DP approach, in exactly the same spirit as [GCD's Euclidean algorithm](math-gcd-lcm.md) beating brute-force divisor search.

| Approach | Time | Space |
|---|---|---|
| Naive recursion | O(2ⁿ) | O(n) call stack |
| Iterative / DP | O(n) | O(1) |
| Matrix exponentiation | O(log n) | O(1) |

The gap between `O(n)` and `O(log n)` looks small until `n` is enormous — computing `F(1,000,000,000)` iteratively means a billion loop iterations; matrix exponentiation gets there in about 30 squarings.

## Real-World Problems & Solutions

### 1. Huge-Index Fibonacci for a Cryptographic-Style Puzzle

**Scenario:** A puzzle needs `F(n) mod (10^9 + 7)` for `n` up to a billion — far too large for an `O(n)` loop to finish in reasonable time.

```js
const MOD = 1_000_000_007;

function multiplyMatricesMod(a, b, mod) {
  const result = [[0, 0], [0, 0]];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let sum = 0;
      for (let k = 0; k < 2; k++) sum += a[i][k] * b[k][j];
      result[i][j] = sum % mod;
    }
  }
  return result;
}

function fibonacciModLarge(n, mod) {
  if (n === 0) return 0;
  let result = [[1, 0], [0, 1]];
  let base = [[1, 1], [1, 0]];
  let exp = n - 1;
  while (exp > 0) {
    if (exp % 2 === 1) result = multiplyMatricesMod(result, base, mod);
    base = multiplyMatricesMod(base, base, mod);
    exp = Math.floor(exp / 2);
  }
  return result[0][0];
}

fibonacciModLarge(1000000000, MOD); // computes instantly, ~30 squarings instead of a billion loop steps
```

Combining matrix exponentiation with the `% mod` reduction from [Modular Arithmetic](math-modular-arithmetic.md) keeps every intermediate matrix entry small while still finishing in `O(log n)` steps — this exact combination (fast exponentiation + a modulus) is the standard shape of "huge index, give the answer mod X" problems.

### 2. Counting Walks of Length K in a Graph

**Scenario:** In a social network modeled as a graph, count the number of distinct 4-step walks from user A back to themselves (a common building block for "mutual connections at distance K" style features).

```js
// adjacency matrix: users [A, B, C], edges A-B, B-C, C-A (a triangle)
const adjacency = [
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
];

const walksOf4Steps = matrixPower(adjacency, 4);
console.log(walksOf4Steps[0][0]); // walks of length 4 from A back to A
```

The number of walks of length `k` between node `i` and node `j` in a graph is exactly the `(i, j)` entry of `A^k`, where `A` is the adjacency matrix — a direct application of the same "matrix power advances the recurrence" idea used for Fibonacci, just with a graph's connectivity playing the role of the recurrence relation.

### 3. Fast-Forwarding Any Fixed-Order Linear Recurrence

**Scenario:** A population/inventory model follows `P(n) = 2×P(n−1) − P(n−2) + 3×P(n−3)` (a made-up but representative fixed-order linear recurrence) and needs the value at a very large `n`.

```js
// State vector [P(n), P(n-1), P(n-2)] advances via:
const M = [
  [2, -1, 3],
  [1,  0, 0],
  [0,  1, 0],
];
// matrixPower(M, n) applied to the initial state vector fast-forwards
// the recurrence to step n in O(log n) matrix multiplications.
```

This generalizes beyond Fibonacci to *any* fixed-order linear recurrence (Tribonacci-style sequences, certain financial/population growth models): encode the recurrence as a companion matrix like `M` above, and matrix exponentiation fast-forwards it exactly as it did for Fibonacci — the technique doesn't actually care what the recurrence represents.

## Key Takeaway

Matrix exponentiation is what happens when two ideas from earlier in this resource set combine: a linear recurrence can be encoded as repeated multiplication by a fixed matrix, and repeated multiplication — whether of numbers or matrices — can always be sped up from `O(n)` to `O(log n)` via exponentiation by squaring. Whenever a problem's recurrence is linear and fixed-order, and `n` is too large for an `O(n)` loop, matrix exponentiation (often paired with a modulus, as in the first real-world example) is the tool to reach for.
