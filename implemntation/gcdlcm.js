// Iterative GCD

function gcd(a, b){
    a = Math.abs(a);
    b = Math.abs(b);
    while( b !== 0){
        [a,b] = [b, a % b];
    }
    return a;
}

// Recursive GCD
function gcdRecursive(a,b){
    a = Math.abs(a);
    b = Math.abs(b);
    if(b === 0) return a;
    return gcdRecursive(b, a % b);
}

// LCM via GCD ( divide first to avoid precioson issues with large numbers)

function lcm(a , b){
    if(a === 0 || b === 0) return 0;
    a = Math.abs(a);
    b = Math.abs(b);
    return ( a / gcd(a, b)) * b;
}

// Extended GCD : returns { gcd, x, y }
function extendedGcd(a, b){
    if(b === 0){
        return { gcd: a, x: 1, y: 0};
    }
    const result = extendedGcd(b, a % b);
    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x - Math.floor(a / b) * result.y
    };
}

// GCD of an array
function gcdArray(nums){
    return nums.reduce((acc, val) => gcd(acc, val));
}

module.exports = { gcd, gcdRecursive, lcm, extendedGcd, gcdArray };