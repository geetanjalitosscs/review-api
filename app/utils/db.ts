import mysql from 'mysql2/promise';

/**
 * Database Connection Utility
 * Manages MySQL database connection pool
 */

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'review',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

/**
 * Get database connection pool
 * Creates pool if it doesn't exist
 * @returns MySQL connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * Execute a database query
 * @param sql - SQL query string
 * @param params - Query parameters
 * @returns Query results
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  const connectionPool = getPool();
  const [results] = await connectionPool.execute(sql, params);
  return results as T;
}

/**
 * Close database connection pool
 * Should be called when shutting down the application
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

