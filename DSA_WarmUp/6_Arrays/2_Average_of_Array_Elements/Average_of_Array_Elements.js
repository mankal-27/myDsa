class Solution {
    // Given an array of numbers arr, return the average (arithmetic mean) of its elements.
    // (An empty array's average is defined as 0 here, to avoid dividing by zero / returning NaN.)

    // Approach 1: manual loop with an accumulator, then divide by the count
    averageOfArrayApproach1(arr) {
        // TODO: implement
        if(arr.length === 0) return 0;
        let sum = 0;
        for(let i = 0 ; i < arr.length; i++){
            sum += arr[i]
        }
        return sum / arr.length;
    }

    // Approach 2: Array.prototype.reduce, then divide by the count
    averageOfArrayApproach2(arr) {
        // TODO: implement
        if(arr.length === 0) return 0
        return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
    }
}

module.exports = Solution
