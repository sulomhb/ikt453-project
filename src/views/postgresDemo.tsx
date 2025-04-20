import { useEffect, useState } from "react";

export const PostgresAnalytics = (data : any) => {
    const [analytics, setAnalytics] = useState("");
    const test = data;
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre> {/* Replace with MongoDB queries */}
      </div>
    );
  };