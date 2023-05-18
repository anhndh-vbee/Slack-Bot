const fs = require('fs');
const publicDirecPath = require('../config/publicDirecPath');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const randomFilename = () => {
  // Lấy thời gian hiện tại để làm phần của tên file
  const timestamp = Date.now();
  // Tạo số ngẫu nhiên để khỏi bị trùng tên file
  const randomNumber = Math.floor(Math.random() * 1000);
  // Ghép các giá trị lại với nhau để tạo tên file
  const fileName = `${timestamp}-${randomNumber}.xlsx`;
  const filePath = getFilePathByFilename(fileName);
  return { fileName, filePath };
};

const deleteFile = ({ filePath }) => {
  fs.unlink(filePath, () => {});
};

const getFilePathByFilename = (filename) => {
  return publicDirecPath + '/' + filename;
};

const readFileSync = (filePath) => {
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
};
module.exports = {
  randomFilename,
  deleteFile,
  getFilePathByFilename,
  readFileSync,
};
