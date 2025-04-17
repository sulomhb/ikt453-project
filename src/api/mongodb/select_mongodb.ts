import { connectMongoDB } from "./connect_mongodb.ts";

// MONGODB
export async function selectMongoDB(): Promise<any> {
    const mongoClient = await connectMongoDB();
    const db = mongoClient.db("clinical_data");
    const collection = db.collection("data");
    const tenClinicalData = await collection.find().limit(10).toArray();
    console.log("Ten: ", tenClinicalData)
    
    let count = 0
    for (let data of tenClinicalData) {
        console.log(`DATA  ${count}:`, data.id)
        count++;
    }
    return tenClinicalData;
}