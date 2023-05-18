const ExcelJS = require('exceljs');
const stream = require('stream');
const { convertedScheduleCode } = require('../utils/convertSchedule');
const schedule = require('../config/schedule');
const publicDirecPath = require('../config/publicDirecPath');
const fs = require('fs');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const createHeaderRow = (worksheet) => {
  // add header row
  let headerRow = [
    { header: 'Id', key: 'id' },
    { header: 'Email', key: 'email', width: 30 },
  ];
  schedule.forEach((scheduleElement) => {
    const code = scheduleElement.code;
    headerRow.push({ header: code, key: code });
  });

  worksheet.columns = headerRow;
};

const addDataRows = (worksheet, data) => {
  data.forEach((item) => {
    item.schedules.forEach((element) => {
      const time = convertedScheduleCode(element);
      item[time] = '*';
    });
    worksheet.addRow(item);
  });
};

// Apply styles to sheet
const styleSheet = (row, rowNumber) => {
  row.eachCell((cell, colIndex) => {
    if (rowNumber == 1) {
      // Header CSS
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '2563EB' },
      };
    } else {
      // Schedule CSS
      if (colIndex >= 3) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFD700' },
        };
      } else {
        // Id and Email CSS
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC0CB' },
        };
      }
    }

    // Alignment CSS for all cells
    cell.style.alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };

    // Border CSS for all rows
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  row.commit();
};

const scheduleExcelResponse = async (req, res, data) => {
  // initialize excel file
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Schedule');

  createHeaderRow(worksheet);
  addDataRows(worksheet, data);
  worksheet.eachRow(styleSheet);

  // // Stream Excel file to client
  // const streamBuffer = new stream.PassThrough();
  // workbook.xlsx.write(streamBuffer).then(() => {
  //   res.setHeader(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );
  //   res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
  //   streamBuffer.pipe(res);
  // });

  // tạo file
  // Lấy thời gian hiện tại để làm phần của tên file
  const timestamp = Date.now();
  // Tạo số ngẫu nhiên để khỏi bị trùng tên file
  const randomNumber = Math.floor(Math.random() * 1000);
  // Ghép các giá trị lại với nhau để tạo tên file
  const fileName = `${timestamp}-${randomNumber}.xlsx`;
  const filePath = publicDirecPath + '/' + fileName;
  try {
    await workbook.xlsx.writeFile(filePath);
    const downloadUrl = `${req.protocol}://${req.get(
      'host',
    )}/download/${fileName}`;
    // sau 5 phút sẽ xóa file
    setTimeout(() => {
      fs.unlink(filePath, (error) => {
        console.log(error);
      });
    }, 5 * 1000);
    return { downloadUrl, message: 'url sau 5 phút sẽ hết hạn' };
  } catch (error) {
    throw new CustomError(errorCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { scheduleExcelResponse };
