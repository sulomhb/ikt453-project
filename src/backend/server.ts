// server.ts
import express from "express";
import cors from "cors";
import { populateMongoDB, populatePostgreSQL, populateRedis } from "../api/populate_db.ts";
// routes
import postgresRouter from './routes/postgres.ts';
import mongodbRouter from './routes/mongodb.ts';
import redisRouter from './routes/redis.ts';
import kafkaRouter from './routes/kafka.ts';  // Import Kafka route module

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // Allow only your frontend to make requests
}));
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

// Database-specific routes
app.use('/postgres', postgresRouter);
app.use('/mongodb', mongodbRouter);
app.use('/redis', redisRouter);
app.use('/kafka', kafkaRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});