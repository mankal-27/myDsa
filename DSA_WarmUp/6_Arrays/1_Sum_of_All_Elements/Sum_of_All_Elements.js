class Solution {
    // Given an array of numbers arr, return the sum of all its elements.
    // (An empty array sums to 0.)

    // Approach 1: manual loop with an accumulator
    sumOfAllElementsApproach1(arr) {
        // TODO: implement
        let sum = 0
        for(let i = 0 ; i < arr.length; i++){
            sum += arr[i]
        }
        return sum;
    }

    // Approach 2: Array.prototype.reduce
    sumOfAllElementsApproach2(arr) {
        // TODO: implement
        return arr.reduce((acc, curr) => acc + curr, 0);
    }
}

module.exports = Solution
