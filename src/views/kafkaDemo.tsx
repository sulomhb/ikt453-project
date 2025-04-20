import { useEffect, useState } from "react";

export const KafkaStream = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    // docker exec -ti kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server :9092 --topic clinical-data  --from-beginning

    ws.onmessage = (event) => {
      const { topic, message: kafkaMessage } = JSON.parse(event.data);
      setMessage(`New message from topic ${topic}: ${JSON.stringify(kafkaMessage)}`);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{padding: 20}}>
      <h4>Real-Time Data Updates (Kafka)</h4>
      <pre>{message}</pre>
    </div>
  );
};