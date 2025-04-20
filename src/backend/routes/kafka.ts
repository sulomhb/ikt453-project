import express from 'express';
const { Router } = express;
import type { Request, Response } from 'express';
import pkg from 'kafkajs';
const { Kafka } = pkg;
import type { Producer, Consumer } from 'kafkajs';
const router = Router();

// Define types for the data being sent to Kafka
interface ClinicalData {
  days_to_consent: number;
  disease_type: string;
}

interface AnalyticsData {
  key: string;
  value: number;
}

interface CacheData {
  key: string;
  value: any;
}

// Initialize Kafka
const kafka = new Kafka({ clientId: 'api-client', brokers: ['localhost:9092'] });
const producer: Producer = kafka.producer();

// Middleware to handle Kafka connections
const initKafka = async (): Promise<void> => {
  await producer.connect();
};

// API Route to send clinical data to Kafka
// docker exec -ti kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server :9092 --topic clinical-data  --from-beginning

router.post('/send-clinical-data', async (req: Request, res: Response): Promise<void> => {
  const { clinicalData }: { clinicalData: ClinicalData } = req.body;

  try {
    await producer.send({
      topic: 'clinical-data',
      messages: [{ value: JSON.stringify(clinicalData) }],
    });
    res.status(200).send('Data sent to Kafka');
  } catch (error) {
    console.error('Error sending data to Kafka:', error);
    res.status(500).send('Error sending data to Kafka');
  }
});

// API Route to send analytics data to Kafka
// docker exec -ti kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server :9092 --topic postgres-analytics  --from-beginning

router.post('/send-analytics-data', async (req: Request, res: Response): Promise<void> => {
  const { analyticsData }: { analyticsData: AnalyticsData } = req.body;

  try {
    await producer.send({
      topic: 'postgres-analytics',
      messages: [{ value: JSON.stringify(analyticsData) }],
    });
    res.status(200).send('Data sent to Kafka');
  } catch (error) {
    console.error('Error sending data to Kafka:', error);
    res.status(500).send('Error sending data to Kafka');
  }
});

// API Route to send cache data to Kafka
// docker exec -ti kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server :9092 --topic redis-cache  --from-beginning

router.post('/send-cache-data', async (req: Request, res: Response): Promise<void> => {
  const { cacheData }: { cacheData: CacheData } = req.body;

  try {
    await producer.send({
      topic: 'redis-cache',
      messages: [{ value: JSON.stringify(cacheData) }],
    });
    res.status(200).send('Data sent to Kafka');
  } catch (error) {
    console.error('Error sending data to Kafka:', error);
    res.status(500).send('Error sending data to Kafka');
  }
});

// Initialize Kafka connection on API startup
initKafka();

export default router;