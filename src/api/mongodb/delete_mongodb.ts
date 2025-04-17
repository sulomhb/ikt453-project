import { connectMongoDB } from "./connect_mongodb.ts";

// MONGODB
export async function deleteMongoDB(): Promise<any> {
    const mongoClient = await connectMongoDB();
    const db = mongoClient.db("clinical_data");
    const collection = db.collection("data");
    const deleteClinicalData = await collection.deleteOne({ id: "2d29a4ac-98e7-4663-9dd6-5681bc32ac2e" })
    console.log(deleteClinicalData.acknowledged, deleteClinicalData.deletedCount)
    return deleteClinicalData;
}
await deleteMongoDB();