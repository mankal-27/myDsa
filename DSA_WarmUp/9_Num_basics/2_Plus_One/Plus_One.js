class Solution {
    // Given a non-empty array of digits representing a non-negative integer (most
    // significant digit first), increment the integer by one and return the new
    // array of digits.

    // Approach 1: brute force - convert to a number, add 1, convert back to digits
    plusOneApproach1(digits) {
        // TODO: implement
        const num = BigInt(digits.join(''));
        const result = (num + 1n).toString();
        return result.split('').map(Number);
    }

    // Approach 2: optimized - walk from the last digit, handle carry in place,
    // only allocate a new array if every digit was a 9 (overflow into a new leading digit)
    plusOneApproach2(digits) {
        // TODO: implement
        for(let i = digits.length-1 ; i>=0; i--){
            if(digits[i] < 9){
                digits[i]++
                return digits;
            }
            digits[i] = 0
        }
        return [1, ...digits];
    }

    // Bonus: same carry-propagation logic as Approach 2, expressed recursively
    // instead of with a loop
    plusOneBonusRecursive(digits, index = digits.length - 1) {
        if (index < 0) return [1, ...digits];
        if (digits[index] < 9) {
            digits[index]++;
            return digits;
        }
        digits[index] = 0;
        return this.plusOneBonusRecursive(digits, index - 1);
    }
}

module.exports = Solution
