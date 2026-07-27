class Solution {
    // Given an array of numbers arr, return an object mapping each distinct value in arr
    // to how many times it appears. (An empty array returns an empty object {}.)

    // Approach 1: brute force - for each new distinct value, rescan the whole array to count it
    countFrequencyApproach1(arr) {
        // TODO: implement
        const freq = {}
        for(let i = 0 ; i < arr.length ; i++){
            const num = arr[i];
            if(freq[num] === undefined){
                let count = 0;
                for(let j = 0 ; j < arr.length ; j++){
                    if(arr[j] === num){
                        count++
                    }
                }
                freq[num] = count;
            }
        }
        return freq
    }

    // Approach 2: optimized - single pass, tallying counts in a hash map as we go
    countFrequencyApproach2(arr) {
        // TODO: implement
        const freq = {}
        for(const num of arr){
            freq[num] = (freq[num] || 0) + 1;
        }
        return freq;
    }
}

module.exports = Solution
