class Solution {
    // Given an array of integers arr, return an object { even, odd } counting how many
    // elements are even and how many are odd. (0 counts as even. An empty array gives
    // { even: 0, odd: 0 }.)

    // Approach 1: manual loop with two counters
    countEvenAndOddApproach1(arr) {
        // TODO: implement
        let even = 0, odd = 0;
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i] % 2 === 0){
                even++
            }else{
                odd++
            }
        }
        return { even, odd};
    }

    // Approach 2: Array.prototype.reduce, building the { even, odd } object in one pass
    countEvenAndOddApproach2(arr) {
        // TODO: implement
        
        return arr.reduce((acc, curr) => {
            if(curr % 2 === 0){
                acc.even++
            }else{
                acc.odd++
            }
            return acc;
        }, { even : 0, odd: 0});
    }
}

module.exports = Solution
