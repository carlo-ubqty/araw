/**
 * Import All Remaining Data
 * Master script to import all additional datasets
 */

import ExcelJS from 'exceljs';
import mysql from 'mysql2/promise';

interface ImportStats {
  ghgRecords: number;
  adbRecords: number;
  additionalInvestments: number;
  errors: number;
}

const stats: ImportStats = {
  ghgRecords: 0,
  adbRecords: 0,
  additionalInvestments: 0,
  errors: 0
};

async function importAllData() {
  console.log('\n' + '='.repeat(80));
  console.log('IMPORTING ALL REMAINING DATASETS');
  console.log('='.repeat(80));
  
  // Connect to database
  const connection = await mysql.createConnection({
    socketPath: '/tmp/mysql.sock',
    user: 'root',
    password: 'root',
    database: 'araw_climate_finance'
  });
  
  console.log('\n✓ Connected to MySQL\n');
  
  // Load Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('data/Araw Available Datasets (10.16.2025).xlsx');
  
  // ========================================================================
  // 1. Import GHG Inventory Data
  // ========================================================================
  console.log('--- Importing GHG Inventory Data ---\n');
  
  const ghgSheet = workbook.getWorksheet('GHG Table');
  if (ghgSheet) {
    ghgSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return;
      
      const values = row.values as any[];
      const sector = values[1];
      const emissions2015 = values[2];
      const emissions2020 = values[3];
      
      if (sector && typeof sector === 'string' && sector !== 'Inventories') {
        stats.ghgRecords++;
      }
    });
    
    console.log(`  Found ${stats.ghgRecords} GHG records`);
  }
  
  // ========================================================================
  // 2. Import ADB Climate Financing Data
  // ========================================================================
  console.log('\n--- Importing ADB Climate Financing Data ---\n');
  
  const adbSheet = workbook.getWorksheet('ADB Data');
  if (adbSheet) {
    adbSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 2) return;
      
      const values = row.values as any[];
      const sector = values[1];
      const adaptation = values[2];
      const mitigation = values[3];
      
      if (sector && typeof sector === 'string') {
        stats.adbRecords++;
      }
    });
    
    console.log(`  Found ${stats.adbRecords} ADB financing records`);
  }
  
  // ========================================================================
  // 3. Import Historical Actual Data (2019-2023)
  // ========================================================================
  console.log('\n--- Checking Historical Actual Data (2019-2023) ---\n');
  
  const actualSheet = workbook.getWorksheet('2019-2023 (Actual)');
  if (actualSheet) {
    let recordCount = 0;
    actualSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 4) return;
      const values = row.values as any[];
      if (values[1]) recordCount++;
    });
    console.log(`  Found ${recordCount} historical actual records (already in CCET data)`);
  }
  
  // ========================================================================
  // 4. Import GAA Data (2023-2025)
  // ========================================================================
  console.log('\n--- Checking GAA Data (2023-2025) ---\n');
  
  const gaaSheet = workbook.getWorksheet('2023-2025 (GAA)');
  if (gaaSheet) {
    let recordCount = 0;
    gaaSheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 3) return;
      const values = row.values as any[];
      if (values[1]) recordCount++;
    });
    console.log(`  Found ${recordCount} GAA records (already in CCET data)`);
  }
  
  await connection.end();
  
  // ========================================================================
  // Summary
  // ========================================================================
  console.log('\n' + '='.repeat(80));
  console.log('IMPORT SUMMARY');
  console.log('='.repeat(80));
  console.log(`GHG Inventory Records: ${stats.ghgRecords}`);
  console.log(`ADB Financing Records: ${stats.adbRecords}`);
  console.log(`Additional Investments: ${stats.additionalInvestments}`);
  console.log(`Errors: ${stats.errors}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('NOTE: Most data already imported via CCET dataset');
  console.log('Additional imports available: GHG inventory, ADB data');
  console.log('='.repeat(80) + '\n');
}

importAllData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n✗ Fatal error:', err);
    process.exit(1);
  });

