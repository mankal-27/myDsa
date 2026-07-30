class Solution {
    // Given a non-negative integer n, return the sum of all natural numbers from 1 to n
    // (1 + 2 + ... + n). n = 0 sums to 0.

    // Approach 1: recursive - n + sum(n - 1), with 0 as the base case
    sumOfNApproach1(n) {
        // TODO: implement
        if(n <= 0) return 0;
        return n + this.sumOfNApproach1(n - 1);
    }

    // Approach 2: optimized - Gauss's closed-form formula, no recursion needed
    sumOfNApproach2(n) {
        // TODO: implement
        if( n <= 0) return 0;
        return (n * (n + 1) / 2);
    }
}

module.exports = Solution
