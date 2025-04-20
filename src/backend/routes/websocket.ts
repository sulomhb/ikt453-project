import { WebSocketServer, WebSocket } from "ws";
import pkg from 'kafkajs';
const { Kafka } = pkg;
import type { Producer, Consumer } from 'kafkajs';
const wss = new WebSocketServer({ port: 8080 });

// Kafka setup
const kafka = new Kafka({ clientId: "ws-bridge", brokers: ["localhost:9092"] });
const consumer: Consumer = kafka.consumer({ groupId: "ws-consumer-group" });

const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "clinical-data", fromBeginning: true });
  await consumer.subscribe({ topic: "postgres-analytics", fromBeginning: true });
  await consumer.subscribe({ topic: "redis-cache", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let data;
      try {
        data = JSON.parse(message.value!.toString());
      } catch (err) {
        console.error(`Failed to parse message from topic ${topic}`, err);
        return;
      }
      // Broadcast to all WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ topic, message: data }));
        }
      });
    },
  });
};

wss.on("connection", (ws: WebSocket) => {
  console.log("New WebSocket client connected");

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Start Kafka consumer
startKafkaConsumer().catch(console.error);
