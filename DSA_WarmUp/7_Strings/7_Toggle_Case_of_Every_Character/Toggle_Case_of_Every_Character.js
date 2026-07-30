class Solution {
    // Given a string str, return a new string with the case of every letter toggled
    // (uppercase becomes lowercase and vice versa). Non-letter characters (digits,
    // spaces, punctuation) are left unchanged. An empty string is returned unchanged.

    // Approach 1: brute force - manual loop, toggling case via character codes
    toggleCaseApproach1(str) {
        // TODO: implement
        let result = ''
        for(const ch of str){
            const code = ch.charCodeAt(0);
            if(code >= 65 && code <= 90){
                result += String.fromCharCode(code + 32);
            }else if (code >= 97 && code <= 122){
                result += String.fromCharCode( code - 32)
            } else {
                result += ch;
            }
        }
        return result;
    }

    // Approach 2: optimized - map each character, comparing it to its own uppercase form
    toggleCaseApproach2(str) {
        // TODO: implement
        return str  
            .split('')
            .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
            .join('');
    }
}

module.exports = Solution
