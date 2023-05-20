const CustomError = require("../errors/CustomError");
const { randomFilename, deleteFile } = require("../utils/fileHandler");
const errorCodes = require('../errors/code');
const config = require("../config/config");

const createFIleExcel = async (req ,workbook) => {
  // tạo file
  const { fileName, filePath } = randomFilename();
  try {
    await workbook.xlsx.writeFile(filePath);
    const downloadUrl = `${req.protocol}://${req.get(
      'host',
    )}/download/${fileName}`;
    // sau 5 phút sẽ xóa file
    setTimeout(() => {
      deleteFile({filePath});
    }, config.URL_EXPRIDE_TIME);
    return { downloadUrl, message: 'url sau 5 phút sẽ hết hạn' };
  } catch (error) {
    throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { createFIleExcel };
