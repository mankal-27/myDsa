class Solution {
    // Given a string str and a replacement string replacement, return a new string with
    // every space character in str replaced by replacement. (An empty string, or a string
    // with no spaces, is returned unchanged.)

    // Approach 1: brute force - manual loop, building the result character by character
    replaceSpacesApproach1(str, replacement) {
        // TODO: implement
        let result = ''
        for(const ch of str){
            if(ch === ' '){
                result += replacement
            }else{
                result += ch;
            }
        }
        return result;
    }

    // Approach 2: optimized - split on spaces, then join with the replacement
    replaceSpacesApproach2(str, replacement) {
        // TODO: implement
        return str.split(' ').join(replacement);
    }
}

module.exports = Solution
