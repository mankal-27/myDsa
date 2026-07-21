class Solution {
    // Given a non-negative integer n, return an array of the numbers from 1 to n, in order.
    // (n = 0 returns an empty array.)

    // Approach 1: iterative (for loop)
    printNumbersApproach1(n) {
        if(n === 0) return []
        let finalResult = []
        for(let i = 1 ; i <= n ; i++){
            finalResult.push(i)
        }
        return finalResult
    }

    // Approach 2: recursive (accumulator-passing, to avoid the array-spread pitfall)
    printNumbersApproach2(n, current = 1, result = []) {
        // TODO: implement
        if(current > n){
            return result
        }
        result.push(current);
        return this.printNumbersApproach2(n, current + 1, result);
    }
}

module.exports = Solution
