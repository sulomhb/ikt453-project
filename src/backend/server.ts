// server.ts
import express from "express";
import cors from "cors";
import { populateMongoDB, populatePostgreSQL, populateRedis } from "../api/populate_db.ts";
import { selectMongoDB } from "../api/mongodb/select_mongodb.ts";

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Allow cross-origin requests from your React frontend
app.use(express.json()); // Parse JSON request bodies

// Routes
app.post("/populate", async (req, res) => {
  try {
    const clinicalData = req.body;
    console.log("Received clinical data:", clinicalData);
    await populateRedis(clinicalData);
    await populateMongoDB(clinicalData);
    await populatePostgreSQL(clinicalData);

    res.status(200).send("Databases populated");
  } catch (err) {
    console.error("Error populating databases:", err);
    res.status(500).send("Failed to populate databases");
  }
});

// Routes
app.get("/mongodb/clinical", async (req, res) => {
  try {
    const clinicalData = req.body;
    console.log("Received clinical data:", clinicalData);
    let data = await selectMongoDB();
    res.status(200).send({"status" : "SELECT from MongoDB success.", "body" : data});
  } catch (err) {
    res.status(500).send({"status" : "SELECT from MongoDB failed.", "body" : []});
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});