class Solution {
    // Given two integers dividend and divisor (divisor != 0), return [quotient, remainder]
    // using truncating division (quotient rounds toward zero, remainder takes the sign
    // of the dividend) - the same convention JS's native `/` + Math.trunc and `%` use.

    // Approach 1: repeated subtraction
    divideBruteForce(dividend, divisor) {
        const negative = (dividend < 0) !== (divisor < 0);
        let remaining = Math.abs(dividend);
        const divisorAbs = Math.abs(divisor);

        let quotient = 0;
        while (remaining >= divisorAbs) {
            remaining -= divisorAbs;
            quotient++;
        }

        quotient = negative ? -quotient : quotient;
        const remainder = dividend < 0 ? -remaining : remaining;
        return [quotient, remainder];
    }

    // Approach 2: native division/modulo operators
    divideOptimized(dividend, divisor) {
        const quotient = Math.trunc(dividend/divisor)
        const remainder = dividend % divisor
        return [quotient, remainder]
    }
}

module.exports = Solution
