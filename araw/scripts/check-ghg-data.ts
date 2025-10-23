import { createConnection } from 'mysql2/promise';

async function checkGHGData() {
  const conn = await createConnection({
    socketPath: process.env.DB_SOCKET_PATH || '/tmp/mysql.sock',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'araw_climate_finance'
  });
  
  console.log('\n=== GHG EMISSIONS DATA FOR 2015 & 2020 ===\n');
  
  const [rows] = await conn.query(`
    SELECT s.code, s.name, e.year, e.total_ghg
    FROM sectors s
    JOIN ghg_emissions e ON s.id = e.sector_id
    WHERE s.code IN ('NAP_ENE', 'NAP_AGR', 'NDCIP_WST', 'GHG_IPPU', 'GHG_LULUCF')
    AND e.year IN (2015, 2020)
    ORDER BY e.year, s.name
  `);
  
  console.table(rows);
  
  console.log('\n=== ALL GHG EMISSIONS DATA ===\n');
  const [allRows] = await conn.query(`
    SELECT s.code, s.name, e.year, e.total_ghg
    FROM sectors s
    JOIN ghg_emissions e ON s.id = e.sector_id
    ORDER BY e.year, s.name
    LIMIT 20
  `);
  
  console.table(allRows);
  
  await conn.end();
}

checkGHGData().catch(console.error);

