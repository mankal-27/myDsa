class Solution {
    // Given three points (x1,y1), (x2,y2), (x3,y3), return true if they lie on the
    // same straight line, or false otherwise.

    // Approach 1: compare slopes (watch out for vertical lines / division by zero)
    areCollinearApproach1(x1, y1, x2, y2, x3, y3) {
        // If any two of the three points coincide exactly, they're trivially collinear
        // (there's no well-defined "slope" to compare against - and the points are
        // allowed to repeat per this problem's constraints).
        if ((x1 === x2 && y1 === y2) || (x2 === x3 && y2 === y3) || (x1 === x3 && y1 === y3)) {
            return true;
        }
        if (x1 === x2) {
            // P1-P2 is a vertical line; collinear only if P3 shares the same x
            return x2 === x3;
        }
        const slope1 = (y2 - y1) / (x2 - x1);

        if (x2 === x3) {
            // P2-P3 would be vertical but P1-P2 wasn't - can't match, not collinear
            return false;
        }
        const slope2 = (y3 - y2) / (x3 - x2);

        return slope1 === slope2;
    }

    // Approach 2: cross product / area method (no division at all)
    areCollinearApproach2(x1, y1, x2, y2, x3, y3) {
        const crossProduct = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
        return crossProduct === 0;
    }
}

module.exports = Solution
