const convertObjectToArray = (obj) => {
    const result = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        result.push(...convertObjectToArray(obj[key]));
      } else {
        result.push(obj[key]);
      }
    }
    return result;
};

module.exports = { convertObjectToArray };
