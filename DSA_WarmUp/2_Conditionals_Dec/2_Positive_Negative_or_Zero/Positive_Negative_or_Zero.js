class Solution {
    // Given a number num, return "Positive", "Negative", or "Zero".

    // Approach 1: direct comparison chain (if/else if)
    positiveNegativeOrZeroApproach1(num) {
        // TODO: implement
        if(num === 0) return "Zero"
        if(num < 0){
            return "Negative"
        }else{
            return "Positive"
        }
    }

    // Approach 2: Math.sign()
    positiveNegativeOrZeroApproach2(num) {
        // TODO: implement
        const sign = Math.sign(num)
        if(sign === 1) return "Positive"
        if(sign === -1 ) return "Negative"
        return "Zero"
    }
}

module.exports = Solution
