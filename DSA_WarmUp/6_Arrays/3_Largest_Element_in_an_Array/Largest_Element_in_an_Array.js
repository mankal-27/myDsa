class Solution {
    // Given an array of numbers arr, return the largest element in it.
    // (An empty array has no largest element - return undefined in that case.)

    // Approach 1: manual loop, tracking a running maximum
    largestElementApproach1(arr) {
        // TODO: implement
        if(arr.length === 0) return undefined
        let max = arr[0]
        for(let i = 1 ; i < arr.length ; i++){
            if(max < arr[i]){
                max = arr[i]
            }
        }
        return max;
    }

    // Approach 2: Math.max with the spread operator
    largestElementApproach2(arr) {
        // TODO: implement
        if(arr.length === 0) return undefined
        return Math.max(...arr);
    }
}

module.exports = Solution
