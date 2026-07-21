# Convert Seconds to Hours, Minutes, Seconds

**Difficulty:** Easy
**Topics:** Variables, Operators, Math (integer division & modulo)
**File:** [`Convert_Sec_to_Hours_Minutes_Seconds.js`](./Convert_Sec_to_Hours_Minutes_Seconds.js)
**Tests:** [`Convert_Sec_to_Hours_Minutes_Seconds.test.js`](./Convert_Sec_to_Hours_Minutes_Seconds.test.js)

## Problem Statement

Given a non-negative integer `totalSeconds`, convert it into hours, minutes, and seconds.

Return the result as an array `[hours, minutes, seconds]`, where `hours` is the number of whole hours, `minutes` is the number of whole minutes left over after the hours, and `seconds` is the number of seconds left over after the minutes.

### Example 1

```
Input:  totalSeconds = 3661
Output: [1, 1, 1]
```

### Example 2

```
Input:  totalSeconds = 86399
Output: [23, 59, 59]
```

### Constraints

- `totalSeconds` is a non-negative integer.

## Use Case

Converting a raw duration (seconds, milliseconds, frames) into human-readable units is one of the most common "formatting" tasks in real software:

- **UI/UX** — video/audio players, countdown timers, workout trackers, and stopwatches all need to turn a running seconds counter into `HH:MM:SS` for display.
- **Logging & monitoring** — uptime counters, job duration reports, and rate limiters convert elapsed seconds into readable breakdowns.
- **The underlying technique — integer division + modulo to peel off units from largest to smallest — generalizes far beyond time.** The same pattern converts bytes into KB/MB/GB, cents into dollars, or any base-N breakdown (e.g. converting a number into digits, or seconds into days/hours/minutes/seconds for longer durations).

## Concepts

- **Integer division** — `Math.floor(x / y)` (or `x / y | 0` for non-negative integers) to get the number of *whole* units.
- **Modulo (`%`)** — getting the remainder left over after removing whole units, which becomes the input for the next, smaller unit.
- **Order of operations matters** — you must extract the *largest* unit (hours) first, then work with what's left over for the next unit (minutes), then whatever remains becomes seconds directly.

## Approaches

### Brute Force — simulate a ticking clock

**Intuition:** A real clock doesn't "know" division — it just ticks forward one second at a time and rolls over into the next unit whenever the current one maxes out. Simulating that literally (increment seconds, roll into minutes at 60, roll into hours at 60) is the most direct translation of "how a clock works" into code.

**Solution:**

```js
convertSecondsBruteForce(totalSeconds) {
  let hours = 0, minutes = 0, seconds = 0;
  for (let i = 0; i < totalSeconds; i++) {
    seconds++;
    if (seconds === 60) { seconds = 0; minutes++; }
    if (minutes === 60) { minutes = 0; hours++; }
  }
  return [hours, minutes, seconds];
}
```

Correct, but it does `totalSeconds` loop iterations to compute an answer that's really just three divisions.

**Dry Run** (`totalSeconds = 62`, chosen small so the rollover is visible in a short trace):

| Iteration (`i`) | `seconds++` | Rollover? | `hours` | `minutes` | `seconds` |
|---|---|---|---|---|---|
| start | — | — | `0` | `0` | `0` |
| 0 | `seconds = 1` | no | `0` | `0` | `1` |
| ... | ... | no | `0` | `0` | ... |
| 58 | `seconds = 59` | no | `0` | `0` | `59` |
| 59 | `seconds = 60` | `seconds === 60` → `seconds = 0, minutes++` | `0` | `1` | `0` |
| 60 | `seconds = 1` | no | `0` | `1` | `1` |
| 61 | `seconds = 2` | no | `0` | `1` | `2` |

Loop ends after 62 iterations (`i` reaches `totalSeconds`). Return `[0, 1, 2]` — 62 seconds is 1 minute and 2 seconds. ✓

### Optimized — integer division + modulo

**Intuition:** The brute-force loop's rollovers happen at fixed, predictable points — every 60 seconds and every 3600 seconds — so there's no need to simulate the ticking at all. Integer division by 3600 directly answers "how many whole hours fit," and the remainder left over is exactly what the loop would have been counting through minutes and seconds; repeat the same idea one level down to split that remainder into minutes and seconds.

**Solution:**

```js
convertSecondsOptimized(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds];
}
```

No loop needed — three arithmetic operations regardless of how large `totalSeconds` is.

**Dry Run** (`totalSeconds = 3661`, Example 1):

| Step | Expression | Value |
|---|---|---|
| 1 | `hours = Math.floor(3661 / 3600)` | `Math.floor(1.017...) = 1` |
| 2 | `3661 % 3600` | `61` (seconds left over after removing the 1 whole hour) |
| 3 | `minutes = Math.floor(61 / 60)` | `Math.floor(1.016...) = 1` |
| 4 | `seconds = 3661 % 60` | `1` |

Return `[1, 1, 1]`. ✓ matches Example 1, in 4 arithmetic steps instead of 3,661 loop iterations.

## Complexity

| Approach | Time | Space | Why |
|---|---|---|---|
| Brute force (ticking clock) | O(n) where n = `totalSeconds` | O(1) | One loop iteration per second — for `totalSeconds = 86399` that's 86,399 iterations to compute 3 numbers. |
| Optimized (division + modulo) | O(1) | O(1) | A fixed number of arithmetic operations, independent of how large `totalSeconds` is. |

This is a good one to feel the difference on: try both with a large `totalSeconds` (like `31536000`, a year in seconds) and notice the brute-force version actually takes measurable time while the optimized one is instant — a concrete, visible example of why O(1) beats O(n).

## Implementation Notes

Both `convertSecondsBruteForce` and `convertSecondsOptimized` were implemented correctly on the first pass — no bugs found. Verified against 10 cases (including boundaries: `0`, `59`→`60`, `3599`→`3600`, and the two given examples) plus a direct brute-force-vs-optimized agreement check, all in `Convert_Sec_to_Hours_Minutes_Seconds.test.js`.

## Key Takeaway

Peeling off units largest-to-smallest with division and modulo is a pattern that reappears constantly — the exact same shape solves "convert bytes to KB/MB/GB," "convert cents to dollars," or "convert a number into its digits" (repeatedly dividing/modding by 10). Recognizing "this is a base-N unit breakdown" is often the whole trick.
