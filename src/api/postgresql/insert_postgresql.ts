import { connectPostgreSQL } from './connect_postgresql.ts';

export async function insertPostgreSQL(data: any): Promise<any> {
  try {
    const client = await connectPostgreSQL();

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `INSERT INTO dimdiagnosis (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const result = await client.query(query, values);

    await client.end();
    return result.rows[0];
  } catch (error) {
    console.error('Failed to insert into PostgreSQL:', error);
    throw error;
  }
}