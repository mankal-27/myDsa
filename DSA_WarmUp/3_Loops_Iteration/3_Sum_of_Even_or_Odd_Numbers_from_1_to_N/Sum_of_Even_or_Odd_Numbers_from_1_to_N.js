class Solution {
    // Given a non-negative integer n and a type ("even" or "odd"), return the sum of
    // all numbers of that type from 1 to n (inclusive).

    // Approach 1: brute force - loop through 1..n, check parity, accumulate
    sumEvenOrOddApproach1(n, type) {
        let arrayListEven = [], arrayListOdd = [];
        for(let i = 1; i <=n ; i++){
               if(i % 2 === 0){
                arrayListEven.push(i)
               }else{
                arrayListOdd.push(i)
               }
        }
        if(type === "even"){
            return arrayListEven.reduce((acc, curr) => acc + curr , 0)
        }else if (type === "odd"){
            return arrayListOdd.reduce((acc, curr) => acc + curr, 0)
        }
    }

    // Approach 2: optimized - closed-form arithmetic series formula
    sumEvenOrOddApproach2(n, type) {
        // TODO: implement
        if(type === "even"){
            const k = Math.floor(n/2);
            return k * (k + 1);
        }else{
            const m = Math.ceil(n/2);
            return m * m;
        }
    }

    // Bonus: same brute-force loop as Approach 1, but using the bitwise parity check
    // (i & 1) from the Even or Odd problem instead of the modulo operator - a direct
    // reminder that % and & are interchangeable ways to answer "is this even or odd?"
    sumEvenOrOddBonusBitwise(n, type) {
        let sum = 0;
        for (let i = 1; i <= n; i++) {
            if (type === "even" && (i & 1) === 0) {
                sum += i;
            } else if (type === "odd" && (i & 1) === 1) {
                sum += i;
            }
        }
        return sum;
    }
}

module.exports = Solution
