class Solution {
    // Given a number num and an upper bound upTo (defaults to 10), return an array
    // [num*1, num*2, ..., num*upTo] - the multiplication table of num.

    // Approach 1: direct multiplication in a loop
    multiplicationTableApproach1(num, upTo = 10) {
        // TODO: implement
        const result = [];
        for(let i = 1 ; i <= upTo; i++){
            result.push(num * i);
        }
        return result;
    }

    // Approach 2: repeated addition (no `*` operator at all)
    multiplicationTableApproach2(num, upTo = 10) {
        // TODO: implement
        const result = [];
        let running = 0;
        for(let i = 1 ; i <= upTo; i++){
            running += num;
            result.push(running);
        }
        return result;
    }
}

module.exports = Solution
