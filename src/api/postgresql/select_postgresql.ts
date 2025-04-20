import { connectPostgreSQL } from "./connect_postgresql.ts";

// POSTGRESQL
export async function selectPostgreSQL(): Promise<any> {
    try {
        const postgresqlClient = await connectPostgreSQL();
        let selectQuery = 'select * from clinical_data where id < 20';
        let selectSucess = await postgresqlClient.query(selectQuery);
        if(selectSucess.rowCount) {
            console.log("Rows selected:", selectSucess.rowCount);
        }
        console.log("Rows selected:", selectSucess.rows);
        await postgresqlClient.end()
        return selectSucess;
    } catch(error) {
        console.log("Failed to select from PostgreSQL: ", error)
    }
}