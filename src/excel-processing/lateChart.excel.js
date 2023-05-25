const ExcelJS = require('exceljs');
const { createFIleExcel } = require('./createFIle.excel');

const createHeaderRow = (worksheet, data) => {
  worksheet.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleDark3',
      showRowStripes: true,
    },
    columns: [
      {
        name: 'Time',
        totalsRowLabel: 'Totals:',
        filterButton: true,
      },
      {
        name: 'Count late',
        totalsRowFunction: 'sum',
        filterButton: false,
      },
    ],
    rows: data,
  });
};

const lateChartResponse = async (req, res, data) => {
  // initialize excel file
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Schedule');

  createHeaderRow(worksheet, data);
  
  // tạo file
  return await createFIleExcel(req, workbook);
};

module.exports = { lateChartResponse };
