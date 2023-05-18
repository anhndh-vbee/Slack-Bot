const { readFileSync, getFilePathByFilename } = require('../utils/fileHandler');

const lateCheckIn = (req, res) => {
  const { filename } = req.params;
  const filePath = getFilePathByFilename(filename);
  const fileData = readFileSync(filePath);
  res.setHeader('Content-disposition', 'attachment; filename=example.xlsx');
  res.setHeader(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.status(200).send(fileData);
};
module.exports = {
  lateCheckIn,
};
