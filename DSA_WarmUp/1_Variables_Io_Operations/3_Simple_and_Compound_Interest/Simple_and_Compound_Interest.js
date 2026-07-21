class Solution {
    // ---------- Simple Interest ----------

    // Brute force: simulate year-by-year, adding the same flat amount each time.
    // Only meaningful for whole-number `time` (can't loop 2.5 times).
    // Time: O(T)  Space: O(1)
    simpleInterestBruteForce(principal, rate, time) {
        let totalInterest = 0;
        for (let year = 1; year <= time; year++) {
            totalInterest += (principal * rate) / 100;
        }
        return Math.round(totalInterest * 100) / 100;
    }

    // Optimized: SI grows linearly with time, so it's just one multiplication - no loop needed.
    // SI = (P * R * T) / 100
    // Time: O(1)  Space: O(1)
    simpleInterest(principal, rate, time) {
        const si = (principal * rate * time) / 100;
        return Math.round(si * 100) / 100;
    }

    // ---------- Compound Interest ----------

    // Brute force: simulate period-by-period, re-applying interest to the growing amount.
    // This is literally how compounding works in real life - one loop iteration per period.
    // Time: O(n * T) where n = compoundsPerYear  Space: O(1)
    compoundInterestBruteForce(principal, rate, time, compoundsPerYear = 1) {
        let amount = principal;
        const ratePerPeriod = (rate / compoundsPerYear) / 100;
        const numPeriods = compoundsPerYear * time;
        for (let i = 0; i < numPeriods; i++) {
            amount += amount * ratePerPeriod;
        }
        return Math.round((amount - principal) * 100) / 100;
    }

    // Optimized: repeated multiplication by the same factor is exponentiation -
    // collapse the whole loop into one Math.pow call.
    // A = P * (1 + (R / n) / 100) ^ (n * T)
    // CI = A - P
    // Time: O(1) (Math.pow on fixed-size numeric input)  Space: O(1)
    compoundInterest(principal, rate, time, compoundsPerYear = 1) {
        const ratePerPeriod = (rate / compoundsPerYear) / 100;
        const numPeriods = compoundsPerYear * time;
        const amount = principal * Math.pow(1 + ratePerPeriod, numPeriods);
        const ci = amount - principal;
        return Math.round(ci * 100) / 100;
    }

    // Bonus: manual fast exponentiation (binary exponentiation), in case Math.pow
    // is off the table. Same idea used for modular exponentiation / matrix power.
    // Time: O(log(n * T))  Space: O(log(n * T)) call stack (recursive)
    compoundInterestFastPower(principal, rate, time, compoundsPerYear = 1) {
        const ratePerPeriod = (rate / compoundsPerYear) / 100;
        const numPeriods = compoundsPerYear * time;

        const fastPow = (base, exp) => {
            if (exp === 0) return 1;
            const half = fastPow(base, Math.floor(exp / 2));
            const halfSquared = half * half;
            return exp % 2 === 0 ? halfSquared : halfSquared * base;
        };

        const amount = principal * fastPow(1 + ratePerPeriod, numPeriods);
        return Math.round((amount - principal) * 100) / 100;
    }

    // Convenience: compute both results together for the same inputs.
    solve(principal, rate, time, compoundsPerYear = 1) {
        return {
            simpleInterest: this.simpleInterest(principal, rate, time),
            compoundInterest: this.compoundInterest(principal, rate, time, compoundsPerYear),
        };
    }
}

module.exports = Solution
