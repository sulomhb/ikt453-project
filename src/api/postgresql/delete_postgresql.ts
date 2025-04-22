import { connectPostgreSQL } from './connect_postgresql.ts';

export async function deletePostgreSQL(data: any): Promise<any> {
  try {
    const client = await connectPostgreSQL();

    if (!data.id) throw new Error('Missing ID for delete');

    const query = 'DELETE FROM dimdiagnosis WHERE diagnosis_id = $1 RETURNING *';
    const result = await client.query(query, [data.id]);

    await client.end();
    return result.rows[0];
  } catch (error) {
    console.error('Failed to delete from PostgreSQL:', error);
    throw error;
  }
}