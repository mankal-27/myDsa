class Solution{
    tempConverter(temp, scale){
        let result;
        if(scale === "C"){
            result = (((temp * 9)/5)+32)
        }
        else{
            result = (temp - 32) * 5 / 9;
        }
        return Math.round(result * 100) / 100;
    }
}

module.exports = Solution
