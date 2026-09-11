/**
 * Returns arr[-1]; with checks
 * 
 * @param {Array<T>} arr - Array
 * @returns {T | undefined} Last item in the array
 */
function last(arr) {
    if(!arr || arr.length == 0) return undefined;
    return arr[arr.length - 1];
}

/**
 * Returns arr[0]; with checks
 * 
 * @param {Array<T>} arr - Array
 * @returns {T | undefined} First item in the array
 */
function first(arr) {
    if(!arr || arr.length == 0) return undefined;
    return arr[0];
}