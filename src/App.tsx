import React, { useState } from "react";
import "./App.css";

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
      {/* Tab Navigation */}
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
            className={`py-2 px-4 rounded-lg text-white transition ${activeTab === db ? "bg-gray-800" : `bg-${tabColors[db]}-900`} hover:bg-opacity-80`}
            onClick={() => setActiveTab(db as keyof typeof exampleQueries)}
          >
            {db}
          </button>
        ))}
      </div>

      {/* Query Content */}
      <div
        className="content max-w-4xl mx-auto p-6 rounded-lg shadow-xl my-6"
        style={{
          backgroundColor: backgroundColors[activeTab],
        }}
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-black">{activeTab}</h1>
        <p className="font-bold text-xl text-black">Result:</p>
        <pre className="bg-gray-100 p-4 rounded-lg mb-6 text-black">{queryResult}</pre>

        <p className="font-bold text-xl text-black">Example Queries:</p>
        {(["select", "insert", "update", "delete"] as (keyof QuerySet)[]).map(
          (queryType) => (
            <div key={queryType} className="query-container mb-6">
              <p className="font-semibold text-lg text-black">{queryType.toUpperCase()}:</p>
              <code className="block bg-gray-200 p-4 rounded-lg text-black font-mono">{exampleQueries[activeTab][queryType]}</code>
              <button
                onClick={() => handleRunQuery(queryType)}
                className="mt-3 bg-black text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Run {queryType}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;