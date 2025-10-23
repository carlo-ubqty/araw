/**
 * Standalone Import Script for Parsed CCET Data
 * No dependencies on src/ files
 */

import * as fs from 'fs';
import mysql from 'mysql2/promise';

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

const stats = {
  departmentsCreated: 0,
  agenciesCreated: 0,
  projectsCreated: 0,
  investmentsCreated: 0,
  errors: [] as string[]
};

const cache = {
  departments: new Map<string, number>(),
  agencies: new Map<string, number>(),
  projects: new Map<string, number>()
};

async function importData() {
  console.log('\n' + '='.repeat(80));
  console.log('IMPORTING PARSED CCET DATA TO MYSQL');
  console.log('='.repeat(80));
  
  // Create connection (use socket for local MySQL)
  const connection = await mysql.createConnection({
    socketPath: '/tmp/mysql.sock',
    user: 'root',
    password: 'root',
    database: 'araw_climate_finance'
  });
  
  console.log('\n✓ Connected to MySQL');
  
  // Load data
  const dataPath = 'data/parsed-ccet-data.json';
  console.log(`✓ Loading: ${dataPath}`);
  
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const records: ParsedProject[] = JSON.parse(rawData);
  
  console.log(`✓ Loaded ${records.length} records\n`);
  console.log('Starting import (this may take a few minutes)...\n');
  
  let processed = 0;
  const startTime = Date.now();
  
  for (const record of records) {
    try {
      // Get/create department
      let deptId: number;
      if (cache.departments.has(record.departmentId)) {
        deptId = cache.departments.get(record.departmentId)!;
      } else {
        const [existing] = await connection.query<any>(
          'SELECT id FROM implementing_agencies WHERE code = ?',
          [record.departmentId]
        );
        
        if (existing.length > 0) {
          deptId = existing[0].id;
        } else {
          const [result] = await connection.query<any>(
            'INSERT INTO implementing_agencies (code, name, is_active) VALUES (?, ?, TRUE)',
            [record.departmentId, record.departmentName]
          );
          deptId = result.insertId;
          stats.departmentsCreated++;
        }
        cache.departments.set(record.departmentId, deptId);
      }
      
      // Get/create agency
      const agencyKey = `${record.departmentId}-${record.agencyId}`;
      let agyId: number;
      if (cache.agencies.has(agencyKey)) {
        agyId = cache.agencies.get(agencyKey)!;
      } else {
        const [existing] = await connection.query<any>(
          'SELECT id FROM implementing_agencies WHERE code = ?',
          [agencyKey]
        );
        
        if (existing.length > 0) {
          agyId = existing[0].id;
        } else {
          const [result] = await connection.query<any>(
            'INSERT INTO implementing_agencies (code, name, is_active) VALUES (?, ?, TRUE)',
            [agencyKey, record.agencyName || `Agency ${record.agencyId}`]
          );
          agyId = result.insertId;
          stats.agenciesCreated++;
        }
        cache.agencies.set(agencyKey, agyId);
      }
      
      // Get sector (use first one for now)
      const [sectors] = await connection.query<any>('SELECT id FROM sectors LIMIT 1');
      const sectorId = sectors[0]?.id || 1;
      
      // Get/create project
      let projectId: number;
      if (cache.projects.has(record.papId)) {
        projectId = cache.projects.get(record.papId)!;
      } else {
        const [existing] = await connection.query<any>(
          'SELECT id FROM projects WHERE project_code = ?',
          [record.papId]
        );
        
        if (existing.length > 0) {
          projectId = existing[0].id;
        } else {
          // Map status values to schema ENUM
          let mappedStatus = 'ongoing'; // default
          if (record.status) {
            const s = record.status.toUpperCase();
            if (s === 'PENDING' || s === 'SUBMITTED' || s === 'FOR REVIEW') {
              mappedStatus = 'planned';
            } else if (s === 'APPROVED' || s === 'ONGOING') {
              mappedStatus = 'ongoing';
            } else if (s === 'COMPLETED') {
              mappedStatus = 'completed';
            } else if (s === 'CANCELLED') {
              mappedStatus = 'cancelled';
            }
          }
          
          const [result] = await connection.query<any>(
            `INSERT INTO projects 
              (project_code, name, sector_id, status, total_amount, data_view, 
               start_date, end_date, is_nationwide)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              record.papId,
              record.papName.substring(0, 500),
              sectorId,
              mappedStatus,
              record.totalAmount,
              'NAP',
              `${record.fiscalYear}-01-01`,
              `${record.fiscalYear}-12-31`,
              true
            ]
          );
          projectId = result.insertId;
          stats.projectsCreated++;
        }
        cache.projects.set(record.papId, projectId);
      }
      
      // Determine climate type
      let climateType: 'Adaptation' | 'Mitigation' | 'Both' = 'Both';
      if (record.adaptationAmount > 0 && record.mitigationAmount === 0) {
        climateType = 'Adaptation';
      } else if (record.mitigationAmount > 0 && record.adaptationAmount === 0) {
        climateType = 'Mitigation';
      }
      
      // Check if investment exists
      const [existingInv] = await connection.query<any>(
        'SELECT id FROM investments WHERE project_id = ? AND fiscal_year = ? AND data_type = ?',
        [projectId, record.fiscalYear, record.dataType]
      );
      
      if (existingInv.length === 0) {
        // Create investment
        await connection.query(
          `INSERT INTO investments
            (project_id, implementing_agency_id, fiscal_year, fund_source, fund_type,
             climate_type, amount, data_type, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            projectId,
            agyId,
            record.fiscalYear,
            'Government Budget',
            'Public',
            climateType,
            record.totalAmount,
            record.dataType,
            `MOOE: ${record.mooe}, CO: ${record.capitalOutlay}`
          ]
        );
        stats.investmentsCreated++;
      }
      
      processed++;
      if (processed % 1000 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (processed / (Date.now() - startTime) * 1000).toFixed(0);
        console.log(`  Progress: ${processed}/${records.length} (${rate} records/sec, ${elapsed}s elapsed)`);
      }
      
    } catch (error: any) {
      stats.errors.push(`Error on PAP ${record.papId}: ${error.message}`);
      if (stats.errors.length <= 5) {
        console.error(`  ✗ Error: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✓ Processed ${processed}/${records.length} records`);
  
  // Statistics
  console.log('\n' + '='.repeat(80));
  console.log('IMPORT STATISTICS');
  console.log('='.repeat(80));
  console.log(`Departments Created: ${stats.departmentsCreated}`);
  console.log(`Agencies Created: ${stats.agenciesCreated}`);
  console.log(`Projects Created: ${stats.projectsCreated}`);
  console.log(`Investments Created: ${stats.investmentsCreated}`);
  console.log(`Errors: ${stats.errors.length}`);
  
  if (stats.errors.length > 0) {
    console.log(`\nFirst 5 errors:`);
    stats.errors.slice(0, 5).forEach(err => console.log(`  - ${err}`));
  }
  
  // Verification
  console.log('\n' + '='.repeat(80));
  console.log('DATABASE VERIFICATION');
  console.log('='.repeat(80));
  
  const [depts] = await connection.query('SELECT COUNT(*) as count FROM implementing_agencies');
  const [projs] = await connection.query('SELECT COUNT(*) as count FROM projects');
  const [invs] = await connection.query('SELECT COUNT(*) as count FROM investments');
  const [total] = await connection.query('SELECT SUM(amount) as total FROM investments');
  
  console.log(`\nDatabase Contents:`);
  console.log(`  Implementing Agencies: ${(depts as any)[0].count}`);
  console.log(`  Projects: ${(projs as any)[0].count}`);
  console.log(`  Investments: ${(invs as any)[0].count}`);
  console.log(`  Total Amount: ₱${(((total as any)[0].total || 0) / 1_000_000_000).toFixed(2)} Billion`);
  
  await connection.end();
  
  console.log('\n' + '='.repeat(80));
  console.log('IMPORT COMPLETE!');
  console.log('='.repeat(80));
  console.log('\nNext steps:');
  console.log('1. Enable database: echo "NEXT_PUBLIC_USE_DATABASE=true" >> .env.local');
  console.log('2. Start dashboard: npm run dev');
  console.log('3. View at: http://localhost:3000\n');
}

importData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n✗ Fatal error:', err);
    process.exit(1);
  });

