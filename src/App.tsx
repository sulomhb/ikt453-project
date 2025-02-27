import { useState } from 'react';
import './App.css';

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
    delete: "db.users.deleteOne({ name: 'John' })"
  },
  Redis: {
    select: "GET user:1",
    insert: "SET user:1 '{\"name\": \"John\", \"age\": 30}'",
    update: "SET user:1 '{\"name\": \"John\", \"age\": 31}'",
    delete: "DEL user:1"
  },
  PostgreSQL: {
    select: "SELECT * FROM users;",
    insert: "INSERT INTO users (name, age) VALUES ('John', 30);",
    update: "UPDATE users SET age = 31 WHERE name = 'John';",
    delete: "DELETE FROM users WHERE name = 'John';"
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<keyof typeof exampleQueries>('MongoDB');
  const [queryResult, setQueryResult] = useState<string>('');

  const handleRunQuery = (queryType: keyof QuerySet) => {
    setQueryResult(`Result for: ${exampleQueries[activeTab][queryType]}`);
  };

  return (
    <div className="App">
      <h1>IKT453 - Database Project</h1>
      <div className="tabs">
        {Object.keys(exampleQueries).map((db) => (
          <button 
            key={db} 
            className={activeTab === db ? 'active' : ''} 
            onClick={() => setActiveTab(db as keyof typeof exampleQueries)}
          >
            {db}
          </button>
        ))}
      </div>
      <div className="content">
        <h2>{activeTab}</h2>
        <p><strong>Example Queries:</strong></p>
        {(['select', 'insert', 'update', 'delete'] as (keyof QuerySet)[]).map((queryType) => (
          <div key={queryType}>
            <p><strong>{queryType.toUpperCase()}:</strong></p>
            <code>{exampleQueries[activeTab][queryType]}</code>
            <br /><br />
            <button onClick={() => handleRunQuery(queryType)}>Run {queryType}</button>
          </div>
        ))}
        <p><strong>Result:</strong></p>
        <pre>{queryResult}</pre>
      </div>
    </div>
  );
}

export default App;