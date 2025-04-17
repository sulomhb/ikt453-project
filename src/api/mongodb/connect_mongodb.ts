import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory path (ESM alternative to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../../../.env') });

const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT, MONGODB_APP_NAME } = process.env;

// Construct the MongoDB URI
const uri = MONGODB_USERNAME && MONGODB_PASSWORD
    ? `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/?appName=${MONGODB_APP_NAME}`
    : `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/?appName=${MONGODB_APP_NAME}`;

// Create a MongoClient instance
const client = new MongoClient(uri);

export default async function connectMongoDB(): Promise<MongoClient> {
    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
        return client; // Return the connected client
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}

export { connectMongoDB }; // Export the function for use in other modules