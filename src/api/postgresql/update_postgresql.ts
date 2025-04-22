import { connectPostgreSQL } from './connect_postgresql.ts';

export async function updatePostgreSQL(data: any): Promise<any> {
  try {
    const client = await connectPostgreSQL();

    if (!data.id) throw new Error('Missing ID for update');

    const { id, ...updates } = data;
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const query = `UPDATE dimdiagnosis SET ${setClause} WHERE diagnosis_id = $${keys.length + 1} RETURNING *`;
    const result = await client.query(query, [...values, id]);

    await client.end();
    return result.rows[0];
  } catch (error) {
    console.error('Failed to update PostgreSQL:', error);
    throw error;
  }
}