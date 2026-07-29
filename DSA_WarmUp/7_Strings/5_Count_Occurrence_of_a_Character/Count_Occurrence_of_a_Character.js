class Solution {
    // Given a string str and a single character target, return how many times target
    // appears in str. Comparison is exact and case-sensitive. An empty string, or a
    // target that never appears, gives 0.

    // Approach 1: brute force - manual loop, comparing each character to target
    countOccurrenceApproach1(str, target) {
        // TODO: implement
        let count = 0;
        for(const ch of str){
            if(ch === target){
                count++
            }
        }
        return count;
    }

    // Approach 2: optimized - split on target and count the gaps between pieces
    countOccurrenceApproach2(str, target) {
        // TODO: implement
        return str.split(target).length - 1
    }

    // Bonus: build a full frequency map of every character in str (reusing the exact
    // technique from Count Frequency of Each Element), then this single character's
    // count is just one O(1) lookup into it. Worth it if you need counts for several
    // different characters from the same string - wasteful if you only ever need one.
    countOccurrenceBonusFrequencyMap(str) {
        const freq = {};
        for (const ch of str) {
            freq[ch] = (freq[ch] || 0) + 1;
        }
        return freq;
    }
}

module.exports = Solution
