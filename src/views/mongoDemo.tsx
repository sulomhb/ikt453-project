import { useEffect, useState } from "react";

export const MongoClinical = ({ data }: { data: any }) => {
  const sendMongoDBKafka = async (payload: any) => {
    const url = "http://localhost:3001/kafka/send-clinical-data";
    try {
      if (!payload || !payload.clinicalData) {
        console.error("Invalid payload, missing 'clinicalData'.");
        return;
      }
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error("Error sending data to Kafka:", error);
    }
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      sendMongoDBKafka({ clinicalData: data }); 
    } else {
      console.log("No clinical data to send.");
    }
  }, [data]);

  return (
    <>
       <div className="p-6 rounded-lg bg-base-100 shadow-md">
  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table className="table">
          <thead>
            <tr>
              {[
                "Key",
                "Value",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
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
                      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data[key])}</pre>
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
  </>
  );
};