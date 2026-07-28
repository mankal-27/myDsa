class Solution {
    // Given a string str representing a sentence, return the number of words in it.
    // Words are separated by one or more spaces; leading, trailing, and repeated spaces
    // don't count as words. An empty string or a string containing only spaces has 0 words.

    // Approach 1: brute force - manual scan, tracking whether we're currently inside a word
    countWordsApproach1(str) {
        // TODO: implement
        let count = 0;
        let inWord = false;
        for(const ch of str){
            if(ch !== ' '){
                if(!inWord){
                    count++
                    inWord = true
                }
            }else{
                inWord = false;
            }
        }
        return count;
    }

    // Approach 2: optimized - trim, then split on runs of spaces
    countWordsApproach2(str) {
        // TODO: implement
        const trimmed = str.trim();
        if(trimmed === '') return 0;
        return trimmed.split(/ +/).length;
    }
}

module.exports = Solution
