class Solution {
    // Given a positive integer n, return the sum of all its divisors, including 1 and n itself.

    // Approach 1: brute force - check every number from 1 to n
    sumOfDivisorsApproachWithNoArrays(n) {
        // TODO: implement
        let findDivisor = [];
        for(let i = 1; i <=n ; i++){
            if(n % i === 0){
                findDivisor.push(i)
            }
        }
        return findDivisor.reduce((acc,curr) => acc + curr, 0)
    }

    sumOfDivisorsApproach1(n){
        let sum = 0;
        for(let i = 0 ; i <=n ; i++){
            if(n % i === 0){
                sum += i;
            }
        }
        return sum;
    }

    // Approach 2: optimized - only check up to sqrt(n), adding divisor pairs
    sumOfDivisorsApproach2(n) {
        // TODO: implement
        let sum = 0;
        for(let i = 1 ; i*i <=n ; i++){
            if(n % i === 0){
                sum += i;
                const pair = n / i
                if(pair !== i){
                    sum += pair
                }
            }
        }
        return sum;
    }
}

module.exports = Solution
