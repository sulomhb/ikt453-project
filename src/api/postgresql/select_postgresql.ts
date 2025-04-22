import { connectPostgreSQL } from './connect_postgresql.ts';

export async function selectPostgreSQL(filters?: any): Promise<any> {
  try {
    const client = await connectPostgreSQL();

    let query = 'SELECT * FROM dimdiagnosis';
    const values: any[] = [];

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${conditions}`;
      values.push(...Object.values(filters));
    }

    const result = await client.query(query, values);
    await client.end();
    return result;
  } catch (error) {
    console.error('Failed to select from PostgreSQL:', error);
    throw error;
  }
}