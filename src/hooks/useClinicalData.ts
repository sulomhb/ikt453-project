import axios from "axios";

// This function fetches clinical data from multiple diverse TCGA projects with random offset
async function useClinicalData() {
  const casesEndpoint = "https://api.gdc.cancer.gov/cases";

  const randomOffset = Math.floor(Math.random() * 10000); // Adds randomness for more varied data

  const parameters = {
    filters: JSON.stringify({
      op: "in",
      content: {
        field: "project.project_id",
        value: [
          "TCGA-BRCA", "TCGA-LUAD", "TCGA-LAML", "TCGA-GBM", "TCGA-KIRC",
          "TCGA-OV", "TCGA-COAD", "TCGA-PRAD", "TCGA-STAD", "TCGA-SKCM"
        ]
      }
    }),
    size: 100,               // Get a sizable batch of records
    from: randomOffset,      // Start from a random point in the dataset
    expand: "diagnoses"      // Include diagnosis data inline
  };

  const response = await axios.get(casesEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    params: parameters,
  });

  const jsonResponse: any = response.data;
  const clinicalData = jsonResponse.data?.hits || [];
  console.log(clinicalData)
  return clinicalData;
}

export default useClinicalData;