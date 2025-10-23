/**
 * ARAW V3.0 Dashboard - MySQL Database Connection Utility
 * 
 * Provides connection pooling and query helpers for MySQL database
 * Follows best practices for Next.js API routes
 */

import mysql from 'mysql2/promise';

// ============================================================================
// TYPES
// ============================================================================

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
  enableKeepAlive: boolean;
  keepAliveInitialDelay: number;
}

export interface QueryResult {
  rows: any[];
  fields: any[];
}

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================

/**
 * Get database configuration from environment variables
 * Falls back to local development defaults
 */
function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'araw_climate_finance',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };
}

// ============================================================================
// CONNECTION POOL
// ============================================================================

// Global connection pool (singleton pattern for Next.js)
let pool: mysql.Pool | null = null;

/**
 * Get or create the database connection pool
 * Uses singleton pattern to reuse connection across API routes
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    const config = getDatabaseConfig();
    
    // For local development, try socket connection first
    const poolConfig: any = {
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: config.waitForConnections,
      connectionLimit: config.connectionLimit,
      queueLimit: config.queueLimit,
      enableKeepAlive: config.enableKeepAlive,
      keepAliveInitialDelay: config.keepAliveInitialDelay,
    };
    
    // Use socket for local MySQL (faster and more reliable)
    if (config.host === 'localhost' && process.env.DB_SOCKET) {
      poolConfig.socketPath = process.env.DB_SOCKET;
    } else if (config.host === 'localhost' && !process.env.DB_HOST) {
      // Default to socket for localhost
      poolConfig.socketPath = '/tmp/mysql.sock';
    } else {
      poolConfig.host = config.host;
      poolConfig.port = config.port;
    }
    
    pool = mysql.createPool(poolConfig);

    // Log pool creation (only once)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Database] Connection pool created for ${poolConfig.socketPath || `${config.host}:${config.port}`}/${config.database}`);
    }
  }

  return pool;
}

/**
 * Close the database connection pool
 * Used for graceful shutdown
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    if (process.env.NODE_ENV === 'development') {
      console.log('[Database] Connection pool closed');
    }
  }
}

// ============================================================================
// QUERY HELPERS
// ============================================================================

/**
 * Execute a SELECT query
 * Returns rows and fields
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('[Database] Query error:', error);
    console.error('[Database] SQL:', sql);
    console.error('[Database] Params:', params);
    throw error;
  }
}

/**
 * Execute a single SELECT query that returns one row
 * Returns the first row or null
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 * Returns result info (affectedRows, insertId, etc.)
 */
export async function execute(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  try {
    const pool = getPool();
    const [result] = await pool.execute(sql, params);
    return result as mysql.ResultSetHeader;
  } catch (error) {
    console.error('[Database] Execute error:', error);
    console.error('[Database] SQL:', sql);
    console.error('[Database] Params:', params);
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 * Automatically commits or rolls back
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('[Database] Transaction error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test database connection
 * Returns true if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 as test');
    return Array.isArray(rows) && rows.length > 0;
  } catch (error) {
    console.error('[Database] Connection test failed:', error);
    return false;
  }
}

/**
 * Get database version info
 */
export async function getDatabaseVersion(): Promise<string> {
  try {
    const result = await queryOne<{ version: string }>(
      'SELECT VERSION() as version'
    );
    return result?.version || 'Unknown';
  } catch (error) {
    console.error('[Database] Failed to get version:', error);
    return 'Error';
  }
}

/**
 * Check if database exists
 */
export async function databaseExists(dbName: string): Promise<boolean> {
  try {
    const result = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
      [dbName]
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('[Database] Failed to check database existence:', error);
    return false;
  }
}

/**
 * Check if table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const config = getDatabaseConfig();
    const result = await queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [config.database, tableName]
    );
    return (result?.count ?? 0) > 0;
  } catch (error) {
    console.error('[Database] Failed to check table existence:', error);
    return false;
  }
}

// ============================================================================
// HELPER FUNCTIONS FOR COMMON PATTERNS
// ============================================================================

/**
 * Build WHERE clause from filter object
 * Example: buildWhereClause({ year: 2024, status: 'active' })
 * Returns: { sql: 'WHERE year = ? AND status = ?', params: [2024, 'active'] }
 */
export function buildWhereClause(
  filters: Record<string, any>
): { sql: string; params: any[] } {
  const conditions: string[] = [];
  const params: any[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          conditions.push(`${key} IN (${value.map(() => '?').join(', ')})`);
          params.push(...value);
        }
      } else {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    }
  });

  const sql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { sql, params };
}

/**
 * Escape identifier (table name, column name)
 * Prevents SQL injection for identifiers
 */
export function escapeIdentifier(identifier: string): string {
  return `\`${identifier.replace(/`/g, '``')}\``;
}

/**
 * Format date for MySQL
 * Accepts Date object or ISO string
 */
export function formatDateForMySQL(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getPool,
  closePool,
  query,
  queryOne,
  execute,
  transaction,
  testConnection,
  getDatabaseVersion,
  databaseExists,
  tableExists,
  buildWhereClause,
  escapeIdentifier,
  formatDateForMySQL,
};

