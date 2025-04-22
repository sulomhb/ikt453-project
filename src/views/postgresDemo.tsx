import { useEffect } from "react";

interface AnalyticsRow {
  primary_site?: string;
  lost_to_followup?: boolean;
  disease_type?: string;
  days_to_consent?: number;
  consent_type?: string;
  state?: string;
  diagnoses?: Diagnosis[];
}

interface Diagnosis {
  primary_diagnosis?: string;
  age_at_diagnosis?: number;
  year_of_diagnosis?: number;
  ajcc_pathologic_stage?: string;
  method_of_diagnosis?: string;
  ajcc_pathologic_t?: string;
  ajcc_pathologic_n?: string;
  ajcc_pathologic_m?: string;
  tissue_or_organ_of_origin?: string;
  metastasis_at_diagnosis?: string;
}

export const PostgresAnalytics = ({ data }: { data: AnalyticsRow[] }) => {

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

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      sendPostgresKafka(data); 
    } else {
      console.log("No analytical data to send.");
    }
  }, [data]);
  return (
    <div className="p-6 rounded-lg bg-base-100 shadow-md">
  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
  <table className="table">
          <thead>
            <tr>
              {[
                "Primary Site",
                "Disease Type",
                "Days to Consent",
                "Consent Type",
                "State",
                "Primary Diagnosis",
                "Age at Diagnosis",
                "Year of Diagnosis",
                "Pathologic Stage",
                "Diagnosis Method",
                "T",
                "N",
                "M",
                "Organ of Origin",
                "Metastasis",
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
            {data?.map((row, index) => {
              const diag = row.diagnoses?.[0] || {};
              return (
                <tr key={index}>
                  <td style={cellStyle}>{row.primary_site}</td>
                  <td style={cellStyle}>{row.disease_type}</td>
                  <td style={cellStyle}>{row.days_to_consent}</td>
                  <td style={cellStyle}>{row.consent_type}</td>
                  <td style={cellStyle}>{row.state}</td>
                  <td style={cellStyle}>{diag.primary_diagnosis}</td>
                  <td style={cellStyle}>
                    {diag.age_at_diagnosis
                      ? Math.floor(diag.age_at_diagnosis / 365.25)
                      : "N/A"}
                  </td>
                  <td style={cellStyle}>{diag.year_of_diagnosis}</td>
                  <td style={cellStyle}>{diag.ajcc_pathologic_stage}</td>
                  <td style={cellStyle}>{diag.method_of_diagnosis}</td>
                  <td style={cellStyle}>{diag.ajcc_pathologic_t}</td>
                  <td style={cellStyle}>{diag.ajcc_pathologic_n}</td>
                  <td style={cellStyle}>{diag.ajcc_pathologic_m}</td>
                  <td style={cellStyle}>{diag.tissue_or_organ_of_origin}</td>
                  <td style={cellStyle}>{diag.metastasis_at_diagnosis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const cellStyle = {
  border: "1px solid black",
  padding: "8px",
};
