/**
 * ARAW Climate Finance Data Parser
 * Handles complex CCET PAPs Excel files with merged cells and irregular structures
 */

import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

interface ParsedProject {
  departmentId: string;
  departmentName: string;
  agencyId: string;
  agencyName: string;
  papId: string;
  papName: string;
  typologyCode: string;
  typologyDescription: string;
  fiscalYear: number;
  dataType: 'GAA' | 'Actual' | 'NEP';
  mooe: number;
  capitalOutlay: number;
  totalAmount: number;
  adaptationAmount: number;
  mitigationAmount: number;
  status?: string;
}

/**
 * Extract cell value (handles formulas and rich text)
 */
function getCellValue(cell: ExcelJS.Cell): any {
  const value = cell.value;
  
  if (value === null || value === undefined) {
    return null;
  }
  
  // Handle formula cells - get the result
  if (typeof value === 'object' && 'result' in value) {
    return (value as any).result;
  }
  
  // Handle rich text
  if (typeof value === 'object' && 'richText' in value) {
    return (value as any).richText.map((t: any) => t.text).join('');
  }
  
  return value;
}

/**
 * Detect data start row by finding column headers
 */
function findHeaderRow(sheet: ExcelJS.Worksheet): number {
  for (let rowNum = 1; rowNum <= 20; rowNum++) {
    const row = sheet.getRow(rowNum);
    const firstCell = getCellValue(row.getCell(1));
    
    if (firstCell && (
      String(firstCell).includes('DEPARTMENT') ||
      String(firstCell).includes('UACS') ||
      String(firstCell).includes('Department')
    )) {
      return rowNum;
    }
  }
  return 7; // Default fallback
}

/**
 * Parse CCET PAPs sheet (2017-2025 style)
 */
async function parseCCETSheet(
  filePath: string,
  sheetName: string,
  fiscalYear: number,
  dataType: 'GAA' | 'Actual' | 'NEP'
): Promise<ParsedProject[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return [];
  }

  const projects: ParsedProject[] = [];
  const headerRow = findHeaderRow(sheet);
  const dataStartRow = headerRow + 1;
  
  console.log(`  Parsing ${sheetName}: Header at row ${headerRow}, data starts row ${dataStartRow}`);
  
  // Check for "thousand pesos" indicator
  let isInThousands = false;
  for (let r = 1; r < dataStartRow; r++) {
    const text = String(getCellValue(sheet.getRow(r).getCell(1)) || '').toLowerCase();
    if (text.includes('thousand pesos')) {
      isInThousands = true;
      break;
    }
  }
  
  const multiplier = isInThousands ? 1000 : 1;
  console.log(`  Values multiplier: ${multiplier}x`);
  
  // Parse data rows
  let validRows = 0;
  let skippedRows = 0;
  
  for (let rowNum = dataStartRow; rowNum <= sheet.rowCount; rowNum++) {
    const row = sheet.getRow(rowNum);
    
    // Get values
    const deptId = getCellValue(row.getCell(1));
    const deptName = getCellValue(row.getCell(2));
    const agyId = getCellValue(row.getCell(3));
    const agyName = getCellValue(row.getCell(4));
    const papId = getCellValue(row.getCell(5));
    const papName = getCellValue(row.getCell(6));
    const ccCode = getCellValue(row.getCell(7));
    const ccDesc = getCellValue(row.getCell(8));
    
    // Skip if missing critical data
    if (!deptId || !papId || !papName) {
      skippedRows++;
      continue;
    }
    
    // Skip subtotal rows
    const papNameStr = String(papName).toLowerCase();
    if (papNameStr.includes('total') || 
        papNameStr.includes('sub-total') ||
        papNameStr.includes('grand total')) {
      skippedRows++;
      continue;
    }
    
    // Extract financial data (columns vary by sheet structure)
    let mooe = 0;
    let co = 0;
    let adaptation = 0;
    let mitigation = 0;
    
    // Try different column positions for amounts
    // Column 9-11: MOOE, Column 12-14: CO
    const mooeVal = getCellValue(row.getCell(11)) || getCellValue(row.getCell(9));
    const coVal = getCellValue(row.getCell(14)) || getCellValue(row.getCell(12));
    
    if (typeof mooeVal === 'number') mooe = mooeVal * multiplier;
    if (typeof coVal === 'number') co = coVal * multiplier;
    
    // Try to get adaptation/mitigation breakdown (columns 22-27 or 28-30)
    const adaptVal = getCellValue(row.getCell(28)) || getCellValue(row.getCell(24));
    const mitigVal = getCellValue(row.getCell(29)) || getCellValue(row.getCell(27));
    
    if (typeof adaptVal === 'number') adaptation = adaptVal * multiplier;
    if (typeof mitigVal === 'number') mitigation = mitigVal * multiplier;
    
    const totalAmount = mooe + co;
    
    // Skip zero amount rows
    if (totalAmount === 0 && adaptation === 0 && mitigation === 0) {
      skippedRows++;
      continue;
    }
    
    projects.push({
      departmentId: String(deptId),
      departmentName: String(deptName || ''),
      agencyId: String(agyId || ''),
      agencyName: String(agyName || ''),
      papId: String(papId),
      papName: String(papName),
      typologyCode: String(ccCode || ''),
      typologyDescription: String(ccDesc || ''),
      fiscalYear,
      dataType,
      mooe,
      capitalOutlay: co,
      totalAmount,
      adaptationAmount: adaptation > 0 ? adaptation : (totalAmount > 0 && String(ccCode).startsWith('A') ? totalAmount : 0),
      mitigationAmount: mitigation > 0 ? mitigation : (totalAmount > 0 && String(ccCode).startsWith('M') ? totalAmount : 0),
      status: String(getCellValue(row.getCell(18)) || 'Unknown')
    });
    
    validRows++;
  }
  
  console.log(`  Parsed ${validRows} valid records, skipped ${skippedRows} rows`);
  return projects;
}

