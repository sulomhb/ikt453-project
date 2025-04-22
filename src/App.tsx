import React, { useState } from "react";
import "./App.css";
import { KafkaStream } from "./views/kafkaDemo";

interface QuerySet {
  select: any;
  insert: any;
  update: any;
  delete: any;
}

const exampleQueries: Record<string, QuerySet> = {
  MongoDB: {
    insert: {
      Diagnosis_ID: 1,
      disease_type: "INSERTED Glioblastoma",
      primary_diagnosis: "INSERTED Primary Glioblastoma",
      age_at_diagnosis: 55,
      year_of_diagnosis: 2025,
      ajcc_pathologic_stage: "Stage IV",
      method_of_diagnosis: "INSERTED Surgical Resection",
      ajcc_pathologic_t: "T4",
      ajcc_pathologic_n: "N1",
      ajcc_pathologic_m: "M0",
      tissue_or_organ_of_origin: "Brain, NOS",
      metastasis_at_diagnosis: "No",
    },
    select: { Diagnosis_ID: 1 },
    update: {
      filter: { Diagnosis_ID: 1 },
      update: {
        ajcc_pathologic_stage: "UPDATED Stage III",
        method_of_diagnosis: "UPDATED MRI Imaging",
      },
    },
    delete: { Diagnosis_ID: 1 },
  },
  Redis: {
    insert: {
      key: "dimdiagnosis:101",
      value: {
        Diagnosis_ID: "101",
        disease_type: "INSERTED Colorectal Cancer",
        primary_diagnosis: "INSERTED Colon Adenocarcinoma",
        age_at_diagnosis: "62",
        year_of_diagnosis: "2023",
        ajcc_pathologic_stage: "Stage IIIB",
        method_of_diagnosis: "Colonoscopy Biopsy",
        ajcc_pathologic_t: "T3",
        ajcc_pathologic_n: "N2",
        ajcc_pathologic_m: "M0",
        tissue_or_organ_of_origin: "Colon",
        metastasis_at_diagnosis: "No",
      },
    },
    select: { key: "dimdiagnosis:101" },
    update: {
      key: "dimdiagnosis:101",
      value: {
        ajcc_pathologic_stage: "UPDATED Stage IIA  - DEMO",
        method_of_diagnosis: "UPDATED Genetic Testing - DEMO",
      },
    },
    delete: "dimdiagnosis:101",
  },
  PostgreSQL: {
    insert: {
      diagnosis_id: 101,
      disease_type: "INSERTED Lung Adenocarcinoma",
      primary_diagnosis: "Stage II Lung Adenocarcinoma",
      age_at_diagnosis: 60,
      year_of_diagnosis: 2024,
      ajcc_pathologic_stage: "Stage II",
      method_of_diagnosis: "CT Scan",
      ajcc_pathologic_t: "T2",
      ajcc_pathologic_n: "N0",
      ajcc_pathologic_m: "M0",
      tissue_or_organ_of_origin: "Lung",
      metastasis_at_diagnosis: "No",
    },
    select: { diagnosis_id: 101 },
    update: {
      id: 101,
      disease_type: "UPDATED Lung Cancer",
      age_at_diagnosis: 61,
    },
    delete: { id: 101 },
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<keyof typeof exampleQueries>("MongoDB");
  const [queryResult, setQueryResult] = useState<string>("");

  const tabColors: Record<string, string> = {
    MongoDB: "green",
    Redis: "red",
    PostgreSQL: "blue",
  };

  const backgroundColors: Record<string, string> = {
    MongoDB: "#d0f0d0",
    Redis: "#f8d0d0",
    PostgreSQL: "#d0d8f8",
  };

  const sendMongoDBKafka = async (payload: any) => {
    const url = "http://localhost:3001/kafka/send-clinical-data";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  const sendPostgresKafka = async (data: any) => {
    const url = "http://localhost:3001/kafka/send-analytics-data";
    try {
      const payload = {
        analyticsData: {
          value: JSON.stringify(data),
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };
  const sendRedisKafka = async (data: any) => {
    const url = "http://localhost:3001/kafka/send-cache-data";
    try {
      const payload = {
        cacheData: data, // <== send the object directly, not wrapped in `.value`
      };
  
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const text = await response.text(); // since you send a plain string back
      console.log(text);
    } catch (error) {
      console.error(error);
    }
  };

  const routeMap: Record<string, string> = {
    MongoDB: "mongodb",
    Redis: "redis",
    PostgreSQL: "postgres", // ✅ not 'postgresql'
  };

  const handleRunQuery = async (queryType: keyof QuerySet) => {
    let query = exampleQueries[activeTab][queryType];
  
    // Fix for Redis select/delete sending plain strings
    if (activeTab === "Redis" && typeof query === "string") {
      query = { key: query };  // convert string to object if needed
    }
  
    const endpoint = `http://localhost:3001/${routeMap[activeTab]}/${queryType}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
  
      // Send Kafka messages
      if (activeTab === "MongoDB") {
        await sendMongoDBKafka({ clinicalData: query });
      } else if (activeTab === "PostgreSQL") {
        await sendPostgresKafka(query);
      } else if (activeTab === "Redis") {
        await sendRedisKafka(query);
      }
  
      const data = await response.json();
      setQueryResult(JSON.stringify(data.data, null, 2));
    } catch (err: any) {
      setQueryResult(`Error: ${err.message || err}`);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: backgroundColors[activeTab] }}>
      <div className="tabs flex gap-4 p-4 justify-center">
        <button
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
          onClick={() => window.location.assign("/demo")}
        >
          Demo
        </button>
        {Object.keys(exampleQueries).map((db) => (
          <button
            key={db}
            className={`py-2 px-4 rounded-lg text-white transition ${
              activeTab === db ? "bg-gray-800" : `bg-${tabColors[db]}-900`
            } hover:bg-opacity-80`}
            onClick={() => setActiveTab(db as keyof typeof exampleQueries)}
          >
            {db}
          </button>
        ))}
      </div>

      <div className="content max-w-4xl mx-auto p-6 rounded-lg shadow-xl my-6" style={{ backgroundColor: backgroundColors[activeTab] }}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">{activeTab}</h1>
        <p className="font-bold text-xl text-black">Result:</p>
        <pre className="bg-gray-100 p-4 rounded-lg mb-6 text-black whitespace-pre-wrap">
          {queryResult}
        </pre>

        <p className="font-bold text-xl text-black">Example Queries:</p>
        {(["select", "insert", "update", "delete"] as (keyof QuerySet)[]).map((queryType) => (
          <div key={queryType} className="query-container mb-6">
            <p className="font-semibold text-lg text-black">{queryType.toUpperCase()}:</p>
            <code className="block bg-gray-200 p-4 rounded-lg text-black font-mono whitespace-pre-wrap">
              {JSON.stringify(exampleQueries[activeTab][queryType], null, 2)}
            </code>
            <button
              onClick={() => handleRunQuery(queryType)}
              className="mt-3 bg-black text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Run {queryType}
            </button>
          </div>
        ))}
      </div>

      <KafkaStream data={""} />
    </div>
  );
}

export default App;