class Solution {
    // Given a string str, return an object { vowels, consonants } counting how many
    // alphabetic characters are vowels (a, e, i, o, u, case-insensitive) and how many
    // are consonants. Non-alphabetic characters (digits, spaces, punctuation) are
    // ignored entirely - they count toward neither. An empty string gives
    // { vowels: 0, consonants: 0 }.

    // Approach 1: brute force - manual letter check, then an explicit vowel comparison chain
    countVowelsAndConsonantsApproach1(str) {
        // TODO: implement
        let vowels = 0;
        let consonants = 0;
        let letters = ['a', 'e', 'i', 'o', 'u']
        for(const ch of str){
            const lower = ch.toLowerCase();
            const isLetter = lower >= 'a' && lower <= 'z';
            if(!isLetter) continue;
            if(letters.includes(lower)){
                vowels++
            }else{
                consonants++
            }
        }
        return { vowels, consonants}
    }

    // Approach 2: optimized - lowercase the string, then use a Set for the vowel check
    countVowelsAndConsonantsApproach2(str) {
        // TODO: implement
        const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])
        let vowels = 0;
        let consonants = 0;
        for(const ch of str.toLowerCase()){
            if(ch < 'a' || ch > 'z') continue;
            if(VOWELS.has(ch)){
                vowels++
            }else{
                consonants++
            }
        }
        return { vowels, consonants};
    }
}

module.exports = Solution
