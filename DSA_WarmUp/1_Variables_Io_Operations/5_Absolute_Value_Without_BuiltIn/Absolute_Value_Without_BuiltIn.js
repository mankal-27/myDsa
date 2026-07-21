class Solution {
    // Given an integer num, return its absolute value WITHOUT using Math.abs()
    // (or any other built-in absolute-value function).

    // Approach 1: conditional check
    absoluteValueBruteForce(num) {
        if(num < 0) return (- num)
        return num
    }

    // Approach 2: branchless, using two's complement bit trick (32-bit integers only)
    absoluteValueOptimized(num) {
        let mask = num >> 31
        return (num ^ mask) - mask
    }
}

module.exports = Solution
