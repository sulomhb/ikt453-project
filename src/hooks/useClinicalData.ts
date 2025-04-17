import axios from 'axios';
// This hook fetches clinical data from the GDC API for a specific project (e.g., TCGA-BRCA)
async function useClinicalData() {

const casesEndpoint = "https://api.gdc.cancer.gov/cases"

const parameters = {
    "filters": JSON.stringify({
        "op": "and",
        "content": [
            {"op": "in", "content": {"field": "project.project_id", "value": ["TCGA-BRCA"]}},
            {"op": "in", "content": {"field": "files.data_type", "value": ["Clinical Supplement"]}}
        ]
    }),
    "size": 10  // Get 100 patient records
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