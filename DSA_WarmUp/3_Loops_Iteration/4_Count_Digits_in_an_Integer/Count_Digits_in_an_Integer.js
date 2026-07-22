class Solution {
    // Given an integer num (may be negative), return the number of digits it has.
    // (num = 0 has 1 digit; the sign of a negative number doesn't count as a digit.)

    // Approach 1: brute force - repeatedly divide by 10, counting iterations
    countDigitsApproach1(num) {
        // TODO: implement
        num = Math.abs(num)
        if(num === 0) return 1;
        let count = 0;
        while(num > 0){
            num = Math.floor(num/10)
            count++
        }
        return count
    }

    // Approach 2: optimized - Math.log10 closed-form formula
    countDigitsApproach2(num) {
        // TODO: implement
        num = Math.abs(num)
        if(num === 0) return 1;
        return Math.floor(Math.log10(num)) + 1;
    }
}

module.exports = Solution
