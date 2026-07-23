class Solution {
    // Given a positive integer n, return an array of n strings, where row i (1-indexed)
    // contains i '*' characters — forming a right-angled triangle of stars, n rows tall.

    // Approach 1: nested loops - inner loop builds each row one character at a time
    rightAngledTriangleApproach1(n) {
        // TODO: implement
        const rows = []
        for(let i = 1 ; i <= n ; i++){
            let row = "";
            for(let j = 1 ; j <= i ; j++){
                row += "*"
            }
            rows.push(row);
        }
        return rows
    }

    // Approach 2: optimized - single loop per row using String.prototype.repeat
    rightAngledTriangleApproach2(n) {
        // TODO: implement
        const rows = []
        for(let i = 1; i <=n ; i++){
            rows.push("*".repeat(i));
        }
        return rows;
    }
}

module.exports = Solution
