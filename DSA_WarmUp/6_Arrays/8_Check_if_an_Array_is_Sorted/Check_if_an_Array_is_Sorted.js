class Solution {
    // Given an array of numbers arr, return true if it is sorted in non-decreasing
    // order (each element >= the one before it), or false otherwise.
    // (An empty array or single-element array counts as sorted.)

    // Approach 1: manual loop comparing each element to the previous one
    isSortedApproach1(arr) {
        // TODO: implement
        if(arr.length <= 1) return true
        for(let i = 1 ; i < arr.length; i++){
            if(arr[i] < arr[i-1]){
                return false
            }
        }
        return true;
    }

    // Approach 2: Array.prototype.every
    isSortedApproach2(arr) {
        // TODO: implement
        return arr.every((val, i) => i === 0 || val >= arr[i-1]);
    }

    // Bonus: divide and conquer - a genuinely different algorithmic strategy.
    // Still O(n) overall (no complexity-class improvement over Approaches 1/2), but it
    // decomposes the problem recursively instead of scanning left-to-right, which is
    // the same shape merge sort uses and is naturally parallelizable (each half could
    // be checked independently/concurrently).
    isSortedBonusDivideConquer(arr, lo = 0, hi = arr.length - 1) {
        if (hi <= lo) return true;
        if (hi - lo === 1) return arr[lo] <= arr[hi];
        const mid = Math.floor((lo + hi) / 2);
        return (
            this.isSortedBonusDivideConquer(arr, lo, mid) &&
            this.isSortedBonusDivideConquer(arr, mid, hi)
        );
    }
}

module.exports = Solution
