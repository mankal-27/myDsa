// Floor of Log base 2 (for n >= 1)

function floorLog2(n){
    if(n <= 0) throw new Error("n must be positive")
    let result = 0;
    while( n > 1 ){
        n >>= 1;
        result++
    }
    return result;
}

// Number of decimal digits in n ( for n >= 1)

function countDigits(n){
    if(n <= 0) throw new Error("n must be positive");
    let count = 0;
    while(n > 0){
        n = Math.floor(n / 10);
        count++
    }
    return count;
}

// Number of bits needed to represent n ( for n >= 1)

function countBits(n){
    if(n <= 0) throw new Error("n must be positive");
    return floorLog2(n) + 1;
}


if (require.main === module) {
    console.log(`Floorlog2(16) = ${floorLog2(16)}`);
    console.log(`floorLog2(100) = ${floorLog2(100)}`);     // 6
    console.log(`countDigits(5000) = ${countDigits(5000)}`); // 4
    console.log(`countBits(13) = ${countBits(13)}`);       // 4
    console.log(`countBits(16) = ${countBits(16)}`);
}

module.exports = { floorLog2, countDigits, countBits };