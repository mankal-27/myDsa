// Trial Division for isprime

function isPrime(n){
    if(n <= 1) return false;
    if(n <= 3) return true;
    if(n % 2 === 0 || n % 3 === 0) return false;
    for(let i = 5 ; i*i <= n ; i += 6){
        if(n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

// Eratisthenes - given an integer n, return the number of primes strictly less than n

function countPrimes(n){
    if(n <= 2) return 0;
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;

    for(let p = 2; p * p < n ; p++){
        if(isPrime[p]){
            for(let j = p * p; j < n ; j += p){
                isPrime[j] = false;
            }
        }
    }
    return isPrime.filter(Boolean).length;
}

// Prime factorization using spf sieve

function buildSPF(n){
    const spf = Array.from({ length: n + 1}, (_, i) => i);

    for(let p = 2 ; p * p <= n ; p++){
        if(spf[p] === p){
            for(let j = p * p ; j <=n; j += p){
                if(spf[j] === j){
                    spf[j] = p;
                }
            }
        }
    }
    return spf;
}

function factorize(x, spf){
    const factors = [];
    while( x > 1){
        factors.push(spf[x]);
        x = Math.floor(x / spf[x]);
    }
    return factors;
}

module.exports = { isPrime, countPrimes, buildSPF, factorize };
