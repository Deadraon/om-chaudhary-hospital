/**
 * Cloudflare D1 REST API Helper
 * Executes raw SQL queries against Cloudflare D1 database
 */

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DB_ID = process.env.D1_DATABASE_ID;

const D1_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${DB_ID}/query`;

/**
 * Execute a SQL query against Cloudflare D1
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters (for prepared statements)
 * @returns {Promise<Array>} - Array of result rows
 */
export async function queryD1(sql, params = []) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !DB_ID) {
    throw new Error('Cloudflare D1 environment variables are not configured');
  }

  const response = await fetch(D1_BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql,
      params,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('D1 API Error:', response.status, errorText);
    throw new Error(`D1 query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    const errorMsg = data.errors?.map(e => e.message).join(', ') || 'Unknown D1 error';
    console.error('D1 Query Error:', errorMsg);
    throw new Error(`D1 query error: ${errorMsg}`);
  }

  // D1 returns results as an array of result sets
  // Each result set has { results, success, meta }
  const resultSet = data.result?.[0];
  
  if (!resultSet) {
    return [];
  }

  return resultSet.results || [];
}

/**
 * Execute multiple SQL statements in a batch
 * @param {Array<{sql: string, params: Array}>} statements - Array of SQL statements
 * @returns {Promise<Array>} - Array of result sets
 */
export async function batchD1(statements) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !DB_ID) {
    throw new Error('Cloudflare D1 environment variables are not configured');
  }

  const results = [];
  for (const stmt of statements) {
    const rows = await queryD1(stmt.sql, stmt.params || []);
    results.push(rows);
  }
  return results;
}

/**
 * Execute a SQL query and return the first row
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object|null>} - First row or null
 */
export async function queryD1First(sql, params = []) {
  const rows = await queryD1(sql, params);
  return rows.length > 0 ? rows[0] : null;
}
