class Solution {
    // Given a single alphabetic character ch (upper or lower case), return "Vowel" if
    // it's a vowel (a, e, i, o, u), or "Consonant" otherwise.

    // Approach 1: explicit comparison chain against every vowel, both cases
    vowelOrConsonantApproach1(ch) {
        // TODO: implement
        if(
            ch === "a" || ch === "e" || ch === "i" || ch === "o" || ch === "u" ||
            ch === "A" || ch === "E" || ch === "I" || ch === "O" || ch === "U"
        ){
            return "Vowel";
        }else{
            return "Consonant";
        }
    }

    // Approach 2: normalize case, then check membership in a Set
    vowelOrConsonantApproach2(ch) {
        // TODO: implement
        const VOWELS = new Set(["a", "e", "i", "o", "u"])
        return VOWELS.has(ch.toLowerCase()) ? "Vowel" : "Consonant"
    }
}

module.exports = Solution
