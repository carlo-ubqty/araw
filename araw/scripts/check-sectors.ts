/**
 * Quick script to check what sectors exist in the database
 */

import { createConnection } from 'mysql2/promise';

async function checkSectors() {
  // Create connection from environment variables
  const connectionConfig: any = {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'araw_climate_finance'
  };
  
  // Use socket path if provided (faster for local MySQL)
  if (process.env.DB_SOCKET_PATH) {
    connectionConfig.socketPath = process.env.DB_SOCKET_PATH;
  } else {
    connectionConfig.host = process.env.DB_HOST || 'localhost';
    connectionConfig.port = parseInt(process.env.DB_PORT || '3306');
  }
  
  const connection = await createConnection(connectionConfig);

  console.log('\n=== SECTORS IN DATABASE ===\n');
  const [sectors] = await connection.query(`
    SELECT id, code, name, data_view, display_order 
    FROM sectors 
    ORDER BY display_order
  `);
  console.table(sectors);

  console.log('\n=== SECTORS WITH INVESTMENT DATA ===\n');
  const [sectorsWithData] = await connection.query(`
    SELECT 
      s.name as sector,
      COUNT(DISTINCT p.id) as project_count,
      SUM(i.amount) / 1000000 as total_investment_millions
    FROM sectors s
    LEFT JOIN projects p ON s.id = p.sector_id
    LEFT JOIN investments i ON p.id = i.project_id
    GROUP BY s.id, s.name
    HAVING project_count > 0
    ORDER BY total_investment_millions DESC
  `);
  console.table(sectorsWithData);

  await connection.end();
}

checkSectors().catch(console.error);

