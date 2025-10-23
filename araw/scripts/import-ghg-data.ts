/**
 * Import GHG Inventory Data
 * Imports Philippine National GHG Inventories (2015 vs 2020)
 */

import ExcelJS from 'exceljs';
import mysql from 'mysql2/promise';

async function importGHGData() {
  console.log('\n' + '='.repeat(80));
  console.log('IMPORTING GHG INVENTORY DATA');
  console.log('='.repeat(80));
  
  // Connect to database
  const connection = await mysql.createConnection({
    socketPath: '/tmp/mysql.sock',
    user: 'root',
    password: 'root',
    database: 'araw_climate_finance'
  });
  
  console.log('\n✓ Connected to MySQL');
  
  // Load Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('data/Araw Available Datasets (10.16.2025).xlsx');
  
  const ghgSheet = workbook.getWorksheet('GHG Table');
  if (!ghgSheet) {
    console.error('✗ GHG Table sheet not found');
    return;
  }
  
  console.log('✓ Found GHG Table sheet');
  
  // Parse data (skip header rows)
  const ghgRecords: any[] = [];
  
  ghgSheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return; // Skip headers
    
    const values = row.values as any[];
    const sector = values[1];
    const emissions2015 = values[2];
    const emissions2020 = values[3];
    const percentChange = values[4];
    
    if (sector && typeof sector === 'string' && sector !== 'Inventories') {
      ghgRecords.push({
        sector: sector.trim(),
        emissions2015: parseFloat(String(emissions2015).replace(/[^0-9.-]/g, '')) || 0,
        emissions2020: parseFloat(String(emissions2020).replace(/[^0-9.-]/g, '')) || 0,
        percentChange: parseFloat(String(percentChange).replace(/[^0-9.-]/g, '')) || 0
      });
    }
  });
  
  console.log(`✓ Parsed ${ghgRecords.length} GHG records\n`);
  
  // Insert into database
  for (const record of ghgRecords) {
    try {
      // Check if sector exists, if not create it
      const [sectors] = await connection.query(
        'SELECT id FROM sectors WHERE name LIKE ? LIMIT 1',
        [`%${record.sector}%`]
      );
      
      let sectorId: number;
      if ((sectors as any[]).length > 0) {
        sectorId = (sectors as any[])[0].id;
      } else {
        // Create generic sector
        const [result] = await connection.query(
          'INSERT INTO sectors (code, name, data_view, display_order) VALUES (?, ?, ?, ?)',
          [`GHG_${record.sector.toUpperCase().replace(/[^A-Z]/g, '_')}`, record.sector, 'NAP', 99]
        );
        sectorId = (result as any).insertId;
      }
      
      // Insert GHG emissions data
      await connection.query(
        `INSERT INTO ghg_emissions (sector_id, year, co2, ch4, n2o, total_ghg, data_source, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE total_ghg = VALUES(total_ghg)`,
        [
          sectorId,
          2015,
          0, // Not broken down in source
          0,
          0,
          record.emissions2015,
          'Philippine National GHG Inventory 2015',
          `${record.percentChange}% change from 2015 to 2020`
        ]
      );
      
      await connection.query(
        `INSERT INTO ghg_emissions (sector_id, year, co2, ch4, n2o, total_ghg, data_source, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE total_ghg = VALUES(total_ghg)`,
        [
          sectorId,
          2020,
          0,
          0,
          0,
          record.emissions2020,
          'Philippine National GHG Inventory 2020',
          `${record.percentChange}% change from 2015 to 2020`
        ]
      );
      
      console.log(`  ✓ Imported GHG data for ${record.sector}`);
    } catch (error: any) {
      console.error(`  ✗ Error importing ${record.sector}: ${error.message}`);
    }
  }
  
  // Verify import
  const [count] = await connection.query('SELECT COUNT(*) as count FROM ghg_emissions');
  console.log(`\n✓ Total GHG records in database: ${(count as any[])[0].count}`);
  
  await connection.end();
  
  console.log('\n' + '='.repeat(80));
  console.log('GHG DATA IMPORT COMPLETE');
  console.log('='.repeat(80));
}

importGHGData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n✗ Fatal error:', err);
    process.exit(1);
  });

