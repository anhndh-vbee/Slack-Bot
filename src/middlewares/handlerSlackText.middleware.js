const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const handlerSlackTextMiddleware = (req, res, next) => {
  const { text } = req.body;
  // xử lý text thành object body key value
  let reqBody = text.split(' ');
  reqBody.forEach((e) => {
    const [key, value] = e.split('=');

    // if is array
    if (key.endsWith('[]')) {
      const newKey = key.replace('[]', '');
      const keyArray = req.body[newKey];
      if (keyArray) {
        keyArray.push(value);
      } else {
        req.body[newKey] = [value];
      }
    } else if (key.endsWith('[') || key.endsWith(']')) {
      throw new CustomError(errorCodes.BAD_REQUEST);
    } else {
      req.body[key] = value;
    }
  });
  return next();
};

module.exports = handlerSlackTextMiddleware;
