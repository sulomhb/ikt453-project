import { useEffect, useState } from "react";
import "./App.css";
import useClinicalData from "./hooks/useClinicalData";
import {
  populateMongoDB,
  populatePostgreSQL,
  populateRedis,
} from "./api/populate_db";
import SelectMongoDBComponent from "./components/MongoDB/select";

interface QuerySet {
  select: string;
  insert: string;
  update: string;
  delete: string;
}

const exampleQueries: Record<string, QuerySet> = {
  MongoDB: {
    select: "db.users.find({})",
    insert: "db.users.insertOne({ name: 'John', age: 30 })",
    update: "db.users.updateOne({ name: 'John' }, { $set: { age: 31 } })",
    delete: "db.users.deleteOne({ name: 'John' })",
  },
  Redis: {
    select: "GET user:1",
    insert: 'SET user:1 \'{"name": "John", "age": 30}\'',
    update: 'SET user:1 \'{"name": "John", "age": 31}\'',
    delete: "DEL user:1",
  },
  PostgreSQL: {
    select: "SELECT * FROM users;",
    insert: "INSERT INTO users (name, age) VALUES ('John', 30);",
    update: "UPDATE users SET age = 31 WHERE name = 'John';",
    delete: "DELETE FROM users WHERE name = 'John';",
  },
};

function App() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof exampleQueries>("MongoDB");
  const [queryResult, setQueryResult] = useState<string>("");
  const [clinicalDataState, setClinicalDataState] = useState<JSON>({} as JSON);

  const fetchAndPopulateData = async () => {
    try {
      const clinicalData = await useClinicalData();
      setClinicalDataState(clinicalData);
      console.log("POPULATING DBSES WITH: ", clinicalData);
      if (clinicalData) {
        const populateDBResponse = await fetch("http://localhost:3001/populate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clinicalData),
        });
        if (populateDBResponse.ok) {
          console.log("Databases populated successfully");
        }
        else {    
          console.error("Failed to populate databases");
        }
        const data = await populateDBResponse.json();
        console.log("Data populated in databases:", data);
      }
    } catch (error) {
      console.error("Error fetching or populating data:", error);
    }
  };

  const tabColors: Record<string, string> = {
    MongoDB: "green",
    Redis: "red",
    PostgreSQL: "blue",
  };

  const backgroundColors: Record<string, string> = {
    MongoDB: "#d0f0d0", // Light green
    Redis: "#f8d0d0", // Light red
    PostgreSQL: "#d0d8f8", // Light blue
  };

  const handleRunQuery = (queryType: keyof QuerySet) => {
    setQueryResult(`Result for: ${exampleQueries[activeTab][queryType]}`);
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: backgroundColors[activeTab],
      }}
    >
      {" "}
      <h1>IKT453 - Database Overview</h1>
      <div className="tabs">
        {Object.keys(exampleQueries).map((db) => (
          <button
            key={db}
            className={activeTab === db ? "active" : ""}
            onClick={() => setActiveTab(db as keyof typeof exampleQueries)}
            style={{
              backgroundColor: tabColors[db],
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {db}
          </button>
        ))}
      </div>
      <div
        className="content"
        style={{
          backgroundColor: backgroundColors[activeTab],
        }}
      >
        <h1>{activeTab}</h1>
        <p>
          <strong>Example Queries:</strong>
        </p>
        {(["select", "insert", "update", "delete"] as (keyof QuerySet)[]).map(
          (queryType) => (
            <div key={queryType}>
              <p>
                <strong>{queryType.toUpperCase()}:</strong>
              </p>
              <code>{exampleQueries[activeTab][queryType]}</code>
              <br />
              <br />
              <button onClick={() => handleRunQuery(queryType)}>
                Run {queryType}
              </button>
            </div>
          )
        )}
        <p>
          <strong>Result:</strong>
        </p>
        <pre>{queryResult}</pre>
        <button onClick={fetchAndPopulateData}>Populate DBses</button>
      </div>
    </div>
  );
}

export default App;
