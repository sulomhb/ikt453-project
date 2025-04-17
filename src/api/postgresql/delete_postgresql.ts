import { connectPostgreSQL } from "./connect_postgresql.ts";

// POSTGRESQL
export async function deletePostgreSQL(): Promise<any> {
    try {
        const postgresqlClient = await connectPostgreSQL();
        let deleteQuery = 'delete from clinical_data where id=13';
        let deleteSucess = await postgresqlClient.query(deleteQuery);
        if(deleteSucess.rowCount) {
            console.log("Rows deleted:", deleteSucess.rowCount);
        }
        await postgresqlClient.end()
        return deleteSucess;
    } catch(error) {
        console.log("Failed to delete from PostgreSQL: ", error)
    }
}