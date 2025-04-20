import axios from 'axios';
// This hook fetches clinical data from the GDC API for a specific project (e.g., TCGA-BRCA)
async function useClinicalData() {

const casesEndpoint = "https://api.gdc.cancer.gov/cases"

const parameters = {
    "filters": JSON.stringify({
        "op": "in",
        "content": {
            "field": "project.project_id",
            "value": ["TCGA-BRCA"]
        }
    }),
    "size": 10,
    "expand": "diagnoses" // Optional: to include related diagnoses in the same response
}

const response = await axios.get(casesEndpoint, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    params: parameters
})
const jsonResponse : any = response.data;
const clinicalData = jsonResponse.data?.hits || [];
console.log("Clinical Data: ", clinicalData);
return clinicalData;
}

export default useClinicalData;