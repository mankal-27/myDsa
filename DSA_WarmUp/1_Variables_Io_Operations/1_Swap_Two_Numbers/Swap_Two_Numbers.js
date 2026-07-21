class Solution{
    swapTwoNumWithTemp(a,b){
        [a,b] = [b,a]
        return [a,b]
    }

    swapTwoNumWithSum(a,b){
        a = a + b
        b = a - b
        a = a - b
        return [a,b]
    }

    swapTwoNumWithXor(a,b){
        a = a ^ b
        b = a ^ b
        a = a ^ b
        return [a, b]
    }

    swap(a,b){
        const temp = a
        a = b
        b = temp
        return [a, b]
    }
}

module.exports = Solution
