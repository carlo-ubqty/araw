/**
 * Excel File Inspector
 * Quick utility to inspect Excel file structure
 */

import ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';

async function inspectExcel(filePath: string) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`INSPECTING: ${path.basename(filePath)}`);
  console.log('='.repeat(80));

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log(`\nTotal Sheets: ${workbook.worksheets.length}\n`);

  workbook.worksheets.forEach((sheet, index) => {
    console.log(`\n${'-'.repeat(80)}`);
    console.log(`Sheet ${index + 1}: "${sheet.name}"`);
    console.log('-'.repeat(80));

    // Get dimensions
    const rowCount = sheet.rowCount;
    const columnCount = sheet.columnCount;
    console.log(`Dimensions: ${rowCount} rows x ${columnCount} columns`);

    // Get headers (first row)
    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell, colNumber) => {
      headers.push(String(cell.value || `Column${colNumber}`));
    });

    console.log(`\nColumn Headers (${headers.length}):`);
    headers.forEach((header, idx) => {
      console.log(`  ${idx + 1}. ${header}`);
    });

    // Show sample data (first 3 data rows)
    console.log(`\nSample Data (first 3 rows):`);
    for (let rowNum = 2; rowNum <= Math.min(4, rowCount); rowNum++) {
      const row = sheet.getRow(rowNum);
      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        rowData[header] = cell.value;
      });
      console.log(`\n  Row ${rowNum}:`);
      Object.entries(rowData).forEach(([key, value]) => {
        const displayValue = String(value).substring(0, 50);
        console.log(`    ${key}: ${displayValue}${String(value).length > 50 ? '...' : ''}`);
      });
    }

    // Show data types in first data row
    if (rowCount > 1) {
      console.log(`\nData Types (from row 2):`);
      const dataRow = sheet.getRow(2);
      dataRow.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        const value = cell.value;
        let type: string = typeof value;
        
        if (value === null || value === undefined) {
          type = 'null/empty';
        } else if (value instanceof Date) {
          type = 'Date';
        } else if (typeof value === 'object' && (value as any).text) {
          type = 'RichText';
        } else if (typeof value === 'object' && (value as any).formula) {
          type = 'Formula';
        }
        
        console.log(`  ${header}: ${type}`);
      });
    }
  });

  console.log(`\n${'='.repeat(80)}\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npx ts-node scripts/inspect-excel.ts <path-to-excel-file>');
    console.error('   OR: npx ts-node scripts/inspect-excel.ts <directory-path>');
    process.exit(1);
  }

  const targetPath = args[0];
  const stat = fs.statSync(targetPath);

  if (stat.isDirectory()) {
    // Inspect all Excel files in directory
    const files = fs.readdirSync(targetPath)
      .filter((f: string) => f.endsWith('.xlsx') || f.endsWith('.xls'))
      .map((f: string) => path.join(targetPath, f));
    
    console.log(`\nFound ${files.length} Excel file(s) in directory\n`);
    
    for (const file of files) {
      await inspectExcel(file);
    }
  } else {
    // Inspect single file
    await inspectExcel(targetPath);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

