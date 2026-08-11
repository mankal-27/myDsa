var convertToTitle = function(columnNumber) {
    if (columnNumber === 0) {
        return "";
    }
    // Shift from 1-indexed to 0-indexed
    columnNumber--;
    // Recursively build the prefix, then append current character
    return convertToTitle(Math.floor(columnNumber / 26)) + String.fromCharCode(65 + columnNumber % 26);
};