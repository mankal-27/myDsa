class Solution {
    // Given an array of numbers arr, reverse it in place (mutate arr directly) and
    // return it. An empty array or single-element array reverses to itself unchanged.

    // Approach 1: brute force - build a reversed copy in a new array, then copy it back
    reverseArrayApproach1(arr) {
        // TODO: implement
        if(arr.length <= 1) return arr;
        const n = arr.length;
        const reversed = [];
        for(let i = n-1; i>= 0 ; i--){
            reversed.push(arr[i])
        }
        for(let i = 0 ; i < n ; i++){
            arr[i] = reversed[i];
        }
        return arr;
    }

    // Approach 2: optimized - two-pointer swap, no extra array needed
    reverseArrayApproach2(arr) {
        // TODO: implement
        if(arr.length <= 1) return arr;
        let left = 0;
        let right = arr.length - 1;
        while(left < right){
            const temp = arr[left]
            arr[left] = arr[right]
            arr[right] = temp;
            left++;
            right--
        }
        return arr;
    }
}

module.exports = Solution
