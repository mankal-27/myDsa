class Solution {
    // Given a string str representing a sentence, return the longest word in it. Words
    // are separated by one or more spaces. If there's a tie, return whichever longest
    // word appears first. An empty string, or a string with only spaces, returns "".

    // Approach 1: brute force - split into a words array, then scan it for the longest
    findLongestWordApproach1(str) {
        // TODO: implement
        const trimmed = str.trim();
        if(trimmed === '') return '';
        const words = trimmed.split(/ +/);
        let longest = words[0];
        for(let i = 1 ; i < words.length; i++){
            if(words[i].length > longest.length){
                longest = words[i];
            }
        }
        return longest;
    }

    // Approach 2: optimized - single character scan, tracking word boundaries directly
    findLongestWordApproach2(str) {
        // TODO: implement
        let longest = '';
        let currentStart = -1;
        for(let i = 0 ; i <= str.length; i++){
            const ch = str[i];
            const isSpaceOrEnd = ch === ' ' || ch === undefined;
            if(!isSpaceOrEnd && currentStart === -1){
                currentStart = i;
            }else if (isSpaceOrEnd && currentStart !== -1){
                const word = str.slice( currentStart , i);
                if(word.length > longest.length){
                    longest = word;
                }
                currentStart = -1;
            }
        }
        return longest;
    }
}

module.exports = Solution
