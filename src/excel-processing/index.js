const ExcelJS = require('exceljs');
const stream = require('stream');

const excelProcessing = (req, res, nestedJson) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  // Add header row
  const convertObject = {
    sunday: {
      full: '2F',
      morning: '2S',
      afternoon: '2C',
    },
    monday: {
      full: '3F',
      morning: '3S',
      afternoon: '3C',
    },
    tuesday: {
      full: '4F',
      morning: '4S',
      afternoon: '4C',
    },
    wednesday: {
      full: '5F',
      morning: '5S',
      afternoon: '5C',
    },
    thursday: {
      full: '6F',
      morning: '6S',
      afternoon: '6C',
    },
    friday: {
      full: '7F',
      morning: '7S',
      afternoon: '7C',
    },
    saturday: {
      full: '8F',
      morning: '8S',
      afternoon: '8C',
    },
  };
  worksheet.columns = [
    { header: 'Id', key: 'id' },
    { header: 'Email', key: 'email', width: 30 },
    { header: '2S', key: '2S' },
    { header: '2C', key: '2C' },
    { header: '2F', key: '2F' },
    { header: '3S', key: '3S' },
    { header: '3C', key: '3C' },
    { header: '3F', key: '3F' },
    { header: '4S', key: '4S' },
    { header: '4C', key: '4C' },
    { header: '4F', key: '4F' },
    { header: '5S', key: '5S' },
    { header: '5C', key: '5C' },
    { header: '5F', key: '5F' },
    { header: '6S', key: '6S' },
    { header: '6C', key: '6C' },
    { header: '6F', key: '6F' },
    { header: '7S', key: '7S' },
    { header: '7C', key: '7C' },
    { header: '7F', key: '7F' },
    { header: '8S', key: '8S' },
    { header: '8C', key: '8C' },
    { header: '8F', key: '8F' },
  ];

  // Add data rows
  nestedJson.users.data.forEach((item) => {
    item.schedules.forEach((element) => {
      const time = convertObject[element.day][element.time];
      item[time] = '*';
    });
    worksheet.addRow(item);
  });
  // style sheet
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colIndex) => {
      if (rowNumber == 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '2563EB' },
        };
      } else {
        if (colIndex >= 3) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD700' },
          };
        } else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC0CB' },
          };
        }
      }
      cell.style.alignment = {
        horizontal: 'center',
        vertical: 'middle',
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    row.commit();
  });
  // Stream Excel file to client
  const streamBuffer = new stream.PassThrough();
  workbook.xlsx.write(streamBuffer).then(() => {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    streamBuffer.pipe(res);
  });
};

module.exports = { excelProcessing };
