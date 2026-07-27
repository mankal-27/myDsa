class Solution {
    // Given an array of numbers arr and a target value, return the index of the first
    // occurrence of target in arr, or -1 if it isn't present.

    // Approach 1: manual loop, checking each element in order
    linearSearchApproach1(arr, target) {
        // TODO: implement
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i] === target){
                return i
            }
        }
        return -1
    }

    // Approach 2: Array.prototype.indexOf
    linearSearchApproach2(arr, target) {
        // TODO: implement
        return arr.indexOf(target)
    }

    // Bonus: sentinel linear search - a genuine algorithmic variant of linear search
    // that trims each loop iteration from two comparisons (bounds check + equality
    // check) down to one, by temporarily placing target as a sentinel at the end
    // of the array so the loop never needs to check `i < arr.length`.
    linearSearchBonusSentinel(arr, target) {
        const n = arr.length;
        if (n === 0) return -1;

        const last = arr[n - 1];
        arr[n - 1] = target;

        let i = 0;
        while (arr[i] !== target) {
            i++;
        }

        arr[n - 1] = last;

        if (i < n - 1 || last === target) {
            return i;
        }
        return -1;
    }
}

module.exports = Solution
