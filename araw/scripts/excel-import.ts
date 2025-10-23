/**
 * ARAW V3.0 Dashboard - Excel Import Utility
 * 
 * Imports climate finance data from Excel files (SharePoint exports)
 * into MySQL database
 * 
 * Usage:
 *   npx ts-node scripts/excel-import.ts <path-to-excel-file>
 */

import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { getPool, execute, transaction, query } from '../src/lib/database';

// ============================================================================
// TYPES
// ============================================================================

interface ImportOptions {
  dryRun?: boolean;
  skipValidation?: boolean;
  batchSize?: number;
}

interface ImportResult {
  success: boolean;
  inserted: number;
  updated: number;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// EXCEL PARSING FUNCTIONS
// ============================================================================

/**
 * Read Excel file and return workbook
 */
async function readExcelFile(filePath: string): Promise<ExcelJS.Workbook> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
}

/**
 * Get all sheet names from workbook
 */
function getSheetNames(workbook: ExcelJS.Workbook): string[] {
  return workbook.worksheets.map(sheet => sheet.name);
}

/**
 * Parse sheet rows into objects
 */
function parseSheetToObjects(sheet: ExcelJS.Worksheet): any[] {
  const rows: any[] = [];
  const headers: string[] = [];

  // Get headers from first row
  const firstRow = sheet.getRow(1);
  firstRow.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value || '').trim();
  });

  // Parse data rows
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const obj: any = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        obj[header] = cell.value;
      }
    });

    rows.push(obj);
  });

  return rows;
}

// ============================================================================
// IMPORT FUNCTIONS BY DATA TYPE
// ============================================================================

/**
 * Import Projects from Excel
 */
async function importProjects(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    inserted: 0,
    updated: 0,
    errors: [],
    warnings: [],
  };

  console.log(`[Import] Processing ${data.length} projects...`);

  for (const row of data) {
    try {
      // Validate required fields
      if (!row.project_code || !row.name || !row.sector_id) {
        result.warnings.push(`Skipping invalid row: ${JSON.stringify(row)}`);
        continue;
      }

      if (options.dryRun) {
        console.log(`[DRY RUN] Would insert/update: ${row.project_code}`);
        result.inserted++;
        continue;
      }

      // Check if project exists
      const existing = await query(
        'SELECT id FROM projects WHERE project_code = ?',
        [row.project_code]
      );

      if (existing.length > 0) {
        // Update existing project
        await execute(
          `UPDATE projects SET 
            name = ?, description = ?, sector_id = ?, region_id = ?,
            status = ?, total_amount = ?, start_date = ?, end_date = ?,
            data_view = ?, is_nationwide = ?
          WHERE project_code = ?`,
          [
            row.name,
            row.description || null,
            row.sector_id,
            row.region_id || null,
            row.status || 'ongoing',
            row.total_amount || 0,
            row.start_date || null,
            row.end_date || null,
            row.data_view || 'NAP',
            row.is_nationwide || false,
            row.project_code,
          ]
        );
        result.updated++;
      } else {
        // Insert new project
        await execute(
          `INSERT INTO projects 
            (project_code, name, description, sector_id, region_id, status, 
             total_amount, start_date, end_date, data_view, is_nationwide)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.project_code,
            row.name,
            row.description || null,
            row.sector_id,
            row.region_id || null,
            row.status || 'ongoing',
            row.total_amount || 0,
            row.start_date || null,
            row.end_date || null,
            row.data_view || 'NAP',
            row.is_nationwide || false,
          ]
        );
        result.inserted++;
      }
    } catch (error: any) {
      result.errors.push(`Error processing project ${row.project_code}: ${error.message}`);
      result.success = false;
    }
  }

  return result;
}

/**
 * Import Investments from Excel
 */
async function importInvestments(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    inserted: 0,
    updated: 0,
    errors: [],
    warnings: [],
  };

  console.log(`[Import] Processing ${data.length} investments...`);

  for (const row of data) {
    try {
      // Validate required fields
      if (!row.project_id || !row.fiscal_year || !row.amount) {
        result.warnings.push(`Skipping invalid investment row: ${JSON.stringify(row)}`);
        continue;
      }

      if (options.dryRun) {
        console.log(`[DRY RUN] Would insert investment: Project ${row.project_id}, Year ${row.fiscal_year}`);
        result.inserted++;
        continue;
      }

      // Insert investment (no update logic - always insert new records)
      await execute(
        `INSERT INTO investments 
          (project_id, funder_id, implementing_agency_id, fiscal_year, 
           fund_source, fund_type, climate_type, amount, data_type, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.project_id,
          row.funder_id || null,
          row.implementing_agency_id || null,
          row.fiscal_year,
          row.fund_source || 'Government Budget',
          row.fund_type || 'Public',
          row.climate_type || 'Adaptation',
          row.amount,
          row.data_type || 'Actual',
          row.notes || null,
        ]
      );
      result.inserted++;
    } catch (error: any) {
      result.errors.push(`Error processing investment: ${error.message}`);
      result.success = false;
    }
  }

  return result;
}

