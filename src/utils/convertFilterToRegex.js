module.exports = (filter) => {
    const regex = {};
    for (const key in filter) {
        const value = filter[key];
        if (typeof value === 'string') {
            regex[key] = new RegExp(value, 'i');
        } else if (typeof value === 'object') {
            regex[key] = convertFilterToRegex(value);
        } else {
            regex[key] = value;
        }
    }
    return regex;
}
