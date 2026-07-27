# DSA Patterns & Resources

A personal repository for studying Data Structures and Algorithms — organized by pattern, with animations and reference material for each concept.

## Goal

Build pattern-based intuition for DSA (not just solve random problems) by pairing each pattern with visual explanations and curated resources.

## Structure

```
my_dsa/
├── DSA_WarmUp/       # Foundational problems, grouped by module; each problem gets its own folder
│   ├── 1_Variables_Io_Operations/
│   │   ├── 1_Swap_Two_Numbers/
│   │   │   ├── README.md
│   │   │   ├── Swap_Two_Numbers.js
│   │   │   └── Swap_Two_Numbers.test.js
│   │   └── 2_Temperature_Converter/
│   │       ├── README.md
│   │       ├── Temperature_Converter.js
│   │       └── Temperature_Converter.test.js
│   ├── 2_Conditionals_Dec/
│   │   ├── 1_Even_or_Odd/
│   │   │   ├── README.md
│   │   │   ├── Even_or_Odd.js
│   │   │   └── Even_or_Odd.test.js
│   │   ├── 2_Positive_Negative_or_Zero/
│   │   │   ├── README.md
│   │   │   ├── Positive_Negative_or_Zero.js
│   │   │   └── Positive_Negative_or_Zero.test.js
│   │   └── ... (Leap Year Check, Grade from Marks, Valid Triangle, Vowel or Consonant, Collinear Points)
│   ├── 3_Loops_Iteration/
│   │   ├── 1_Print_Numbers_from_1_to_N/
│   │   │   ├── README.md
│   │   │   └── Print_Numbers_from_1_to_N.js
│   │   └── ... (Multiplication Table, Sum of Even/Odd Numbers, Count Digits, Sum of All Divisors)
│   ├── 4_Pattern_Printing/
│   │   └── 1_Right-Angled_Triangle_of_Stars/
│   │       ├── README.md
│   │       └── Right-Angled_Triangle_of_Stars.js
│   ├── 5_Number_Theory/
│   │   ├── 1_Prime_Number_Check/
│   │   │   ├── README.md
│   │   │   └── Prime_Number_Check.js
│   │   └── 2_Print_All_Primes_Up_to_N/
│   │       ├── README.md
│   │       └── Print_All_Primes_Up_to_N.js
│   ├── 6_Arrays/
│   │   ├── 1_Sum_of_All_Elements/
│   │   │   ├── README.md
│   │   │   └── Sum_of_All_Elements.js
│   │   ├── 2_Average_of_Array_Elements/
│   │   │   ├── README.md
│   │   │   └── Average_of_Array_Elements.js
│   │   ├── 3_Largest_Element_in_an_Array/
│   │   │   ├── README.md
│   │   │   └── Largest_Element_in_an_Array.js
│   │   ├── 4_Second_Largest_Element/
│   │   │   ├── README.md
│   │   │   └── Second_Largest_Element.js
│   │   ├── 5_Count_Even_and_Odd_Numbers/
│   │   │   ├── README.md
│   │   │   └── Count_Even_and_Odd_Numbers.js
│   │   ├── 6_Linear_Search_for_a_Target/
│   │   │   ├── README.md
│   │   │   └── Linear_Search_for_a_Target.js
│   │   ├── 7_Reverse_an_Array_In_Place/
│   │   │   ├── README.md
│   │   │   └── Reverse_an_Array_In_Place.js
│   │   ├── 8_Check_if_an_Array_is_Sorted/
│   │   │   ├── README.md
│   │   │   └── Check_if_an_Array_is_Sorted.js
│   │   └── 9_Count_Frequency_of_Each_Element/
│   │       ├── README.md
│   │       └── Count_Frequency_of_Each_Element.js
│   └── 7_Strings/
│       ├── 1_Length_of_a_String/
│       │   ├── README.md
│       │   └── Length_of_a_String.js
│       └── 2_Count_Vowels_and_Consonants/
│           ├── README.md
│           └── Count_Vowels_and_Consonants.js
├── patterns/       # One folder per pattern (two-pointers, sliding-window, etc.)
├── resources/       # Links, notes, and reference material per concept
├── animations/       # Visualizations/animations used to build intuition
└── problems/       # Practice problems mapped to each pattern
```

Each problem folder follows the same layout: a `README.md`, the solution file, and a `*.test.js` file. Run `npm test` from the repo root to run every test.

### DSA WarmUp Modules

| Module | Folder | Status | Problems |
|---|---|---|---|
| Variables & I/O Operations | `1_Variables_Io_Operations/` | Complete | Swap Two Numbers, Temperature Converter, Simple & Compound Interest, Convert Seconds to H/M/S, Absolute Value Without Built-in, Quotient & Remainder of Division, Area & Perimeter of Shapes |
| Conditionals & Decision Making | `2_Conditionals_Dec/` | Complete | Even or Odd, Positive/Negative/Zero, Leap Year Check, Grade from Marks, Valid Triangle from Three Sides, Vowel or Consonant, Check if Three Points are Collinear |
| Loops & Iteration | `3_Loops_Iteration/` | Complete | Print Numbers from 1 to N, Multiplication Table of a Number, Sum of Even or Odd Numbers from 1 to N, Count Digits in an Integer, Sum of All Divisors of a Number |
| Pattern Printing | `4_Pattern_Printing/` | In progress | Right-Angled Triangle of Stars |
| Number Theory | `5_Number_Theory/` | In progress | Prime Number Check, Print All Primes Up to N |
| Arrays | `6_Arrays/` | In progress | Sum of All Elements, Average of Array Elements, Largest Element in an Array, Second Largest Element, Count Even and Odd Numbers, Linear Search for a Target, Reverse an Array In Place, Check if an Array is Sorted, Count Frequency of Each Element |
| Strings | `7_Strings/` | In progress | Length of a String, Count Vowels and Consonants |

### Problem README Template

Every problem's `README.md` covers:

1. **Problem Statement** — the prompt, examples, and constraints.
2. **Use Case** — where this concept/technique actually shows up (real systems, other algorithms, common interview follow-ups) — not just "how" but "why it matters."
3. **Concepts** — the specific language/DSA concepts the problem exercises.
4. **Approach(es)** — brute force first, then optimized (and any bonus approaches), each with:
   - **Intuition** — the reasoning that leads to this approach, in plain language, before any code.
   - **Solution** — the code.
   - **Dry Run** — a step-by-step trace through a concrete example, showing how the variables change.
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
