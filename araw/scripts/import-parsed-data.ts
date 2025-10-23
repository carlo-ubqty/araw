/**
 * Import Parsed CCET Data to MySQL
 * Loads the 33K+ records from parsed-ccet-data.json into database
 */

import * as fs from 'fs';
import { getPool, execute, query, transaction } from '../src/lib/database.js';

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

interface ImportStats {
  departmentsCreated: number;
  agenciesCreated: number;
  sectorsCreated: number;
  projectsCreated: number;
  investmentsCreated: number;
  errors: string[];
}

const stats: ImportStats = {
  departmentsCreated: 0,
  agenciesCreated: 0,
  sectorsCreated: 0,
  projectsCreated: 0,
  investmentsCreated: 0,
  errors: []
};

// Cache for entity IDs to avoid duplicate inserts
const departmentCache = new Map<string, number>();
const agencyCache = new Map<string, number>();
const sectorCache = new Map<string, number>();
const projectCache = new Map<string, number>();

/**
 * Get or create department
 */
async function getOrCreateDepartment(deptId: string, deptName: string): Promise<number> {
  const cacheKey = deptId;
  
  if (departmentCache.has(cacheKey)) {
    return departmentCache.get(cacheKey)!;
  }
  
  // Check if exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM implementing_agencies WHERE code = ? AND abbreviation IS NULL',
    [deptId]
  );
  
  if (existing.length > 0) {
    departmentCache.set(cacheKey, existing[0].id);
    return existing[0].id;
  }
  
  // Create new
  const result = await execute(
    'INSERT INTO implementing_agencies (code, name, is_active) VALUES (?, ?, TRUE)',
    [deptId, deptName]
  );
  
  departmentCache.set(cacheKey, result.insertId);
  stats.departmentsCreated++;
  return result.insertId;
}

/**
 * Get or create agency (under department)
 */
async function getOrCreateAgency(agyId: string, agyName: string, deptId: string): Promise<number> {
  const cacheKey = `${deptId}-${agyId}`;
  
  if (agencyCache.has(cacheKey)) {
    return agencyCache.get(cacheKey)!;
  }
  
  // Check if exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM implementing_agencies WHERE code = ?',
    [`${deptId}-${agyId}`]
  );
  
  if (existing.length > 0) {
    agencyCache.set(cacheKey, existing[0].id);
    return existing[0].id;
  }
  
  // Create new
  const result = await execute(
    'INSERT INTO implementing_agencies (code, name, is_active) VALUES (?, ?, TRUE)',
    [`${deptId}-${agyId}`, agyName || `Agency ${agyId}`]
  );
  
  agencyCache.set(cacheKey, result.insertId);
  stats.agenciesCreated++;
  return result.insertId;
}

/**
 * Get or create a generic sector for this project
 * Maps typology to NAP sectors
 */
async function getOrCreateSector(): Promise<number> {
  // For now, use a generic "Government Programs" sector
  // TODO: Map typology codes to actual NAP sectors
  const sectorCode = 'NAP_GOVT';
  
  if (sectorCache.has(sectorCode)) {
    return sectorCache.get(sectorCode)!;
  }
  
  const existing = await query<{ id: number }>(
    'SELECT id FROM sectors WHERE code = ?',
    [sectorCode]
  );
  
  if (existing.length > 0) {
    sectorCache.set(sectorCode, existing[0].id);
    return existing[0].id;
  }
  
  // Create generic sector
  const result = await execute(
    'INSERT INTO sectors (code, name, data_view, display_order) VALUES (?, ?, ?, ?)',
    [sectorCode, 'Government Climate Programs', 'NAP', 99]
  );
  
  sectorCache.set(sectorCode, result.insertId);
  stats.sectorsCreated++;
  return result.insertId;
}

/**
 * Get or create project
 */
