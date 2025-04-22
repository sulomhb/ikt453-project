import { useEffect, useState } from "react";
import { PostgresAnalytics } from "./postgresDemo.tsx";
import { RedisCache } from "./redisDemo.tsx";
import { MongoClinical } from "./mongoDemo.tsx";
import { ClinicalCharts } from "../components/chart.tsx";
import { KafkaStream } from "./kafkaDemo.tsx";
import useClinicalData from "../hooks/useClinicalData.ts";
import { motion, AnimatePresence } from "framer-motion";

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

  // Modal states
  const [activeModal, setActiveModal] = useState<"postgres" | "mongo" | "redis" | null>(null);
  const loadData = async (data : any) => {
    try {
      const [analytics, clinical, cache] = await Promise.all([
        data,
        data,
        data
      ]);
      setDemoData({ analytics, clinical, cache });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = useClinicalData();
    loadData(data);
  }, []);

  const handleRefresh = async () => {
    const data = useClinicalData();
    setLoading(true);
    setError(null);
    await loadData(data);
  };

  // Check if all data is loaded before rendering tables
  const isDataReady =
    demoData.analytics && demoData.clinical && demoData.cache;

  const isAnalyticsEmpty = !demoData.analytics || demoData.analytics.length === 0;
  const isClinicalEmpty = !demoData.clinical || demoData.clinical.length === 0;
  const isCacheEmpty = !demoData.cache || demoData.cache.length === 0;

  if (loading)
    return (
      <div className="p-8 text-center">
        Loading Data Warehouse...<span className="loading loading-spinner"></span>
      </div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="demo-container">
      {/* Hero Section */}
      <section className="hero bg-base-200 min-h-screen flex items-center justify-center">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-white">Cancer Data Warehouse Demo</h1>
            <p className="py-4 text-base-content">
              Explore integrated insights across PostgreSQL, MongoDB, Redis, and Kafka.
            </p>
            <button
              onClick={handleRefresh}
              className="btn btn-info text-white mt-4"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="p-8">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">
          Clinical Data Visualizations
        </h2>
        <ClinicalCharts data={demoData.analytics} />
      </section>

      {/* Database Buttons */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-12 text-center">
        <button
          className="btn btn-soft  btn-info"
          onClick={() => setActiveModal("postgres")}
          disabled={!isDataReady || isAnalyticsEmpty}
        >
          Show PostgreSQL Table
        </button>
        <button
          className="btn btn-soft btn-accent"
          onClick={() => setActiveModal("mongo")}
          disabled={!isDataReady || isClinicalEmpty}
        >
          Show MongoDB Table
        </button>
        <button
          className="btn btn-soft btn-error"
          onClick={() => setActiveModal("redis")}
          disabled={!isDataReady || isCacheEmpty}
        >
          Show Redis Table
        </button>
      </section>

      {/* Kafka Stream */}
      <section className="px-8 pb-12">
        <h3 className="text-xl font-semibold mb-4">Kafka Stream</h3>
        <KafkaStream data={demoData.analytics} />
      </section>

      {/* Modal Rendering */}
      <AnimatePresence>
        {activeModal && isDataReady && (
          <Modal onClose={() => setActiveModal(null)} title={modalTitle(activeModal)}>
            {activeModal === "postgres" && !isAnalyticsEmpty && (
              <PostgresAnalytics data={demoData.analytics} />
            )}
            {activeModal === "mongo" && !isClinicalEmpty && (
              <MongoClinical data={demoData.clinical} />
            )}
            {activeModal === "redis" && !isCacheEmpty && (
              <RedisCache data={demoData.cache} />
            )}
            {/* Fallback if data is empty */}
            {(isAnalyticsEmpty && activeModal === "postgres") && (
              <p className="text-center text-red-500">No PostgreSQL data available.</p>
            )}
            {(isClinicalEmpty && activeModal === "mongo") && (
              <p className="text-center text-red-500">No MongoDB data available.</p>
            )}
            {(isCacheEmpty && activeModal === "redis") && (
              <p className="text-center text-red-500">No Redis data available.</p>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function modalTitle(type: "postgres" | "mongo" | "redis") {
  switch (type) {
    case "postgres":
      return "PostgreSQL Analytics";
    case "mongo":
      return "MongoDB Clinical Records";
    case "redis":
      return "Redis Cached Insights";
  }
}

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-base-100 rounded-xl w-[95vw] max-w-screen-xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl text-base-content hover:text-error transition"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Demo;