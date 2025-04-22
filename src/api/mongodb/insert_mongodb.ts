import { connectMongoDB } from "./connect_mongodb.ts";

export async function insertMongoDB(document: any) {
  const mongoClient = await connectMongoDB();
  const db = mongoClient.db("clinical_data");
  const result = await db.collection("DimDiagnosis").insertOne(document);
  return result;
}

/* 
{
    "id": "13d12179-3182-4f41-85a2-90fd50e51480",
    "slide_ids": [
        "cef1d138-7b32-498e-bd26-e67a273045bc",
        "e207237a-0e08-4d39-8dfb-51336a4920de",
        "419d55c5-ba3b-47df-b15f-0ee311ede84d",
        "6c7c18ed-f540-47cf-ad54-19891d5a59a2"
    ],
    "submitter_slide_ids": [
        "TCGA-06-1802-01Z-00-DX1",
        "TCGA-06-1802-01A-01-TS1",
        "TCGA-06-1802-01A-01-BS1",
        "TCGA-06-1802-01Z-00-DX2"
    ],
    "disease_type": "Gliomas",
    "analyte_ids": [
        "04ae54f2-e472-48fc-9eb6-385f7de6b0bb",
        "0c2ef7d3-9a31-460d-91f5-d6d454c4f281",
        "fec600ce-347e-4a72-923b-3c65cdf97da5",
        "50913e9c-9b07-4031-b705-df1292844c55",
        "4b5260dc-9295-4a49-b9d8-f83981f214e4",
        "3cd94bdb-71ed-476d-8a5c-09b105d16878"
    ],
    "submitter_id": "TCGA-06-1802",
    "submitter_analyte_ids": [
        "TCGA-06-1802-01A-01T",
        "TCGA-06-1802-10A-01W",
        "TCGA-06-1802-01A-01W",
        "TCGA-06-1802-01A-01R",
        "TCGA-06-1802-01A-01D",
        "TCGA-06-1802-10A-01D"
    ],
    "aliquot_ids": [
        "71047156-de4c-4ce5-ab6f-445f9fb1ccb4",
        "584f749c-3e41-4021-ad9a-ce87841b9bdc",
        "74f5acb8-8a6e-43ab-8fda-6637ab50fc74",
        "ff6e0c18-4f42-4a72-83ff-b421c8fd356b",
        "b91811a5-cba3-4fa0-b4cd-725336d09a80",
        "514e27be-638b-4ec8-84e8-d5c834ba4bde",
        "8eb7112f-07b5-4d17-8db3-09c501116f08",
        "220b855a-8d5b-4dfa-a958-222b1fd5a4b7",
        "7e8913ba-2a3a-4ce3-9949-8763b030fb9a",
        "5987a252-7165-43cd-ad1a-3dcf7acddbb0",
        "58abb3e5-a8db-4e30-b2bf-46451d5273df",
        "8195fd62-d963-4fdc-8040-d3fe004505d3",
        "52a0f048-fbb9-4846-ad21-92aa66b4d387",
        "d04ba243-b94a-4d66-a1de-2c3d1be66afc",
        "1aad340a-f81e-463c-b1d5-6f693282d6c8",
        "23f6eed7-3704-49d7-b662-71b65241060b",
        "7e4048b4-b331-4aec-b3a6-02f4614918e3",
        "80632df8-1628-4cfc-829c-e0f26df286fb",
        "7c8b5308-c357-4c04-a11d-834654b84820",
        "9b716cdc-7dc8-4ee3-a9ea-f2812b26cf91",
        "93f6246f-006e-4c00-826b-0a408709aaf4",
        "80a9b5c2-c727-484b-9f6b-8402f2fb15f5",
        "77240445-f333-4c46-b958-89b1ebd5abbf",
        "7b54c7d0-9133-47b3-802f-88e6186b3ace"
    ],
    "submitter_aliquot_ids": [
        "TCGA-06-1802-10A-01D-1003-01",
        "TCGA-06-1802-01A-01W-0641-10",
        "TCGA-06-1802-01A-01R-0596-01",
        "TCGA-06-1802-01A-01T-0599-07",
        "TCGA-06-1802-01A-01W-0645-09",
        "TCGA-06-1802-01A-01D-1003-01",
        "TCGA-06-1802-01A-01D-0592-04",
        "TCGA-06-1802-01A-01D-0593-06",
        "TCGA-06-1802-10A-01D-0593-06",
        "TCGA-06-1802-10A-01D-A922-36",
        "TCGA-06-1802-01A-01D-A922-36",
        "TCGA-06-1802-10A-01D-0591-01",
        "TCGA-06-1802-01A-01D-0595-05",
        "TCGA-06-1802-01A-01D-0594-02",
        "TCGA-06-1802-10A-01W-0645-09",
        "TCGA-06-1802-01A-01W-0643-08",
        "TCGA-06-1802-10A-01D-0594-02",
        "TCGA-06-1802-10A-01W-0641-10",
        "TCGA-06-1802-01A-01R-0597-03",
        "TCGA-06-1802-10A-01W-0643-08",
        "TCGA-06-1802-01A-01R-0598-07",
        "TCGA-06-1802-10A-01D-0592-04",
        "TCGA-06-1802-01A-01R-A96S-41",
        "TCGA-06-1802-01A-01D-0591-01"
    ],
    "diagnoses": [
        {
            "morphology": "Unknown",
            "submitter_id": "TCGA-06-1802_diagnosis3",
            "days_to_diagnosis": 81,
            "created_datetime": "2025-01-05T16:32:23.585795-06:00",
            "tissue_or_organ_of_origin": "Not Reported",
            "age_at_diagnosis": 22618,
            "primary_diagnosis": "Unknown",
            "classification_of_tumor": "Unknown",
            "tumor_of_origin": "TCGA-06-1802_diagnosis",
            "updated_datetime": "2025-01-08T13:04:42.547044-06:00",
            "diagnosis_id": "70272ac5-2dec-4fdc-872f-1bb5387b00c4",
            "site_of_resection_or_biopsy": "Not Reported",
            "state": "released",
            "prior_treatment": "Yes",
            "diagnosis_is_primary_disease": false
        },
        {
            "morphology": "9440/3",
            "submitter_id": "TCGA-06-1802_diagnosis2",
            "days_to_diagnosis": 81,
            "created_datetime": "2025-01-05T16:32:23.585795-06:00",
            "tissue_or_organ_of_origin": "Not Reported",
            "age_at_diagnosis": 22618,
            "primary_diagnosis": "Glioblastoma",
            "classification_of_tumor": "recurrence",
            "tumor_of_origin": "TCGA-06-1802_diagnosis",
            "updated_datetime": "2025-01-08T13:04:42.547044-06:00",
            "diagnosis_id": "afd9875d-831c-4ed7-aea8-345fcbc1487e",
            "site_of_resection_or_biopsy": "Not Reported",
            "state": "released",
            "prior_treatment": "Yes",
            "diagnosis_is_primary_disease": false
        },
        {
            "synchronous_malignancy": "Not Reported",
            "days_to_diagnosis": 0,
            "created_datetime": null,
            "last_known_disease_status": null,
            "tissue_or_organ_of_origin": "Brain, NOS",
            "days_to_last_follow_up": null,
            "age_at_diagnosis": 22537,
            "primary_diagnosis": "Glioblastoma",
            "updated_datetime": "2025-01-08T13:04:42.547044-06:00",
            "prior_malignancy": "not reported",
            "year_of_diagnosis": 2008,
            "state": "released",
            "prior_treatment": "No",
            "diagnosis_is_primary_disease": true,
            "days_to_last_known_disease_status": null,
            "method_of_diagnosis": "Surgical Resection",
            "days_to_recurrence": null,
            "morphology": "9440/3",
            "submitter_id": "TCGA-06-1802_diagnosis",
            "classification_of_tumor": "primary",
            "diagnosis_id": "f76fe9e8-12c5-5109-8f9c-41479b1c3378",
            "icd_10_code": "C71.9",
            "site_of_resection_or_biopsy": "Brain, NOS",
            "tumor_grade": null,
            "progression_or_recurrence": null
        }
    ],
    "created_datetime": null,
    "diagnosis_ids": [
        "70272ac5-2dec-4fdc-872f-1bb5387b00c4",
        "f76fe9e8-12c5-5109-8f9c-41479b1c3378",
        "afd9875d-831c-4ed7-aea8-345fcbc1487e"
    ],
    "sample_ids": [
        "a24403fd-5902-447e-b5ac-745ce3396f9e",
        "57b6740d-9942-4a6d-af95-0298050da414",
        "1edd87d6-c63a-4526-ac90-f7aa57ccea2e"
    ],
    "submitter_sample_ids": [
        "TCGA-06-1802-01Z",
        "TCGA-06-1802-10A",
        "TCGA-06-1802-01A"
    ],
    "primary_site": "Brain",
    "submitter_diagnosis_ids": [
        "TCGA-06-1802_diagnosis",
        "TCGA-06-1802_diagnosis2",
        "TCGA-06-1802_diagnosis3"
    ],
    "updated_datetime": "2025-01-05T16:32:23.585795-06:00",
    "case_id": "13d12179-3182-4f41-85a2-90fd50e51480",
    "index_date": "Diagnosis",
    "state": "released",
    "portion_ids": [
        "53f1182c-9d4a-4c8d-bf1f-cc605e4976ec",
        "f6d43caa-c616-4673-a0b6-59e45b402960",
        "5a3f6d91-b104-4ca5-afed-b0a0c730f845",
        "bf2ab0e5-db50-4d08-a0cc-580e1daa7aa6"
    ],
    "submitter_portion_ids": [
        "TCGA-06-1802-01A-21",
        "TCGA-06-1802-01A-01",
        "TCGA-06-1802-01A-21-1899-20",
        "TCGA-06-1802-10A-01"
    ]
}
    */