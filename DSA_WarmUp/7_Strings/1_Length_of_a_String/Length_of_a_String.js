class Solution {
    // Given a string str, return the number of characters it contains.
    // (An empty string has length 0.)

    // Approach 1: brute force - manually count characters with a loop
    lengthOfStringApproach1(str) {
        // TODO: implement
        let count = 0;
        for(const ch of str){
            count++;
        }
        return count;
    }

    // Approach 2: optimized - the built-in String.prototype.length property
    lengthOfStringApproach2(str) {
        // TODO: implement
        return str.length;
    }
}

module.exports = Solution
