const handlerSlackTextMiddleware = (req, res, next) => {
  const { text } = req.body;
  // xử lý text thành object body key value
  let reqBody = text.split(' ');
  reqBody.forEach(e => {
    const [ key, value ] = e.split('=');
    req.body[key] = value;
  })
  return next();
};

module.exports = handlerSlackTextMiddleware;