/**
 * Main parsing function
 */
async function parseAllFiles() {
  const file1 = 'data/Araw National CCET PAPs Figures 2017 - GAA FY2025.xlsx';
  
  console.log('\n' + '='.repeat(80));
  console.log('PARSING CCET PAPs DATA');
  console.log('='.repeat(80));
  
  const allProjects: ParsedProject[] = [];
  
  // Parse each year/type combination
  const sheets = [
    { name: '2025 (GAA)', year: 2025, type: 'GAA' as const },
    { name: '2025 (NEP)', year: 2025, type: 'NEP' as const },
    { name: '2024 (GAA)', year: 2024, type: 'GAA' as const },
    { name: '2024 (NEP)', year: 2024, type: 'NEP' as const },
    { name: '2023 (GAA)', year: 2023, type: 'GAA' as const },
    { name: '2023 (NEP)', year: 2023, type: 'NEP' as const },
    { name: '2023 (Actual)', year: 2023, type: 'Actual' as const },
    { name: '2022 (GAA)', year: 2022, type: 'GAA' as const },
    { name: '2022 (Actual)', year: 2022, type: 'Actual' as const },
  ];
  
  for (const sheet of sheets) {
    try {
      console.log(`\nProcessing: ${sheet.name}...`);
      const projects = await parseCCETSheet(file1, sheet.name, sheet.year, sheet.type);
      allProjects.push(...projects);
    } catch (error: any) {
      console.error(`  Error parsing ${sheet.name}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL RECORDS PARSED: ${allProjects.length}`);
  console.log('='.repeat(80));
  
  // Save to JSON for review
  const outputPath = 'data/parsed-ccet-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(allProjects, null, 2));
  console.log(`\nData saved to: ${outputPath}`);
  
  // Show summary statistics
  console.log('\nSUMMARY BY YEAR:');
  const byYear = allProjects.reduce((acc, p) => {
    acc[p.fiscalYear] = (acc[p.fiscalYear] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  Object.entries(byYear)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([year, count]) => {
      console.log(`  ${year}: ${count} records`);
    });
  
  console.log('\nSUMMARY BY TYPE:');
  const byType = allProjects.reduce((acc, p) => {
    acc[p.dataType] = (acc[p.dataType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} records`);
  });
  
  // Total amounts
  const totalInvestment = allProjects.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalAdaptation = allProjects.reduce((sum, p) => sum + p.adaptationAmount, 0);
  const totalMitigation = allProjects.reduce((sum, p) => sum + p.mitigationAmount, 0);
  
  console.log('\nTOTAL AMOUNTS (PHP):');
  console.log(`  Total Investment: ₱${(totalInvestment / 1_000_000_000).toFixed(2)} Billion`);
  console.log(`  Adaptation: ₱${(totalAdaptation / 1_000_000_000).toFixed(2)} Billion`);
  console.log(`  Mitigation: ₱${(totalMitigation / 1_000_000_000).toFixed(2)} Billion`);
  
  // Sample records
  console.log('\nSAMPLE RECORDS (first 3):');
  allProjects.slice(0, 3).forEach((p, idx) => {
    console.log(`\n  Record ${idx + 1}:`);
    console.log(`    Department: ${p.departmentName}`);
    console.log(`    Agency: ${p.agencyName}`);
    console.log(`    PAP: ${p.papName.substring(0, 60)}...`);
    console.log(`    Year: ${p.fiscalYear} (${p.dataType})`);
    console.log(`    Amount: ₱${(p.totalAmount / 1_000_000).toFixed(2)}M`);
    console.log(`    Adaptation: ₱${(p.adaptationAmount / 1_000_000).toFixed(2)}M`);
    console.log(`    Mitigation: ₱${(p.mitigationAmount / 1_000_000).toFixed(2)}M`);
  });
}

parseAllFiles().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

