import { connectMongoDB } from "./connect_mongodb.ts";

export async function updateMongoDB(document: { filter: any, update: any }) {
  const mongoClient = await connectMongoDB();
  const db = mongoClient.db("clinical_data");

  const result = await db.collection("DimDiagnosis").updateOne(
    document.filter, // The filter object (e.g., { Diagnosis_ID: 1 })
    { $set: document.update } // The update object (e.g., { ajcc_pathologic_stage: 'Stage III' })
  );

  return result;
}