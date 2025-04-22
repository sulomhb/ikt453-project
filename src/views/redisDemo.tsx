import { useEffect, useRef, useState } from "react";

export const RedisCache = ({ data }: { data: any }) => {

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

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      sendRedisKafka(data); 
    } else {
      console.log("No cache data to send.");
    }
  }, [data]);

  return (
    <div className="p-6 rounded-lg bg-base-100 shadow-md">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              {["Key", "Value"].map((heading) => (
                <th
                  key={heading}
                  className="border px-4 py-2 text-left font-semibold"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => (
              <tr key={key}>
                <td className="p-4 font-semibold bg-base-200">{key}</td>
                <td className="p-4">
                  {typeof data[key] === "object" && data[key] !== null ? (
                    <div className="max-w-full overflow-x-auto">
                      <pre className="whitespace-pre-wrap break-words text-sm text-white">
                        {JSON.stringify(data[key])}
                      </pre>
                    </div>
                  ) : (
                    data[key] || "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};