import { useEffect, useState } from "react";

export const KafkaStream = ({ data }: { data: any }) => {
  const [clinicalDataMessage, setClinicalDataMessage] = useState<string>("");
  const [postgresAnalyticsMessage, setPostgresAnalyticsMessage] = useState<string>("");
  const [redisCacheMessage, setRedisCacheMessage] = useState<string>("");

  async function sendPostgresKafka() {
    const url = "http://localhost:3001/kafka/send-analytics-data";
    try {
      const payload = {
        analyticsData: {
          value: JSON.stringify(data),
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure this header is set
        },
        body: JSON.stringify(payload), // Ensure the body is stringified
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendMongoDBKafka() {
    const url = "http://localhost:3001/kafka/send-clinical-data";
    try {
      const payload = {
        clinicalData: {
          days_to_consent: 10,
          disease_type: JSON.stringify(data),
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure this header is set
        },
        body: JSON.stringify(payload), // Ensure the body is stringified
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendRedisKafka() {
    const url = "http://localhost:3001/kafka/send-cache-data";
    try {
      const payload = {
        cacheData: {
          value: JSON.stringify(data),
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure this header is set
        },
        body: JSON.stringify(payload), // Ensure the body is stringified
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const { topic, message: kafkaMessage } = JSON.parse(event.data);
    
      // Convert the message to a string
      const kafkaMessageString = JSON.stringify(kafkaMessage);
    
      // Truncate the string to the first 100 characters for display
      const truncatedMessage = kafkaMessageString.substring(0, 600);
    
      // Update the respective state based on the topic
      if (topic === "clinical-data") {
        setClinicalDataMessage(`New message from ${topic}: ${truncatedMessage}...`);
      } else if (topic === "postgres-analytics") {
        setPostgresAnalyticsMessage(`New message from ${topic}: ${truncatedMessage}...`);
      } else if (topic === "redis-cache") {
        setRedisCacheMessage(`New message from ${topic}: ${truncatedMessage}...`);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-6 rounded-lg bg-base-100 shadow-md">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={sendPostgresKafka}
          className="btn btn-soft btn-info text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Postgres
        </button>
        <button 
          onClick={sendMongoDBKafka}
          className="btn btn-soft btn-success text-white bg-green-500 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          MongoDB
        </button>
        <button 
          onClick={sendRedisKafka}
          className="btn btn-soft btn-error text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Redis
        </button>
      </div>

      <h4 className="text-xl font-semibold text-white mb-4">Real-Time Data Updates (Kafka)</h4>
      

      <div className="overflow-x-auto bg-blue-500 p-4 rounded-lg shadow-sm border border-base-content/10">
        <h5 className="font-semibold text-white">Postgres Kafka:</h5>
        <pre className="whitespace-pre-wrap break-words text-sm text-white">{postgresAnalyticsMessage}</pre>
      </div>
      <div className="overflow-x-auto bg-green-500 p-4 rounded-lg shadow-sm border border-base-content/10 mt-4">
        <h5 className="font-semibold text-white">MongoDB Kafka:</h5>
        <pre className="whitespace-pre-wrap break-words text-sm text-white">{clinicalDataMessage}</pre>
      </div>
      <div className="overflow-x-auto bg-red-500 p-4 rounded-lg shadow-sm border border-base-content/10 mt-4">
        <h5 className="font-semibold text-white">Redis Kafka:</h5>
        <pre className="whitespace-pre-wrap break-words text-sm text-white">{redisCacheMessage}</pre>
      </div>
    </div>
  );
};