async function getOrCreateProject(record: ParsedProject, agencyId: number, sectorId: number): Promise<number> {
  const cacheKey = record.papId;
  
  if (projectCache.has(cacheKey)) {
    return projectCache.get(cacheKey)!;
  }
  
  // Check if exists
  const existing = await query<{ id: number }>(
    'SELECT id FROM projects WHERE project_code = ?',
    [record.papId]
  );
  
  if (existing.length > 0) {
    projectCache.set(cacheKey, existing[0].id);
    return existing[0].id;
  }
  
  // Determine start year from fiscal year
  const startDate = `${record.fiscalYear}-01-01`;
  const endDate = `${record.fiscalYear}-12-31`;
  
  // Create new project
  const result = await execute(
    `INSERT INTO projects 
      (project_code, name, sector_id, status, total_amount, data_view, start_date, end_date, is_nationwide)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      record.papId,
      record.papName.substring(0, 500), // Truncate if too long
      sectorId,
      record.status || 'ongoing',
      record.totalAmount,
      'NAP', // Default to NAP
      startDate,
      endDate,
      true // Most CCET projects are nationwide
    ]
  );
  
  projectCache.set(cacheKey, result.insertId);
  stats.projectsCreated++;
  return result.insertId;
}

/**
 * Create investment record
 */
async function createInvestment(record: ParsedProject, projectId: number, agencyId: number): Promise<void> {
  // Determine climate type
  let climateType: 'Adaptation' | 'Mitigation' | 'Both' = 'Both';
  if (record.adaptationAmount > 0 && record.mitigationAmount === 0) {
    climateType = 'Adaptation';
  } else if (record.mitigationAmount > 0 && record.adaptationAmount === 0) {
    climateType = 'Mitigation';
  }
  
  // Check if this investment already exists
  const existing = await query(
    'SELECT id FROM investments WHERE project_id = ? AND fiscal_year = ? AND data_type = ?',
    [projectId, record.fiscalYear, record.dataType]
  );
  
  if (existing.length > 0) {
    // Update existing
    await execute(
      `UPDATE investments SET 
        amount = ?,
        implementing_agency_id = ?,
        climate_type = ?
      WHERE id = ?`,
      [record.totalAmount, agencyId, climateType, existing[0].id]
    );
    return;
  }
  
  // Create new investment
  await execute(
    `INSERT INTO investments
      (project_id, implementing_agency_id, fiscal_year, fund_source, fund_type, 
       climate_type, amount, data_type, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      projectId,
      agencyId,
      record.fiscalYear,
      'Government Budget', // Default for CCET data
      'Public',
      climateType,
      record.totalAmount,
      record.dataType,
      `MOOE: ${record.mooe}, CO: ${record.capitalOutlay}, Typology: ${record.typologyCode}`
    ]
  );
  
  stats.investmentsCreated++;
}

/**
 * Main import function
 */
async function importData() {
  console.log('\n' + '='.repeat(80));
  console.log('IMPORTING PARSED CCET DATA TO MYSQL');
  console.log('='.repeat(80));
  
  // Load parsed data
  const dataPath = 'data/parsed-ccet-data.json';
  console.log(`\nLoading data from: ${dataPath}`);
  
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const records: ParsedProject[] = JSON.parse(rawData);
  
  console.log(`Loaded ${records.length} records`);
  console.log('\nStarting import...\n');
  
  // Process in batches
  const batchSize = 100;
  let processed = 0;
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    
    for (const record of batch) {
      try {
        // Get/create entities
        const deptId = await getOrCreateDepartment(record.departmentId, record.departmentName);
        const agyId = await getOrCreateAgency(record.agencyId, record.agencyName, record.departmentId);
        const sectorId = await getOrCreateSector();
        const projectId = await getOrCreateProject(record, agyId, sectorId);
        await createInvestment(record, projectId, agyId);
        
        processed++;
        
        if (processed % 1000 === 0) {
          console.log(`  Processed ${processed}/${records.length} records...`);
        }
      } catch (error: any) {
        stats.errors.push(`Error processing record ${record.papId}: ${error.message}`);
        if (stats.errors.length <= 10) {
          console.error(`  Error: ${error.message}`);
        }
      }
    }
  }
  
  console.log(`\n  Processed ${processed}/${records.length} records`);
  
  // Show statistics
  console.log('\n' + '='.repeat(80));
  console.log('IMPORT STATISTICS');
  console.log('='.repeat(80));
  console.log(`Departments Created: ${stats.departmentsCreated}`);
  console.log(`Agencies Created: ${stats.agenciesCreated}`);
  console.log(`Sectors Created: ${stats.sectorsCreated}`);
  console.log(`Projects Created: ${stats.projectsCreated}`);
  console.log(`Investments Created: ${stats.investmentsCreated}`);
  console.log(`Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log(`\nShowing first 10 errors:`);
    stats.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
  }
  
  // Verify data
  console.log('\n' + '='.repeat(80));
  console.log('DATABASE VERIFICATION');
  console.log('='.repeat(80));
  
  const deptCount = await query('SELECT COUNT(*) as count FROM implementing_agencies');
  const projectCount = await query('SELECT COUNT(*) as count FROM projects');
  const investmentCount = await query('SELECT COUNT(*) as count FROM investments');
  const totalAmount = await query('SELECT SUM(amount) as total FROM investments');
  
  console.log(`\nDatabase Contents:`);
  console.log(`  Implementing Agencies: ${deptCount[0].count}`);
  console.log(`  Projects: ${projectCount[0].count}`);
  console.log(`  Investments: ${investmentCount[0].count}`);
  console.log(`  Total Amount: ₱${((totalAmount[0].total || 0) / 1_000_000_000).toFixed(2)} Billion`);
  
  console.log('\n' + '='.repeat(80));
  console.log('IMPORT COMPLETE!');
  console.log('='.repeat(80));
  console.log('\nNext steps:');
  console.log('1. Enable database mode: echo "NEXT_PUBLIC_USE_DATABASE=true" >> .env.local');
  console.log('2. Start the dashboard: npm run dev');
  console.log('3. View real data at: http://localhost:3000');
}

// Run import
importData()
  .then(() => {
    console.log('\n✓ Import successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n✗ Import failed:', err);
    process.exit(1);
  });

