class Solution {
    // Given an array of numbers arr, return the second largest *distinct* value in it.
    // (If arr has fewer than 2 distinct values - e.g. it's empty, has one element, or every
    // element is the same - there is no second largest, so return undefined.)

    // Approach 1: brute force - dedupe, sort descending, take index 1
    secondLargestApproach1(arr) {
        // TODO: implement
        const unique = [...new Set(arr)].sort((a,b) => b - a);
        if(unique.length < 2) return undefined;
        return unique[1];
    }

    // Approach 2: optimized - single pass tracking the largest and second largest
    secondLargestApproach2(arr) {
        // TODO: implement
        let first = -Infinity;
        let second = -Infinity;
        for(const num of arr){
            if(num > first){
                second = first
                first = num;
            }else if( num < first && num > second){
                second = num;
            }
        }
        return second === -Infinity ? undefined : second;
    }
}

module.exports = Solution
