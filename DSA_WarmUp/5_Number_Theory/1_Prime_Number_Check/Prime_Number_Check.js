class Solution {
    // Given an integer n, return true if n is a prime number, or false otherwise.
    // (A prime has exactly two positive divisors: 1 and itself. Numbers less than 2 are not prime.)

    // Approach 1: brute force - check every number from 2 up to n - 1
    isPrimeApproach1(n) {
        // TODO: implement
        if ( n < 2 ) return false
        for(let i = 2 ; i < n ; i++){
            if(n % i === 0){
                return false
            }
        }
        return true;
    }

    // Approach 2: optimized - only check up to sqrt(n), skipping even numbers after 2
    isPrimeApproach2(n) {
        // TODO: implement
        if(n < 2) return false;
        if(n === 2) return true;
        if(n % 2 === 0) return false;
        for(let i = 3 ; i * i <= n; i+= 2){
            if(n % i === 0){
                return false
            }
        }
        return true
    }
}

module.exports = Solution
