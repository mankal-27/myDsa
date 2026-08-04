class Solution {
    // Given an integer x, return true if x reads the same forwards and backwards
    // (a palindrome), and false otherwise. Negative numbers are never palindromes
    // (the '-' sign only appears at the front).

    // Approach 1: convert to string, compare against its reverse
    isPalindromeApproach1(x) {
        // TODO: implement
        if(x < 0) return false;
        const str = String(x);
        return str === str.split('').reverse().join('');
    }

    // Approach 2: optimized - no string conversion; reverse only the second half
    // of the digits mathematically and compare against the first half
    isPalindromeApproach2(x) {
        // TODO: implement
        if(x < 0) return false;
        if( x !== 0 && x % 10 === 0) return false;

        let reversedHalf = 0;
        while( x > reversedHalf){
            reversedHalf = reversedHalf * 10 + (x % 10);
            x = Math.floor(x / 10);
        }

        return x === reversedHalf || x === Math.floor( reversedHalf / 10);
    }
}

module.exports = Solution
