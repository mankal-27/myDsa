# JavaScript for DSA

A crash-course reference for solving Data Structures & Algorithms problems in JavaScript — the language quirks, built-ins, and idioms that come up constantly in interview-style problems.

## Numbers: the trap to know

JS has one numeric type (`Number`, a 64-bit float), so there's no separate int/long. Two consequences that matter for DSA:

```js
Number.MAX_SAFE_INTEGER   // 2^53 - 1 — beyond this, integer math can silently lose precision
9007199254740993 === 9007199254740992   // true (!) — precision lost

// For huge sums (e.g. big-number problems), use BigInt
const big = 123456789012345678901234567890n;
```

Integer division needs a manual floor/trunc:

```js
Math.floor(7 / 2)   // 3
Math.trunc(-7 / 2)  // -3 (toward zero, matches most languages' `/` for ints)
7 % 3                // 1 — but beware negative operands: -7 % 3 === -1 in JS, not 2
```

## Control flow essentials

```js
for (let i = 0; i < n; i++) { }        // classic index loop
for (const x of arr) { }                // value iteration (arrays, strings, Map, Set)
for (const key in obj) { }              // key iteration (objects) — avoid on arrays

let i = 0;
while (i < n) { i++; }

// Labeled break/continue — useful for nested loop early exit
outer:
for (let i = 0; i < n; i++) {
  for (let j = 0; j < m; j++) {
    if (grid[i][j] === target) break outer;
  }
}
```

## Functions, scope, closures

`let`/`const` are block-scoped; `var` is function-scoped — always prefer `let`/`const` to avoid loop-variable capture bugs.

```js
// Classic closure bug with var vs let
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 3, 3, 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 0, 1, 2
```

Closures are how you build memoization caches without a class:

```js
function makeFibMemo() {
  const cache = new Map();
  return function fib(n) {
    if (n <= 1) return n;
    if (cache.has(n)) return cache.get(n);
    const result = fib(n - 1) + fib(n - 2);
    cache.set(n, result);
    return result;
  };
}
const fib = makeFibMemo();
```

## Arrays — the DSA workhorse

```js
const arr = [5, 3, 8, 1];

arr.push(x); arr.pop();          // O(1) — stack operations
arr.unshift(x); arr.shift();     // O(n) — avoid in hot loops; use a pointer/index instead
arr.slice(i, j);                 // shallow copy, non-mutating
arr.splice(i, 1);                // mutating remove/insert, O(n)
arr.length = 0;                  // clear an array in place

// Building a 2D grid (avoid arr(n).fill([]) — that shares one array reference!)
const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));

// Fixed-size init
const seen = new Array(n).fill(false);

// Iteration helpers (all non-mutating, return new arrays/values)
arr.map(x => x * 2);
arr.filter(x => x > 3);
arr.reduce((acc, x) => acc + x, 0);
arr.find(x => x > 3);
arr.findIndex(x => x > 3);
arr.some(x => x > 3);
arr.every(x => x > 0);

// Destructuring + swap without a temp variable
let [a, b] = [1, 2];
[a, b] = [b, a];
```

Sorting — the comparator is the part everyone forgets:

```js
arr.sort();                          // WRONG for numbers: sorts as strings! [10, 2, 1] stays [1, 10, 2]
arr.sort((a, b) => a - b);           // ascending numeric
arr.sort((a, b) => b - a);           // descending numeric
intervals.sort((a, b) => a[0] - b[0]); // sort by first element of each pair
```

## Strings

Strings are immutable — every "modification" builds a new string, so prefer an array buffer for heavy per-character work.

```js
const s = "hello world";
s[0];                        // 'h' — read-only, s[0] = 'H' silently does nothing
s.split(" ");                 // ['hello', 'world']
s.slice(0, 5);                // 'hello'
s.charCodeAt(0);              // 104 — useful for char-frequency arrays (subtract 'a'.charCodeAt(0))
String.fromCharCode(104);     // 'h'

// Building a string efficiently: collect chars in an array, join once
const chars = [];
for (const c of s) chars.push(c);
chars.join("");

// Reverse a string
s.split("").reverse().join("");
```

## Map, Set, and plain Object

Three ways to hold key-value / uniqueness data — pick deliberately:

