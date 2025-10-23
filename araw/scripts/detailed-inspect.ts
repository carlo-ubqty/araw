import ExcelJS from 'exceljs';

async function inspectSheet(filePath: string, sheetName: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`SHEET: ${sheetName}`);
  console.log(`FILE: ${filePath.split('/').pop()}`);
  console.log('='.repeat(80));
  
  // Show first 20 rows with ALL columns
  console.log('\nFirst 20 rows (all columns):\n');
  for (let rowNum = 1; rowNum <= Math.min(20, sheet.rowCount); rowNum++) {
    const row = sheet.getRow(rowNum);
    console.log(`Row ${rowNum}:`);
    
    const values: any[] = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      values[colNumber - 1] = cell.value;
    });
    
    values.forEach((val, idx) => {
      if (val !== null && val !== undefined) {
        const displayVal = String(val).substring(0, 60);
        console.log(`  Col ${idx + 1}: ${displayVal}${String(val).length > 60 ? '...' : ''}`);
      }
    });
    console.log();
  }
}

const file1 = 'data/Araw National CCET PAPs Figures 2017 - GAA FY2025.xlsx';
const file2 = 'data/Araw Available Datasets (10.16.2025).xlsx';

(async () => {
  // Inspect key sheets from both files
  await inspectSheet(file1, '2025 (GAA)');
  await inspectSheet(file1, 'Data Summary');
  await inspectSheet(file2, '2019-2023 (Actual)');
  await inspectSheet(file2, 'GHG Table');
})();
