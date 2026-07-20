class Solution {
    // Given a non-negative integer totalSeconds, convert it into hours, minutes, and seconds.
    // Return the result as [hours, minutes, seconds].
    convertSecondsBruteForce(totalSeconds) {
        let hours = 0, minutes = 0, seconds = 0;
        for(let i = 0 ; i < totalSeconds; i++){
            seconds++
            if(seconds === 60) { seconds = 0; minutes++}
            if(minutes === 60) { minutes = 0; hours++}
        }
        return[hours, minutes, seconds]
    }

    convertSecondsOptimized(totalSeconds){
        let hours = Math.floor(totalSeconds/3600)
        let minutes = Math.floor((totalSeconds % 3600)/ 60)
        let seconds = totalSeconds % 60
        return [hours, minutes, seconds]
    }
}

module.exports = Solution
