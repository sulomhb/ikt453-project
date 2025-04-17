import { connectPostgreSQL } from "./connect_postgresql.ts";

// POSTGRESQL
export async function insertPostgreSQL(): Promise<any> {
    try {
        const postgresqlClient = await connectPostgreSQL();
        let insertQuery = 'INSERT INTO clinical_data(data) VALUES($1) RETURNING *'
        const insertValues = ['\{\"TEST\" : \"TEST\"\}']
        let insertSucess = await postgresqlClient.query(insertQuery, insertValues);
        if(insertSucess.rowCount) {
            console.log("Rows inserted:", insertSucess.rowCount);
        }
        await postgresqlClient.end()
        return insertSucess;
    } catch(error) {
        console.log("Failed to insert from PostgreSQL: ", error)
    }
}

await insertPostgreSQL();