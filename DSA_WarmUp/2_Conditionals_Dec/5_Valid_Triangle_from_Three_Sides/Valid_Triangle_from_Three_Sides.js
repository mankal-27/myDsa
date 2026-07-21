class Solution {
    // Given three positive numbers a, b, c (the side lengths), return true if they can
    // form a valid triangle, or false otherwise.

    // Approach 1: check all three triangle-inequality conditions directly
    isValidTriangleApproach1(a, b, c) {
        // TODO: implement
        return (a+b > c && b + c > a && c + a > b)
    }

    // Approach 2: sort the sides, then check only the two smallest against the largest
    isValidTriangleApproach2(a, b, c) {
        // TODO: implement
        const side = [a,b,c].sort((x,y)=> x-y)
        const [smallest, middle, largest] = side
        return (smallest + middle) > largest
    }
}

module.exports = Solution
