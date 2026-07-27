class Solution {
    // Given an integer n, return an array of all prime numbers from 2 up to and including n
    // (in ascending order). If n < 2, return an empty array.

    // Approach 1: brute force - trial-divide every number from 2 to n
    printAllPrimesApproach1(n) {
        // TODO: implement
        const primes = []
        for(let num = 2; num <= n; num++){
            if(isPrime(num)){
                primes.push(num);
            }
        }
        return primes

        function isPrime(num){
            if(num < 2 ) return false;
            for(let i = 2; i*i <= num; i++){
                if(num % i === 0) return false
            }
            return true;
        }
    }

    // Approach 2: optimized - Sieve of Eratosthenes
    printAllPrimesApproach2(n) {
        // TODO: implement
        if(n < 2 ) return [];
        const isComposite = new Array(n + 1).fill(false);
        const primes = [];
        for(let i = 2 ; i <=n ; i++){
            if(!isComposite[i]){
                primes.push(i);
                for(let j = i*i; j<=n ; j+=i){
                    isComposite[j] = true;
                }
            }
        }
        return primes;
    }
}

module.exports = Solution
