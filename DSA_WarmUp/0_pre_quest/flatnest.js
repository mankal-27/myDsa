function flatten(arr){
    return arr.reduce(flat, item) 
        flat.concat(Array.isArray(item) ? flatten(item) : item), []
    
}
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return Array.isArray(obj)
    ? obj.map(deepClone)
    : Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepClone(v)]));
}
