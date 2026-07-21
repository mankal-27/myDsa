class Solution {
    // Given an integer num, return "Even" if it's even, or "Odd" if it's odd.

    // Approach 1: repeated subtraction
    evenOrOddBruteForce(num) {
        // TODO: implement
        if(num % 2 === 0){
            return "Even"
        }else{
            return "Odd"
        }
    }

    // Approach 2: bitwise AND with 1 (checks the least significant bit)
    evenOrOddOptimized(num) {
        // TODO: implement
        return (num & 1) === 0 ? "Even" : "Odd"
    }
}

module.exports = Solution
