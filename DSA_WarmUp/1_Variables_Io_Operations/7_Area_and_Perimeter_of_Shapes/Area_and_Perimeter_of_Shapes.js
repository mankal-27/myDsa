const PI = 3.14159;

class Solution {
    // Given shape (one of "rectangle", "square", "circle", "triangle") and dims (an array
    // of the numbers describing it), return [area, perimeter], each rounded to 2 decimal places.

    sqrt(x, precision = 1e-10){
        if(x === 0) return 0
        let guess = x
        while (Math.abs(guess * guess - x) > precision) {
             guess = (guess + x / guess) / 2;
        }
        return guess;
    }
    // Approach 1: if/else dispatch + a hand-rolled square root (Newton's method) for the triangle case
    areaAndPerimeterBruteForce(shape, dims) {
        // TODO: implement
        let area = 0, perimeter = 0;
        const round2 = (n) => Math.round(n * 100) / 100;
        if(shape === "rectangle"){
            const length = dims[0], width = dims[1]
            area = length * width
            perimeter = 2 * (length + width)
        }else if(shape === "square"){
            const side = dims[0]
            area = side * side
            perimeter = 4 * side
        }else if(shape === "circle"){
            const r = dims[0]
            area = PI * r * r
            perimeter = 2 * PI * r;
        }else if( shape === "triangle"){
            const a = dims[0], b = dims[1], c = dims[2];
            perimeter = a + b + c;
            const s = perimeter / 2.0;
            area = this.sqrt(s * (s-a) * (s-b) * (s-c));
        }
        return[round2(area), round2(perimeter)]

    }

    // Approach 2: dispatch table (object map) + Math.sqrt
    areaAndPerimeterOptimized(shape, dims) {
        // TODO: implement
        const round2 = (n) => Math.round(n * 100) / 100;
        const shapes = {
            rectangle: ([length, width]) => [length*width, 2*(length+width)],
            square:([side])=> [side*side, 4 * side],
            circle:([radius]) => [PI*radius*radius, 2 * PI * radius],
            triangle:([a,b,c])=>{
                const s = (a+b+c)/2
                return [Math.sqrt(s*(s-a)*(s-b)*(s-c)), a+b+c]
            }
        }
        const[area, perimeter] = shapes[shape](dims)
        return[round2(area), round2(perimeter)]
    }

}

module.exports = Solution
