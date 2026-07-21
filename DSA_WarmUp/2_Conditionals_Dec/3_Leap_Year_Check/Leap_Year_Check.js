class Solution {
    // Given an integer year, return true if it's a leap year, or false otherwise.
    // Rule: divisible by 4, EXCEPT century years (divisible by 100) which are only
    // leap years if also divisible by 400.

    // Approach 1: brute force - determine divisibility via repeated subtraction
    isDivisibleBruteForce(n, divisor) {
        // TODO: implement
        let remaining = Math.abs(n);
        while (remaining >= divisor) {
                remaining -= divisor;
        }
        return remaining === 0;
    }

    isLeapYearBruteForce(year) {
        // TODO: implement
        const isDivisibleBy4 = this.isDivisibleBruteForce(year,4)
        const isDivisibleBy100 = this.isDivisibleBruteForce(year, 100)
        const isDivisibleBy400 = this.isDivisibleBruteForce(year, 400)
        return isDivisibleBy4 && (!isDivisibleBy100 || isDivisibleBy400)
    }

    // Approach 2: optimized - modulo operator
    isLeapYearOptimized(year) {
        // TODO: implement
        return ((year % 4 === 0) && ((year % 100 !== 0)|| year % 400 === 0))
    }
}

module.exports = Solution
