const ExcelJS = require('exceljs');
const stream = require('stream');
const { getDaysInMonth } = require('../utils/calculatorValidCheckIn');
const { convertObjectToArray } = require('../utils/convertObjectToArray');
const excelTimekeeping = (req, res, data) => {
  const dayOfWeekNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const dayInMonth = getDaysInMonth(
    parseInt(req.params.month) - 1,
    parseInt(req.params.year),
  );
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ChamCong');
  // Tạo header cho file Excel
  worksheet.mergeCells('A1:B2'); // Gộp hai ô đầu tiên
  worksheet.getCell('A1').value = `Tháng ${
    dayInMonth[0].getMonth() + 1
  }/${dayInMonth[0].getFullYear()}`; // Header cấp 1
  worksheet.mergeCells('C1:BF1');
  worksheet.getCell('C1').value = 'Ngày trong tháng'; // Header cấp 2
  worksheet.getCell('C1').style.alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  // header stt
  worksheet.mergeCells('A3:A4');
  worksheet.getCell('A3').value = 'STT';

  // header email
  worksheet.mergeCells('B3:B4');
  worksheet.getCell('B3').value = 'Email';
  worksheet.getColumn('B').width = 30;
  let i = 1;
  for (; i <= dayInMonth.length; i++) {
    const columnName1 = worksheet.getColumn(i * 2 + 1).letter; // Lấy tên cột bằng số thứ tự của cột
    const cellAddress1 = columnName1 + '2'; // Địa chỉ ô cần gán giá trị

    const columnName2 = worksheet.getColumn(i * 2 + 2).letter; // Lấy tên cột bằng số thứ tự của cột
    const cellAddress2 = columnName2 + '2'; // Địa chỉ ô cần gán giá trị

    worksheet.mergeCells(`${cellAddress1}:${cellAddress2}`); // Gộp hai ô
    worksheet.getCell(cellAddress1).value = `${dayInMonth[i - 1].getDate()}`; // Header cấp 3 - Ngày trong tháng
    worksheet.getCell(cellAddress1).alignment = { horizontal: 'center' }; // Căn giữa header

    // set day of week header column
    worksheet.mergeCells(`${columnName1 + '3'}:${columnName2 + '3'}`); // Gộp hai ô
    worksheet.getCell(`${columnName1 + '3'}`).value = `${
      dayOfWeekNames[dayInMonth[i - 1].getDay()]
    }`;
    worksheet.getCell(`${columnName1 + '3'}`).alignment = {
      horizontal: 'center',
    }; // Căn giữa header
    // set checkin checkout column
    worksheet.getCell(columnName1 + '4').value = 'check in';
    worksheet.getCell(columnName2 + '4').value = 'checkout';
  }
  i*=2;
  [
    'Tổng số buối lên công ty',
    'Số buối check in hợp lệ',
    'Tổng thời gian lên cty',
    'Sô buổi lên cty đúng theo lịch',
    'Tổng số buổi phải lên cty theo lịch',
  ].forEach((element) => {
    // total
    const columnName = worksheet.getColumn(++i).letter; // Lấy tên cột bằng số thứ tự của cột
    worksheet.mergeCells(`${columnName + '1'}:${columnName}` + '4'); // Gộp hai ô
    worksheet.getCell(columnName + '1').value = element; // Header cấp 3 - Ngày trong tháng
    worksheet.getColumn(columnName).width = 30;
  });

  // Add data rows
  data.forEach((item) => {
    const arrayItem = convertObjectToArray(item);
    worksheet.addRow(arrayItem);
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

module.exports = { excelTimekeeping };