```js
// Map — preserves insertion order, any key type, use .size — the default choice for frequency maps
const freq = new Map();
for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);
for (const [key, count] of freq) { }        // iterate entries in insertion order

// Set — uniqueness, O(1) has/add/delete
const seen = new Set();
seen.add(x); seen.has(x); seen.delete(x);
[...new Set(arr)];                           // dedupe an array

// Plain object — fine for string keys, but watch out for prototype-chain keys like "toString"
const obj = Object.create(null);              // safe empty object with no inherited keys
```

`Map`/`Set` are almost always the right choice for DSA over plain objects — no key-collision surprises, real `.size`, and ordered iteration.

## Functional patterns worth knowing

```js
// Sorting with a secondary key
people.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name));

// Group-by (manual, no built-in until Object.groupBy in newer runtimes)
const groups = new Map();
for (const item of items) {
  const key = item.category;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(item);
}

// Flatten nested arrays
[[1, 2], [3, [4, 5]]].flat(Infinity);   // [1, 2, 3, 4, 5]
```

## Null, undefined, and safe access

```js
let x;               // undefined — declared, not assigned
let y = null;         // null — explicitly "no value"

a ?? b;               // nullish coalescing: b only if a is null/undefined (NOT just falsy)
a?.b?.c;              // optional chaining — safe nested access, returns undefined if any link is missing
a?.[0];               // optional array index access
```

`??` vs `||` matters in DSA: `0 ?? 5` is `0`, but `0 || 5` is `5` — use `??` when zero/empty-string are valid values (e.g. default values in a frequency map).

## Iterating and modifying safely

Never mutate an array while iterating it with `for...of` or `.forEach` — indices shift underneath you. Iterate backwards, or collect indices to remove and splice after:

```js
// Safe removal while iterating: go backwards
for (let i = arr.length - 1; i >= 0; i--) {
  if (arr[i] % 2 === 0) arr.splice(i, 1);
}
```

## Recursion and the call stack

JS has no tail-call optimization in practice (engines don't reliably implement it), so deep recursion (~10,000+ frames depending on engine) can hit `Maximum call stack size exceeded`. For DSA problems with large inputs, prefer an explicit stack/queue over recursion, or add memoization to cut branching:

```js
// Iterative DFS using an explicit stack instead of recursive calls
function dfsIterative(start, graph) {
  const stack = [start];
  const visited = new Set([start]);
  while (stack.length) {
    const node = stack.pop();
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}
```

## Graph representation patterns

```js
// Adjacency list via Map<node, node[]>
const graph = new Map();
function addEdge(u, v) {
  if (!graph.has(u)) graph.set(u, []);
  if (!graph.has(v)) graph.set(v, []);
  graph.get(u).push(v);
  graph.get(v).push(u);   // omit for directed graphs
}

// BFS with a queue (arrays as queues are O(n) shift — for large inputs use an index pointer instead)
function bfs(start, graph) {
  const queue = [start];
  let head = 0;                    // pointer avoids O(n) shift() cost
  const visited = new Set([start]);
  while (head < queue.length) {
    const node = queue[head++];
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```

## Pairs and tuples (JS has neither natively)

```js
// Use a fixed-length array
const pair = [row, col];
const [r, c] = pair;

// Use a string key for Set/Map membership of composite keys (e.g. visited grid cells)
const key = `${row},${col}`;
visited.add(key);

// Or encode two small ints into one number (careful with sign/overflow)
const encoded = row * cols + col;
```

## Deduplication patterns

```js
[...new Set(arr)];                                    // dedupe primitives
Array.from(new Set(arr));                             // same, more explicit

// Dedupe objects by a derived key
const seen = new Set();
const deduped = arr.filter(item => {
  const key = item.id;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
```

## Common DSA idioms

```js
// Min/max of an array
Math.max(...arr);           // spreads — avoid on very large arrays (arg limit ~65k+ can throw)
arr.reduce((a, b) => Math.max(a, b));   // safe for any size

// Initialize with Infinity/-Infinity as sentinels
let best = Infinity;

// Binary search (manual — no built-in bsearch in vanilla JS)
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}

// Priority queue: no built-in — simulate with a sorted insert, or implement a binary heap for real use
```

## OOP basics for design problems (LRU cache, trie, etc.)

```js
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) return false;
      node = node.children.get(ch);
    }
    return node.isEnd;
  }
}
```

## Further reading

- [JavaScript Crash Course for DSA — AlgoMaster](https://algomaster.io/learn/dsa/javascript-crash-course) (premium article — full walkthrough with more depth on each topic above)
- [MDN: JavaScript Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) / [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
