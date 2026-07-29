class Solution {
    // Given a string str, return true if it reads the same forwards and backwards
    // (an exact, case-sensitive character comparison), or false otherwise.
    // (An empty string and a single-character string both count as palindromes.)

    // Approach 1: brute force - build the reversed string, then compare
    isPalindromeApproach1(str) {
        // TODO: implement
        const reversed = str.split('').reverse().join('');
        return str === reversed;
    }

    // Approach 2: optimized - two-pointer comparison from both ends, no extra string built
    isPalindromeApproach2(str) {
        // TODO: implement
        let left = 0
        let right = str.length - 1;
        while(left < right){
            if(str[left] !== str[right]){
                return false
            }
            left++
            right--
        }
        return true
    }
}

module.exports = Solution
