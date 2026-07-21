class Solution {
    // Given an integer marks between 0 and 100, return the corresponding letter grade:
    // 90-100 -> "A", 80-89 -> "B", 70-79 -> "C", 60-69 -> "D", below 60 -> "F".

    // Approach 1: chained conditionals (if/else if)
    gradeFromMarksApproach1(marks) {
        if(marks >= 90){
            return "A"
        }else if(marks >= 80){
            return "B"
        }else if(marks >= 70){
            return "C"
        }else if(marks >= 60){
            return "D"
        }else{
            return "F"
        }
    }

    // Approach 2: bucket index + lookup array
    gradeFromMarksApproach2(marks) {
        const bands = ["F", "F", "F", "F", "F", "F", "D", "C", "B", "A", "A"]
        const index = Math.floor(marks / 10)
        return bands[index]
    }
}

module.exports = Solution
