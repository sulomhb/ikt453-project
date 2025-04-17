import { connectMongoDB } from "./connect_mongodb.ts";

type ClinicalData = Record<string, any>[];

// MONGODB
export async function insertMongoDB(data: ClinicalData): Promise<ClinicalData> {
    const mongoClient = await connectMongoDB();
    const db = mongoClient.db("clinical_data");
    const collection = db.collection("data");
    
    if (data.length > 0) {
        await collection.insertMany(data);
    } else {
        console.log("No data to populate in MongoDB");
    }
    return data;
}