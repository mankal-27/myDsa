const MOD = 1000000007n; // Use BigInt for large mod operations

// Compute (base ^ exp) % mod using binary exponenation
function power(base, exp, mod){
    let result = 1n;
    base = base % mod;

    while(exp > 0n){
        if(exp & 1n){ //If current bit is 1
            result = (result * base) % mod;
        }
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}

// Computes modular inverse of a under mod (mod must be prime)
function modInverse(a, mod){
    return power(a, mod-2n, mod);
}

// Safe modular substraction
function modSubstract(a,b,mod){
    return ((a % mod) - (b % mod) + mod) % mod;
}

module.exports = { MOD, power, modInverse, modSubstract };