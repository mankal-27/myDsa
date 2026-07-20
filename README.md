# DSA Patterns & Resources

A personal repository for studying Data Structures and Algorithms — organized by pattern, with animations and reference material for each concept.

## Goal

Build pattern-based intuition for DSA (not just solve random problems) by pairing each pattern with visual explanations and curated resources.

## Structure

```
my_dsa/
├── DSA_WarmUp/       # Foundational problems, grouped by topic; each problem gets its own folder
│   └── Variables_I/
│       ├── 1_Swap_Two_Numbers/
│       │   ├── README.md
│       │   ├── Swap_Two_Numbers.js
│       │   └── Swap_Two_Numbers.test.js
│       └── 2_Temperature_Converter/
│           ├── README.md
│           ├── Temperature_Converter.js
│           └── Temperature_Converter.test.js
├── patterns/       # One folder per pattern (two-pointers, sliding-window, etc.)
├── resources/       # Links, notes, and reference material per concept
├── animations/       # Visualizations/animations used to build intuition
└── problems/       # Practice problems mapped to each pattern
```

Each problem folder follows the same layout: a `README.md`, the solution file, and a `*.test.js` file. Run `npm test` from the repo root to run every test.

### Problem README Template

Every problem's `README.md` covers:

1. **Problem Statement** — the prompt, examples, and constraints.
2. **Use Case** — where this concept/technique actually shows up (real systems, other algorithms, common interview follow-ups) — not just "how" but "why it matters."
3. **Concepts** — the specific language/DSA concepts the problem exercises.
4. **Approach(es)** — one or more solutions with code.
5. **Complexity** — time and space complexity in Big-O notation for every approach, with a short justification (not just the notation).

## Patterns to Cover

- Arrays & Strings
- Two Pointers
- Sliding Window
- Fast & Slow Pointers
- Binary Search
- Recursion & Backtracking
- Trees & Binary Search Trees
- Graphs (BFS/DFS)
- Dynamic Programming
- Greedy
- Heaps / Priority Queues
- Tries
- Union-Find
- Topological Sort
- Bit Manipulation

## Resources

- [VisuAlgo](https://visualgo.net/) — algorithm visualizations
- [NeetCode](https://neetcode.io/) — pattern-based problem roadmap
- [USACO Guide](https://usaco.guide/) — structured DSA curriculum
- [Algorithm Visualizer](https://algorithm-visualizer.org/)

## Language Chapters

- [JavaScript for DSA](resources/javascript-for-dsa.md) — JS fundamentals, built-ins, and idioms for solving DSA problems

## Progress

Track pattern-by-pattern progress here as concepts are studied.

| Pattern | Status | Notes |
|---|---|---|
| Two Pointers | Not started | |
| Sliding Window | Not started | |
| Binary Search | Not started | |
