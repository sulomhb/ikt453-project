import { connectMongoDB } from "./mongodb/connect_mongodb.ts";
import { connectRedis } from "./redis/connect_redis.ts";
import { connectPostgreSQL } from "./postgresql/connect_postgresql.ts";

// Type alias for clarity
type ClinicalData = Record<string, any>[];

// REDIS
export async function populateRedis(data: ClinicalData): Promise<ClinicalData> {
    const redis = await connectRedis();
    const jsonString = JSON.stringify(data);
    await redis.set("clinical_data", jsonString);
    console.log("Data populated in Redis");
    return data;
}

// MONGODB
export async function populateMongoDB(data: ClinicalData): Promise<ClinicalData> {
    const mongoClient = await connectMongoDB();
    const db = mongoClient.db("clinical_data");
    const collection = db.collection("data");

    if (data.length > 0) {
        await collection.insertMany(data);
        console.log("Data populated in MongoDB");
    } else {
        console.log("No data to populate in MongoDB");
    }

    return data;
}

// POSTGRESQL
export async function populatePostgreSQL(data: ClinicalData): Promise<ClinicalData> {
    const pgClient = await connectPostgreSQL();

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS clinical_data (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL
        );
    `;
    await pgClient.query(createTableQuery);

    const insertQuery = `INSERT INTO clinical_data (data) VALUES ($1)`;

    for (const item of data) {
        await pgClient.query(insertQuery, [item]);
    }

    console.log("Data populated in PostgreSQL");
    return data;
}

// OPTIONAL: All-in-one runner
export async function populateAllDatabases(data: ClinicalData): Promise<void> {
    await Promise.all([
        populateRedis(data),
        populateMongoDB(data),
        populatePostgreSQL(data)
    ]);
    console.log("✅ All databases populated.");
}