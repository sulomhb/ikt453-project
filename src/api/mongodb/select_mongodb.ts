import { connectMongoDB } from "./connect_mongodb.ts";

export async function selectMongoDB(filter: any = {}): Promise<any> {
  const mongoClient = await connectMongoDB();
  const db = mongoClient.db("clinical_data");
  const collection = db.collection("DimDiagnosis"); // use your actual collection name

  const results = await collection.find(filter).limit(10).toArray();
  console.log("Matching Results: ", results);

  let count = 0;
  for (let data of results) {
    console.log(`DATA ${count}:`, data);
    count++;
  }

  return results;
}