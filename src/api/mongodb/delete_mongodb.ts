import { connectMongoDB } from "./connect_mongodb.ts";

export async function deleteMongoDB() {
  const mongoClient = await connectMongoDB();
  const db = mongoClient.db("clinical_data");
  const result = await db.collection("DimDiagnosis").deleteOne({ Diagnosis_ID: 1 });
  return result;
}