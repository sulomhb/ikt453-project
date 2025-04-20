import { useEffect, useState } from "react";
import { PostgresAnalytics } from "./postgresDemo.tsx";
import { RedisCache } from "./redisDemo.tsx";
import { MongoClinical } from "./mongoDemo.tsx";
import { ClinicalCharts } from "../components/chart.tsx";
import useClinicalData from "../hooks/useClinicalData.ts";
import { KafkaStream } from "./kafkaDemo.tsx";

interface DemoData {
  analytics: any;
  clinical: any;
  cache: any;
}
function Demo() {
  const [demoData, setDemoData] = useState<DemoData>({
    analytics: null,
    clinical: null,
    cache: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:3001/${endpoint}`);
      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [analytics, clinical, cache] = await Promise.all([
          useClinicalData(),
          useClinicalData(),
          useClinicalData()
        ]);

        setDemoData({ analytics, clinical, cache });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) return <div>Loading demo data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1 style={{ color: "white" }}>Cancer Data Warehouse Demo</h1>
        <h2>GDC Data Integration Showcase</h2>
      </header>
      <ClinicalCharts data={demoData.analytics} />
      <div className="database-sections">
        <section className="database-panel">
          <h3>PostgreSQL Analytics</h3>
          <PostgresAnalytics data={demoData.analytics[0]} />
        </section>

        <section className="database-panel">
          <h3>MongoDB Clinical Records</h3>
          <MongoClinical data={demoData.clinical[0]} />
        </section>

        <section className="database-panel">
          <h3>Redis Cached Insights</h3>
          <RedisCache data={demoData.cache[0]} />
        </section>
      </div>

      <KafkaStream />
    </div>
  );
}

export default Demo;