/**
 * Import GHG Emissions from Excel
 */
async function importGHGEmissions(
  data: any[],
  options: ImportOptions = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    inserted: 0,
    updated: 0,
    errors: [],
    warnings: [],
  };

  console.log(`[Import] Processing ${data.length} GHG emission records...`);

  for (const row of data) {
    try {
      // Validate required fields
      if (!row.year || !row.total_ghg) {
        result.warnings.push(`Skipping invalid GHG row: ${JSON.stringify(row)}`);
        continue;
      }

      if (options.dryRun) {
        console.log(`[DRY RUN] Would insert/update GHG: Year ${row.year}`);
        result.inserted++;
        continue;
      }

      // Check if record exists
      const existing = await query(
        'SELECT id FROM ghg_emissions WHERE year = ? AND sector_id <=> ?',
        [row.year, row.sector_id || null]
      );

      if (existing.length > 0) {
        // Update existing record
        await execute(
          `UPDATE ghg_emissions SET 
            total_ghg = ?, co2 = ?, ch4 = ?, n2o = ?, hfc = ?,
            is_projection = ?, data_source = ?, notes = ?
          WHERE year = ? AND sector_id <=> ?`,
          [
            row.total_ghg,
            row.co2 || 0,
            row.ch4 || 0,
            row.n2o || 0,
            row.hfc || 0,
            row.is_projection || false,
            row.data_source || null,
            row.notes || null,
            row.year,
            row.sector_id || null,
          ]
        );
        result.updated++;
      } else {
        // Insert new record
        await execute(
          `INSERT INTO ghg_emissions 
            (year, sector_id, total_ghg, co2, ch4, n2o, hfc, 
             is_projection, data_source, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.year,
            row.sector_id || null,
            row.total_ghg,
            row.co2 || 0,
            row.ch4 || 0,
            row.n2o || 0,
            row.hfc || 0,
            row.is_projection || false,
            row.data_source || null,
            row.notes || null,
          ]
        );
        result.inserted++;
      }
    } catch (error: any) {
      result.errors.push(`Error processing GHG emission: ${error.message}`);
      result.success = false;
    }
  }

  return result;
}

// ============================================================================
// MAIN IMPORT FUNCTION
// ============================================================================

/**
 * Import data from Excel file
 */
export async function importFromExcel(
  filePath: string,
  options: ImportOptions = {}
): Promise<void> {
  console.log(`\n[Import] Starting import from: ${filePath}`);
  console.log(`[Import] Dry run: ${options.dryRun ? 'YES' : 'NO'}\n`);

  try {
    // Read Excel file
    const workbook = await readExcelFile(filePath);
    const sheetNames = getSheetNames(workbook);
    console.log(`[Import] Found ${sheetNames.length} sheets: ${sheetNames.join(', ')}\n`);

    // Process each sheet based on name
    for (const sheetName of sheetNames) {
      const sheet = workbook.getWorksheet(sheetName);
      if (!sheet) continue;

      console.log(`[Import] Processing sheet: ${sheetName}`);
      const data = parseSheetToObjects(sheet);

      let result: ImportResult;

      // Route to appropriate import function based on sheet name
      if (sheetName.toLowerCase().includes('project')) {
        result = await importProjects(data, options);
      } else if (sheetName.toLowerCase().includes('investment') || sheetName.toLowerCase().includes('fund')) {
        result = await importInvestments(data, options);
      } else if (sheetName.toLowerCase().includes('ghg') || sheetName.toLowerCase().includes('emission')) {
        result = await importGHGEmissions(data, options);
      } else {
        console.log(`[Import] Skipping unknown sheet: ${sheetName}\n`);
        continue;
      }

      // Print results
      console.log(`[Import] Results for ${sheetName}:`);
      console.log(`  - Inserted: ${result.inserted}`);
      console.log(`  - Updated: ${result.updated}`);
      console.log(`  - Warnings: ${result.warnings.length}`);
      console.log(`  - Errors: ${result.errors.length}`);

      if (result.errors.length > 0) {
        console.log('\n  Errors:');
        result.errors.forEach(err => console.log(`    - ${err}`));
      }

      if (result.warnings.length > 0 && result.warnings.length <= 5) {
        console.log('\n  Warnings:');
        result.warnings.forEach(warn => console.log(`    - ${warn}`));
      }

      console.log('');
    }

    console.log('[Import] Import completed successfully!\n');
  } catch (error: any) {
    console.error('[Import] Import failed:', error.message);
    throw error;
  }
}

// ============================================================================
// CLI EXECUTION
// ============================================================================

// If run directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npx ts-node scripts/excel-import.ts <excel-file-path> [--dry-run]');
    process.exit(1);
  }

  const filePath = args[0];
  const dryRun = args.includes('--dry-run');

  importFromExcel(filePath, { dryRun })
    .then(() => {
      console.log('[Import] Done!');
      process.exit(0);
    })
    .catch(err => {
      console.error('[Import] Failed:', err);
      process.exit(1);
    });
}

